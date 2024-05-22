const { db } = require('./index')

const getProducts = (req, res) => {
    if (req.query.name) {
        var text = 'SELECT * FROM products WHERE LOWER(name) = $1';
        var parameters = [req.query.name]
    }
    else if (req.query.category) {
        var text = 'SELECT products.*\
            FROM categories\
            INNER JOIN products_categories\
                ON products_categories.category_id = categories.id AND LOWER(categories.name) = $1\
            INNER JOIN products\
                ON products.id = products_categories.product_id';
        var parameters = [req.query.category]
    }
    else {
        var text = 'SELECT * FROM products LIMIT 5'
    }
    db.query(text, parameters, (error, result) => {
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).json(result.rows);
    });
}

const productIdParam = (req, res, next, id) => {
    db.query('SELECT EXISTS (SELECT id FROM products WHERE id = $1)', [id], (error, results) => {
        if (results.rows[0].exists) {
            req.productId = id
            next();
        }
        else {
            res.status(404).send("Product not found")
        }
    })
}

const getProductById = (req, res) => {
    db.query('SELECT * FROM products WHERE id = $1', [req.productId], (error, results) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).json(results.rows[0]);
        }
    });
}

const postProduct = (req, res) => {
    const { name, description, brand_id, price } = req.body;
    const text = 'INSERT INTO products (name, description, brand_id, price) VALUES ($1, $2, $3, $4) RETURNING *';
    const parameters = [name, description, brand_id, price]
    
    db.query(text, parameters, (error, results) => {
        if (error) {
            res.status(400).send(error);
        }
        res.status(200).send("Product was created");
    })
}

const updateProduct = (req, res) => {
    const { name, description, brand_id, price } = req.body;
    const text = 'UPDATE products SET name = $1, description = $2, brand_id = $3, price = $4 WHERE id = $5';
    const parameters = [name, description, brand_id, price, req.productId]

    db.query(text, parameters, (error, results) => {
        if (error) {
            res.status(400).send(error)
        }
        res.status(400).send(results.rows[0])
    })
}

const deleteProduct = (req, res) => {
    db.query('DELETE FROM products WHERE id = $1', [req.productId], (error, results) => {
        if (error) {
            res.status(400).send('Bad Request');
        }
        res.status(200).send("Product deleted successfully.");
    });
}

const addToCart = (req, res) => {
    const text = 'WITH user_cart AS (\
        SELECT id FROM cart WHERE user_id = $1\
      )\
      INSERT INTO cart_products(cart_id, product_id, quantity)\
      SELECT id, $2, $3 FROM user_cart';
    const parameters = [req.user.id, req.productId, req.body.quantity]

    db.query(text, parameters, (error, results) => {
        if (error) {
            res.status(400).json({msg: "Bad Request"});
        }
        res.redirect('/cart');
    })
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
