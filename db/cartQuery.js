// Import DB and Authentication functions
const { db } = require('./index');

const getCart = async (req, res) => {
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
    
    const parameters = [req.user.id]
    try {
        const results = await db.query(text, parameters);
        if (results.rows.length > 0) {
            const cart = results.rows
            const prices = cart.map(item => parseInt(item.line_total.replace('$', '')));
            const cartTotal = "$" + prices.reduce((accumulator, item) => {
                return accumulator + item;
            }, 0);        
            res.status(200).json({cart, cartTotal})
        } 
        else {
            res.status(200).json({msg: "Your cart is empty"});
        }
    } catch (error) {
        res.status(400).json({msg: "Bad request"});
    }
}

const checkoutCart = async (req, res) => {
    // Get cart_id 
    const getCartId = 'SELECT id FROM cart WHERE user_id = $1';

    // Create a temporary cart table to hold all product details in cart.
    const cartDetailsTempTable = '\
        CREATE TEMP TABLE cart_details (cart_id, product_id, quantity, price) AS\
        SELECT cp.cart_id, cp.product_id, cp.quantity, products.price\
        FROM cart_products as cp\
        JOIN products ON cp.product_id = products.id\
        WHERE cart_id = $1';
    
    // Create a second temp table to hold blueprint of a new order with calculated total cost
    const newOrderTempTable = 'CREATE TEMP TABLE new_order (status, total, user_id) AS\
            SELECT \'Not paid\', SUM(cart_details.price), 1 FROM cart_details'

    // Get order total to compare with the payment sum sent in request body to determine if order should be placed or not.
    const checkPayment = 'SELECT total FROM new_order WHERE user_id = $1'

    // Insert new order into orders table, with returning value of new ID, insert into the orders_products cross reference table
    const insertNewOrder = 'WITH new_id AS (\
        INSERT INTO orders (status, total, user_id)\
        SELECT status, total, user_id FROM new_order\
        RETURNING id\
        )\
        INSERT INTO orders_products (order_id, product_id, quantity)\
        SELECT new_id.id, cart_details.product_id, cart_details.quantity FROM new_id, cart_details';

    const archiveCart = 'INSERT INTO cart_archive SELECT * FROM cart WHERE id = $1'
    const deleteCart = 'DELETE FROM cart WHERE id = $1'

    // Start db client and perform transaction
    const client = await db.getClient();
    try {
        await client.query('BEGIN');
        try {
            const firstResult = await client.query(getCartId, [req.user.id]);
            const { rows: [{ id: cartId }]} = firstResult;

            await client.query(cartDetailsTempTable, [cartId]);
            await client.query(newOrderTempTable);

            const results = await client.query(checkPayment, [req.user.id]);
            const orderSum = results.rows[0].total.slice(1);
            if (orderSum != req.body.paymentSum) {
                res.status(400).json({msg: "Payment failed due to insufficient funds."})
            } else {
                await client.query(insertNewOrder);
                await client.query(archiveCart, [cartId])
                await client.query(deleteCart, [cartId]);
                client.query('COMMIT');
                res.status(200).json({msg: "Your order has been placed"})
            }
        } catch (error) {
            client.query('ROLLBACK');
            res.status(500).json({error})
        }
    } finally {
        client.release();
    }
}

module.exports = {
    getCart,
    checkoutCart
}