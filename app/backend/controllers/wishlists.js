const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const Wishlist = require('../models/Wishlist')


/**
 * * Get all wishlists from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all wishlists
 * */
const getAllWishlists = asyncErrorWrapper(async (req,res) =>{
    const wishlist = Wishlist.findAll()
    res.status(200).json({wishlist})
})


/**
 * * Create a new Wishlist and save it in the database
 * @param req Request from the client (req.body should contain wishlist data)
 * @param res Response sent to the client containing new wishlist data
 * */
const createWishlist= asyncErrorWrapper(async (req,res) =>{
    const wishlist = Wishlist.create(req.body)
    res.status(201).json({wishlist: wishlist})
})


/**
 * * Get a single wishlist from the database
 * @param req Request from the client (req.body should contain a valid wishlistID)
 * @param res Response sent to the client containing wishlist data
 * */
const getWishlist = asyncErrorWrapper(async (req,res,next) =>{
    const {id:wishlistID} = req.params
    const wishlist = Wishlist.findOne({
        where:{
            wishlistID: wishlistID
        }
    })
    if (!wishlist){
        next(new APIError(`No wishlist with id : ${wishlistID}`),404)
    }
    res.status(200).json({wishlist})
})


/**
 * * Update wishlist in a database
 * @param req Request from the client (req.body should contain a valid wishlistID and new wishlist data)
 * @param res Response sent to the client containing wishlist data
 * */
const updateWishlist = asyncErrorWrapper(async (req,res,next) =>{
    const {id:wishlistID} = req.params
    const wishlist = Wishlist.update(req.body,{
        where: {
            wishlistID: wishlistID
        }
    })
    if (!wishlist){
        next(new APIError(`No wishlist with id : ${wishlistID}`),404)
    }
    res.status(200).json({wishlist})
})


/**
 * * Delete a wishlist from a database
 * ! Warning! This will actually delete a wishlist from a database
 * @param req Request from the client (req.body should contain a valid wishlistID)
 * @param res Response sent to the client containing wishlist data
 * */
const deleteWishlist = asyncErrorWrapper(async (req,res,next) =>{
    const {id:wishlistID} = req.params
    const wishlist = Wishlist.delete({
        where:{
            wishlistID:wishlistID
        }
    });
    if (!wishlist){
        next(new APIError(`No wishlist with id : ${wishlistID}`),404)
    }
    res.status(200).json({wishlist})
})

module.exports = {
    getAllWishlists,createWishlist,getWishlist,updateWishlist,deleteWishlist
}