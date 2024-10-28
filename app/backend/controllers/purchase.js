const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {createOrder} = require("./orders");

const buyOrder = asyncErrorWrapper(async (req,res) =>{



    // Create a new order
    const order = createOrder(req,)

    // Buy the order



    // Update order status



    // Update article status



})