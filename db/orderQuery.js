const { db } = require('./index');

const getOrders = (req, res) => {
    db.query('SELECT * FROM orders WHERE user_id = $1', [req.user.id], (error, results) => {
        if (error) {
            res.status(400).json({error})
        }
        res.status(200).json(results.rows)
    })
}

module.exports = {
    getOrders
}