const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const User = require('../models/User')


/**
 * * Get all users from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all users
 * */
const getAllUsers = asyncErrorWrapper(async (req,res) =>{
    const users = User.findAll()
    res.status(200).json({users})
})


/**
* * Create a new User and save him in the database
* @param req Request from the client (req.body should contain user data)
 * @param res Response sent to the client containing new user data
* */
const createUser = asyncErrorWrapper(async (req,res) =>{
    const user = User.create(req.body)
    res.status(201).json({user})
})


/**
 * * Get a single user from the database
 * @param req Request from the client (req.body should contain a valid userID)
 * @param res Response sent to the client containing user data
 * */
const getUser = asyncErrorWrapper(async (req,res,next) =>{
    const {id:userID} = req.params
    const user = User.findOne({
        where:{
            userID: userID
        }
    })
    if (!user){
        next(new APIError(`No user with id : ${userID}`),404)
    }
    res.status(200).json({user})
})


/**
 * * Update user in a database
 * @param req Request from the client (req.body should contain a valid userID and new user data)
 * @param res Response sent to the client containing user data
 * */
const updateUser = asyncErrorWrapper(async (req,res,next) =>{
    const {id:userID} = req.params
    const user = User.update(req.body,{
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
    const user = User.delete({
        where:{
            userID:userID
        }
    });
    if (!user){
        next(new APIError(`No user with id : ${userID}`),404)
    }
    res.status(200).json({user})
})

module.exports = {
    getAllUsers,createUser,getUser,updateUser,deleteUser
}