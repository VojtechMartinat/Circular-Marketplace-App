const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {Order, Article, User} = require('../models/initialise')


/**
 * * Get all orders from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all orders
 * */
const getAllOrders = asyncErrorWrapper(async (req,res) =>{
    try {
        const orders = await Order.findAll();
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


/**
 * * Create a new Order and save it in the database
 * @param req Request from the client (req.body should contain order data)
 * @param res Response sent to the client containing new order data
 * */
const createOrder= asyncErrorWrapper(async (req,res,next) =>{
    const {userID, paymentMethodID, dateOfPurchase, collectionMethod} = req.body;
    console.log(req.body)
    let sum = 0
    let sellerID = null
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
        sellerID = article.userID;

    }
    if (userID === sellerID){
        next(new APIError('User cant buy his own article!',401));
    }
    const buyer = await User.findOne({
        where:{
            userID: userID
        }
    });
    const seller = await User.findOne({
        where: {
            userID: sellerID
        }
    });
    if (collectionMethod === "delivery"){
        sum += 2;
    }


    if (buyer.wallet < sum){
        next(new APIError('User doesnt have enough founds to buy the article!'));
        return;
    }


    const order = await Order.create(
        {
            userID : userID,
            paymentMethodID : paymentMethodID,
            dateOfPurchase : dateOfPurchase,
            collectionMethod : collectionMethod,
            orderStatus : "purchased",
            totalPrice : sum
        }
    )
    if (order.collectionMethod === "delivery"){
        buyer.wallet -= sum;
        await buyer.save();
        sum -= 2;
        seller.wallet += sum;
        await seller.save();
    }else {
        buyer.wallet -= sum;
        await buyer.save();
        seller.wallet += sum;
        await seller.save();
    }
    for (const articles of req.body.articles) {
        await Article.update(
            { orderID: order.orderID, state:"sold" },
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
    if (order){
        res.status(200).json({order})

    }
    next(new APIError(`No order with id : ${orderID}`),404)
})


const getOrderArticles = asyncErrorWrapper(async (req, res, next) => {
    console.log("TEST");
    const { id: orderID } = req.params;
    const order = await Order.findOne({ where: { orderID } });
    if (!order) {
        return next(new APIError(`No order with id: ${orderID}`, 404));
    }

    const articles = await Article.findAll({ where: { orderID } });

    if (!articles || articles.length === 0) {
        return next(new APIError(`No articles found for order ID: ${orderID}`, 404));
    }

    res.status(200).json({ articles });
});



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


const getArticleByOrderId = asyncErrorWrapper(async (req,res,next) =>{
    const {id:orderID} = req.params
    const order = await Order.findOne({
        where:{
            orderID: orderID
        }
    })

    if (!order){
        next(new APIError(`No order with id : ${orderID}`),404)
        return
    }

    const article = await Article.findOne({
        where: {
            orderID: orderID
        }
    })
    res.status(200).json({article})

})

module.exports = {
    getAllOrders,createOrder,getOrder,updateOrder,deleteOrder, getOrderArticles,getArticleByOrderId
}