// Import DB and Authentication functions
const { db } = require('./index');
const auth = require('./authenticate');
const { json } = require('express');

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
            const cart_total = "$" + prices.reduce((accumulator, item) => {
                return accumulator + item;
            }, 0);
            
            res.status(200).json({cart, cart_total})
        } 
        else {
            res.status(200).json({msg: "Your cart is empty"});
        }
    })
}





module.exports = {
    getCart
}