const { db } = require('./index'); // Import DB query function.

const getCart = async (req, res) => {
    console.log("Getting cart")

    // SQL select statement to retrieve cart_id, product_id, product name, product description product quantity
    // in cart and product line total by merging tables cart_products, cart and products by user.
    const text = 'SELECT \
        c.id AS cart_id,\
        p.id AS product_id,\
        p.name, \
        p.description,\
        cp.quantity,\
        (cp.quantity * p.price) AS line_total\
    FROM cart_products AS cp\
    JOIN cart AS c\
        ON c.id = cp.cart_id\
    JOIN products AS p\
        ON cp.product_id = p.id\
    WHERE c.user_id = $1'
    
    // User id from request set as argument in parameters array.
    const parameters = [req.user.id]
    try {
        // Query database with prepared statement and parameters.
        const results = await db.query(text, parameters);
        if (results.rows.length > 0) {
            // If results is not 0, assign cart results to cart variable.
            const cart = results.rows
            // Map over each item to accumulate the line totals to find cart total and assign to variable cartTotal
            const prices = cart.map(item => parseInt(item.line_total.replace('$', '')));
            const cartTotal = "$" + prices.reduce((accumulator, item) => {
                return accumulator + item;
            }, 0);
            // Return variables cart and cartTotal as a json object.
            res.status(200).json({cart, cartTotal})
        }
        // If results is 0, return json object with message that cart is empty.
        else {
            res.status(200).json({msg: "Your cart is empty"});
        }
    } catch (error) {
        res.status(400).json({msg: "Bad request"});
    }
}

// Checkout cart converts cart into an order and deletes old cart from cart table and stores in an archived table.
// This step involves multiple database queries
const checkoutCart = async (req, res) => {

    // Get cart_id by user id. There can only be 1 cart id per user in cart table at a time.
    const getCartId = 'SELECT id FROM cart WHERE user_id = $1';

    // Create a temporary cart table to hold all product details for cart.
    const cartDetailsTempTable = '\
        CREATE TEMP TABLE cart_details (cart_id, product_id, quantity, price) AS\
        SELECT cp.cart_id, cp.product_id, cp.quantity, products.price\
        FROM cart_products as cp\
        JOIN products ON cp.product_id = products.id\
        WHERE cart_id = $1';
    
    // Create a second temp table to hold blueprint of a new order with calculated total cost
    const newOrderTempTable = 'CREATE TEMP TABLE new_order (status, total, user_id) AS\
            SELECT \'Not paid\', SUM(cart_details.price), $1 FROM cart_details'

    // Get order total to compare with the payment sum sent in request body to determine if order should be placed or not.
    const checkPayment = 'SELECT total FROM new_order WHERE user_id = $1'

    // Insert new order into orders table. using new ID return value, insert into the orders_products cross reference table
    const insertNewOrder = 'WITH new_id AS (\
        INSERT INTO orders (status, total, user_id)\
        SELECT status, total, user_id FROM new_order\
        RETURNING id\
        )\
        INSERT INTO orders_products (order_id, product_id, quantity)\
        SELECT new_id.id, cart_details.product_id, cart_details.quantity FROM new_id, cart_details';

    // No longer required as it has been added as a trigger in DB 
    // const archiveCart = 'INSERT INTO cart_archive SELECT * FROM cart WHERE id = $1'
    const deleteCart = 'DELETE FROM cart WHERE id = $1'

    // Start db client to perform transaction
    const client = await db.getClient();
    try {
        // Start transaction
        await client.query('BEGIN');
        try {
            // Get the cart ID by user ID in request
            const firstResult = await client.query(getCartId, [req.user.id]);
            const { rows: [{ id: cartId }]} = firstResult;

            // Create cart temp table to calculate information to create order
            await client.query(cartDetailsTempTable, [cartId]);

            // Create temp order table which is blue prints for a new order
            await client.query(newOrderTempTable, [req.user.id]);

            //  Get order sum to check customer has sufficient funds
            const results = await client.query(checkPayment, [req.user.id]);
            const orderSum = results.rows[0].total.slice(1);

            // Return failed message if payment funds is insufficient.
            if (orderSum != req.body.paymentSum) {
                res.status(400).json({msg: "Payment failed due to insufficient funds."})
            }
            else {
                // Insert new order into database.
                await client.query(insertNewOrder);
                
                // Added as a trigger in DB
                // await client.query(archiveCart, [cartId])

                // Delete cart. Archiving is handled automatically by database.
                await client.query(deleteCart, [cartId]);
                // Commit transaction
                await client.query('COMMIT');

                // If no error. Return success code with message that order has been placed.
                res.status(200).json({msg: "Your order has been placed"})
            }
        } 
        catch (error) {

            // If error, rollback transaction
            client.query('ROLLBACK');
            // Return server error code with error object.
            res.status(500).json({error})
        }
    } 
    finally {
        // Release database connection regardless of success or failure.
        client.release();
    }
}

// Export cart functions.
module.exports = {
    getCart,
    checkoutCart
}