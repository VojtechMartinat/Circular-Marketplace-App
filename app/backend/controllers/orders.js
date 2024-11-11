const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {Order, Article} = require('../models/initialise')


/**
 * * Get all orders from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all orders
 * */
const getAllOrders = asyncErrorWrapper(async (req,res) =>{
    const order = Order.findAll()
    res.status(200).json({order})
})


/**
 * * Create a new Order and save it in the database
 * @param req Request from the client (req.body should contain order data)
 * @param res Response sent to the client containing new order data
 * */
const createOrder= asyncErrorWrapper(async (req,res,next) =>{
    const { orderID, userID, paymentMethodID, dateOfPurchase, collectionMethod} = req.body;

    let sum = 0
    for (const x of req.body.articles){
        const article = await Article.findOne({
            where:{
                articleID: x.articleID
            }
        })
        if (article == null){
            next(new APIError(`Article with id:${x.articleID} doesnt exists`))
            return
        }
        if (article.orderID != null){
            next(new APIError(`Article with id:${x.articleID} is already assigned to an order`),404)
            return
        }
        const price = parseFloat(article.price)
        if (isNaN(price)) {
            next(new APIError(`Invalid price for article with id:${x.articleID}`), 400)
            return
        }
        sum += price
    }
    const order = await Order.create(
        {
            orderID : orderID,
            userID : userID,
            paymentMethodID : paymentMethodID,
            dateOfPurchase : dateOfPurchase,
            collectionMethod : collectionMethod,
            orderStatus : "purchased",
            totalPrice : sum
        }
    )

    for (const articles of req.body.articles) {
        await Article.update(
            { orderID: order.orderID },
            {
                where: {
                    articleID: articles.articleID
                }
            }
        );
    }
    res.status(201).json({order: order})
})


/**
 * * Get a single order from the database
 * @param req Request from the client (req.params should contain a valid orderID)
 * @param res Response sent to the client containing order data
 * */
const getOrder = asyncErrorWrapper(async (req,res,next) =>{
    const {id:orderID} = req.params
    const order = await Order.findOne({
        where:{
            orderID: orderID
        }
    })
    if (!order){
        next(new APIError(`No order with id : ${orderID}`),404)
    }
    res.status(200).json({order})
})


/**
 * * Update order in a database
 * @param req Request from the client (req.params should contain a valid orderID and req.body should contain new order data)
 * @param res Response sent to the client containing order data
 * */
const updateOrder = asyncErrorWrapper(async (req,res,next) =>{
    const {id:orderID} = req.params
    const order = await Order.update(req.body,{
        where: {
            orderID: orderID
        }
    })
    if (!order){
        next(new APIError(`No order with id : ${orderID}`),404)
    }
    res.status(200).json({order})
})


/**
 * * Delete a order from a database
 * ! Warning! This will actually delete a order from a database
 * @param req Request from the client (req.params should contain a valid orderID)
 * @param res Response sent to the client containing order data
 * */
const deleteOrder = asyncErrorWrapper(async (req,res,next) =>{
    const {id:orderID} = req.params
    const order = await Order.destroy({
        where:{
            orderID:orderID
        }
    });
    if (!order){
        next(new APIError(`No order with id : ${orderID}`),404)
    }
    res.status(200).json({order})
})

module.exports = {
    getAllOrders,createOrder,getOrder,updateOrder,deleteOrder
}