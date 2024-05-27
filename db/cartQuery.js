// Import DB and Authentication functions
const { db } = require('./index');

const getCart = (req, res) => {
    const text = 'SELECT c.id AS cart_id,\
    p.id AS product_id,\
        p.name, p.description,\
        cp.quantity,\
        (cp.quantity * p.price) AS line_total\
    FROM cart_products AS cp\
    JOIN cart AS c\
        ON c.id = cp.cart_id\
    JOIN products AS p\
        ON cp.product_id = p.id\
    WHERE c.user_id = $1'
    
    const parameters = [req.user.id]

    db.query(text, parameters, (error, results) => {
        if (error) {
            res.status(400).json({msg: "Bad request"});
        } 
        else if (results.rows.length > 0) {
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
    })
}

const checkoutCart = (req, res) => {
    const firstStatement = '\
        CREATE TEMP TABLE cart_details (cart_id, product_id, quantity, price) AS\
        SELECT cp.cart_id, cp.product_id, cp.quantity, products.price\
        FROM cart_products as cp\
        JOIN products ON cp.product_id = products.id\
        WHERE cart_id = (SELECT id FROM cart WHERE user_id = $1)';
        
    const secondStatement = 'CREATE TEMP TABLE new_order (status, total, user_id) AS\
            SELECT \'Not paid\', SUM(cart_details.price), 1 FROM cart_details'

    const thirdStatement = 'SELECT * FROM cart_details';

    db.query(firstStatement, [req.user.id], (error, results) => {
        if (error) {
            res.status(400).json({msg: error});
        } 
        db.query(thirdStatement, [], (error, secondResults) => {
            if (error) {
                res.status(400).json({msg: error})
            }
            else {
                res.status(200).json(secondResults)
            }
        })
    })
}



module.exports = {
    getCart,
    checkoutCart
}