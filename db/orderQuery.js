// Import DB
const { db } = require('./index');

// Get all orders for logged in user
const getOrders = async (req, res) => {
    try {
        // Query orders database for all orders with user_id
        const results = await db.query('SELECT * FROM orders WHERE user_id = $1', [req.user.id])

        // Return array of orders if found.
        if (results.rows.length > 0) {
            res.status(200).json(results.rows)
        } 
        // If nothing found, return message for no orders.
        else {
            res.status(200).json({msg: "You have no orders."}) 
        }
    } 
    // Return bad request if error.
    catch (error) {
        res.status(400).json({msg: "Bad Request"}); 
    }
}

// Get ID param from request object. 
const orderIdParam = async (req, res, next, id) => {
    try {
        // Query database to check if any order with given ID exists.
        const results = await db.query('SELECT EXISTS(SELECT id FROM orders WHERE id = $1 AND user_id = $2)', [id, req.user.id])

        // If order of given ID exists, attach to req.orderId and continue to next
        if (results.rows[0].exists) {
            req.orderId = id;
            next();
        } 
        // If no order found, return 404 page not found.
        else {
            res.status(404).json({msg: "Page not found."});
        }
    } 
    // Return bad request if error.
    catch (error) {
        res.status(400).json({msg: "Bad Request"});
    }
}

// Get order by ID give in params
const getOrdersById = async (req, res) => {
    try {
        // Query orders database for id in req.orderId which was passed by the params middleware
        const results = await db.query('SELECT id, status, total FROM orders WHERE id = $1', [req.orderId]);
        // If order exists, return in json object
        if (results.rows.length > 0) {
            res.status(200).json(results.rows[0])
        } 
        // If does not exist, return 404 not found.
        else {
            res.status(404).json({msg: "Page not found"})
        }
    } 
    // Return bad request if error.
    catch (error) {
        res.status(400).json({msg: "Bad Request"});
    }
}

// Export route functions.
module.exports = {
    getOrders,
    orderIdParam,
    getOrdersById
}