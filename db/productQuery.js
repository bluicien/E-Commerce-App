const { db } = require('./index')

const getProducts = async (req, res) => {
    let text; 
    let parameters;
    if (req.query.name) {
        text = 'SELECT * FROM products WHERE LOWER(name) = $1';
        parameters = [req.query.name]
    }
    else if (req.query.category) {
        text = 'SELECT products.*\
            FROM categories\
            INNER JOIN products_categories\
                ON products_categories.category_id = categories.id AND LOWER(categories.name) = $1\
            INNER JOIN products\
                ON products.id = products_categories.product_id';
        parameters = [req.query.category]
    }
    else {
        text = 'SELECT * FROM products LIMIT 10'
    }
    
    try {
        const results = await db.query(text, parameters);
        if (results.rows.length > 0) {
            res.status(200).json(results.rows);
        } else {
            res.status(200).json({msg: "No products found."})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred"});
    }
}

const productIdParam = async (req, res, next, id) => {
    try {
        const results = await db.query('SELECT EXISTS (SELECT id FROM products WHERE id = $1)', [id]);
        if (results.rows[0].exists) {
            req.productId = id;
            next();
        }
        else {
            res.status(404).json({msg: "Product not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred"});
    }
}

const getProductById = async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM products WHERE id = $1', [req.productId]);
        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred"});
    }
}

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

const deleteProduct = async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = $1', [req.productId])
        res.status(200).send("Product deleted successfully.");    
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred. Failed to delete."}); 
    }
}

const addToCart = async (req, res) => {
    const text = 'WITH user_cart AS (\
        SELECT id FROM cart WHERE user_id = $1\
      )\
      INSERT INTO cart_products(cart_id, product_id, quantity)\
      SELECT id, $2, $3 FROM user_cart';
    const parameters = [req.user.id, req.productId, req.body.quantity]

    try {
        await db.query(text, parameters)
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An unexpected error has occurred. Failed to update."}); 
    }
}

module.exports = {
    getProducts,
    productIdParam,
    getProductById,
    postProduct,
    updateProduct,
    deleteProduct,
    addToCart
}
