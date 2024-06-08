const { db } = require('./index');

const getOrders = async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM orders WHERE user_id = $1', [req.user.id])
        if (results.rows.length > 0) {
            res.status(200).json(results.rows)
        } else {
            res.status(200).json({msg: "You have no orders."})
        }
    } catch (error) {
        res.status(400).json({msg: "Bad Request"});
    }
}

const orderIdParam = async (req, res, next, id) => {
    try {
        const results = await db.query('SELECT EXISTS(SELECT id FROM orders WHERE id = $1 AND user_id = $2)', [id, req.user.id])
        if (results.rows[0].exists) {
            req.orderId = id;
            next();
        } else {
            res.status(404).json({msg: "Page not found."});
        }
    } catch (error) {
        res.status(400).json({msg: "Bad Request"});
    }
}

const getOrdersById = async (req, res) => {
    try {
        const results = await db.query('SELECT id, status, total FROM orders WHERE id = $1', [req.orderId]);
        console.log(results.rows)
        if (results.rows.length > 0) {
            res.status(200).json(results.rows[0])
        } else {
            res.status(404).json({msg: "Page not found"})
        }
    } catch (error) {
        res.status(400).json({msg: "Bad Request"});
    }
}

module.exports = {
    getOrders,
    orderIdParam,
    getOrdersById
}