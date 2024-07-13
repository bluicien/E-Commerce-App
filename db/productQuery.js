// Import DB
const { db } = require('./index')

// Get all products function
const getProducts = async (req, res) => {
    console.log("Getting products...")
    let text; 
    let parameters;
    // If query parameter with name exists in request, assign given content to the sql statement and parameter.
    if (req.query.name) {
        text = 'SELECT * FROM products WHERE LOWER(name) = $1';
        parameters = [req.query.name]
    }
    // If query parameter with category exists in request, assign given content to the sql statement and parameter.
    else if (req.query.category) {
        text = 'SELECT products.*\
            FROM categories\
            INNER JOIN products_categories\
                ON products_categories.category_id = categories.id AND LOWER(categories.name) = $1\
            INNER JOIN products\
                ON products.id = products_categories.product_id';
        parameters = [req.query.category]
    }
    // If there are no query parameters, assign given content to sql statement with no parameters.
    else {
        text = 'SELECT * FROM products LIMIT 10'
    }
    
    try {
        // Query database with prepared statements and parameters.
        const results = await db.query(text, parameters);

        // If results exist, return in json object
        if (results.rows.length > 0) {
            res.status(200).json(results.rows);
        } 
        // If no results found, return products not found
        else {
            res.status(200).json({msg: "No products found."})
        }
    } 
    // If error, return 500 server error.
    catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred"});
    }
}


// Get the product id parameter from request and query database for existence. If product with that id exists,
// assign the id to req.productId and continue.
const productIdParam = async (req, res, next, id) => {
    console.log(`Searching ID ${id}`);
    try {
        const results = await db.query('SELECT EXISTS (SELECT id FROM products WHERE id = $1)', [id]);
        if (results.rows[0].exists) {
            req.productId = id;
            next();
        }
        // If no product with parameter id exists, return msg: "Product not found"
        else {
            res.status(404).json({msg: "Product not found"});
        }
    }
    // If error, return status code 500
    catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred"});
    }
}

// Query database for product with id matching the req.productId and return the product 
const getProductById = async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM products WHERE id = $1', [req.productId]);
        res.status(200).json(results.rows[0]);
    } 
    // If error, return status code 500
    catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred"});
    }
}

// POST request that takes a name, description, brand_id and price and inserts new entry into database
const postProduct = async (req, res) => {
    const { name, description, brand_id, price } = req.body;
    const text = 'INSERT INTO products (name, description, brand_id, price) VALUES ($1, $2, $3, $4) RETURNING *';
    const parameters = [name, description, brand_id, price]
    
    try {
        const results = await db.query(text, parameters);
        res.status(200).json({msg: "Product was created", newProduct: results});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred. Failed to create product"}); 
    }
}

// POST request that takes a name, description, brand_id and price and updates the
// database entry with id matching req.productId
const updateProduct = async (req, res) => {
    const { name, description, brand_id, price } = req.body;
    const text = 'UPDATE products SET name = $1, description = $2, brand_id = $3, price = $4 WHERE id = $5';
    const parameters = [name, description, brand_id, price, req.productId]

    try {
        results = await db.query(text, parameters)
        res.status(200).json({msg: "Product updated successfully."});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred. Failed to update."}); 
    }
}


// DELETE request, that takes a productId parameter and deletes an entry in the database.
const deleteProduct = async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = $1', [req.productId])
        res.status(200).send("Product deleted successfully.");    
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred. Failed to delete."}); 
    }
}

// POST request to add the product of req.productId to the user's cart.
// Takes 3 parameters, req.user.id which is sent with all requests, req.productId from URL parameter
// and quantity from the request body, req.body.quantity.
const addToCart = async (req, res) => {

    // Get the Cart Id of logged in User
    const getCartId = 'SELECT id FROM cart WHERE user_id = $1';

    // Checks if the product already exists in cart
    const checkIfExistsInCart = 'SELECT EXISTS(SELECT product_id FROM cart_products WHERE cart_id = $1)';

    // Updates quantity in cart if product already exists in cart
    const addQuantity = 'UPDATE cart_products SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3';

    // If there product isn't already in cart, inserts new entry
    const newCartProduct = 'INSERT INTO cart_products(cart_id, product_id, quantity)\
      SELECT $1, $2, $3 FROM user_cart';


    // Resets quantity to new value if a boolean req.body.newQuantity is provided.
    // This is set when customer manually sets quantity from cart page.
    const newQuantity = 'UPDATE cart_products SET quantity = $1 WHERE cart_id = $2 AND product_id = $3';

    // Connect to database pool.
    const client = await db.getClient();
    try {
        // Start transaction
        await client.query('BEGIN');
        try {
            // Get cartId for logged in user. 
            const { rows: [{ id: cartId }]} = await client.query(getCartId, [req.user.id]);

            // Check if product already exists in cart.
            const { rows: [{ exists: existsInCart}]} = await client.query(checkIfExistsInCart, [cartId]);

            if (existsInCart) {
                
                if (req.body.newQuantity) {
                    // If the a request is made from cart page to change quantity, a newQuantity attribute is used in request body
                    // If newQuantity attribute exists, the quantity field will be directly changed instead of incremented.
                    await client.query(newQuantity, [req.body.newQuantity, cartId, req.body.productId]);
                }
                else {
                    // If product already exists in cart, increase quantity.
                    await client.query(addQuantity, [req.body.quantity, cartId, req.productId]);
                }
            } 
            else {
                // If product does not already exist in cart, add new entry.
                await client.query(newCartProduct);
            }

            // Commit transaction.
            await client.query("COMMIT");

            // If no errors, return success code
            res.status(200).json({ msg: "Your cart has been updated" });

        } catch (error) {
            // If error occurs, rollback transaction
            await client.query("ROLLBACK");
            res.status(500).json({msg: "An unexpected error has occurred. Failed to update."}); 
        }
    }
    finally {
        // Release database connection regardless of success or failure.
        client.release()
        return;
    }
}

// Export product middleware functions
module.exports = {
    getProducts,
    productIdParam,
    getProductById,
    postProduct,
    updateProduct,
    deleteProduct,
    addToCart
}
