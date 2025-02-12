const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {User, Article, Order} = require('../models/initialise')



/**
 * * Get all users from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all users
 * */
const getAllUsers = asyncErrorWrapper(async (req,res) =>{
    const users =  await User.findAll()
    res.status(200).json({users})

})

/**
 * Checks all the database records to see whether a user account exists with correct password
 */
const loginUser = asyncErrorWrapper(async (req, res, next) => {
    const { username, password } = req.body;

    // Fetch all users
    const users = await User.findAll();

    // Check if the username exists in the list of users
    const user = users.find(user => user.username === username);

    // If user does not exist, throw an error
    if (!user) {
        return next(new APIError('Invalid username or password', 401));
    }

    // Check if the passwords match
    if (user.password !== password) {
        return next(new APIError('Invalid username or password', 401));
    }

    // Send user data in response
    res.status(200).json({
        user: {
            userID: user.userID,
            username: user.username,
            email: user.email,
            location: user.location,
            wallet: user.wallet,
        }
    });
});




/**
* * Create a new User and save him in the database
* @param req Request from the client (req.body should contain user data)
 *  @param res Response sent to the client containing new user data
* */
const createUser = asyncErrorWrapper(async (req,res) =>{
    const user = await User.create(req.body)
    res.status(201).json({user})
})


/**
 * * Get a single user from the database
 * @param req Request from the client (req.params should contain a valid userID)
 * @param res Response sent to the client containing user data
 * */
const getUser = asyncErrorWrapper(async (req,res,next) =>{
    const {id:userID} = req.params
    const user = await User.findOne({
        where:{
            userID: userID
        }
    })
    if (!user){
        next(new APIError(`No user with id : ${userID}`),404)
        return
    }
    res.status(200).json({user})
})


/**
 * * Update user in a database
 * @param req Request from the client (req.params should contain a valid userID and req.body should contain new user data)
 * @param res Response sent to the client containing user data
 * */
const updateUser = asyncErrorWrapper(async (req,res,next) =>{
    const {id:userID} = req.params
    const user = await User.update(req.body,{
        where: {
            userID: userID
        }
    })
    if (!user){
        next(new APIError(`No user with id : ${userID}`),404)
    }
    res.status(200).json({user})
})


/**
 * * Delete a user from a database
 * ! Warning! This will actually delete a user from a database
 * @param req Request from the client (req.body should contain a valid userID)
 * @param res Response sent to the client containing user data
 * */
const deleteUser = asyncErrorWrapper(async (req,res,next) =>{
    const {id:userID} = req.params
    const user = await User.destroy({
        where:{
            userID:userID
        }
    });
    if (!user){
        next(new APIError(`No user with id : ${userID}`),404)
    }
    res.status(200).json({user})
})


/**
 * * Get all user orders from a database
 * @param req Request from the client (req.params should contain a valid userID)
 * @param res Response sent to the client containing user orders
 * */
const userOrders = asyncErrorWrapper(async (req,res,next) =>{
    const {id:userID} = req.params
    const orders = await Order.findAll({
        where:{
            userID: userID
        }
    });
    if (!orders){
        next(new APIError(`No orders with user id : ${userID}`),404)
    }
    res.status(200).json({orders})
})

/**
 * * Get all user articles from a database
 * @param req Request from the client (req.params should contain a valid userID)
 * @param res Response sent to the client containing user articles
 * */
const userArticles = asyncErrorWrapper(async (req,res,next) =>{
    const {id:userID} = req.params
    const articles = await Article.findAll({
        where:{
            userID: userID
        }
    });
    if (!articles){
        next(new APIError(`No articles with user id : ${userID}`),404)
    }
    res.status(200).json({articles})
})

const userTopUp = asyncErrorWrapper(async (req,res,next) =>{
    try {
        const {id:userID} = req.params
        const amount = req.body.amount;
        const user = await User.findOne({where: {
                userID : userID
            }
        });
        if (!user){
            next(new APIError(`User doesnt exists!`, 404));
        }
        user.wallet += amount;
        await user.save();
        res.status(200).json({user})
    } catch (error){
        console.log(error)
    }
})

module.exports = {
    getAllUsers,createUser,getUser,updateUser,deleteUser,userOrders, userArticles, loginUser , userTopUp
}