const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {Wishlist} = require('../models/initialise')



/**
 * * Get all wishlists from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all wishlists
 * */
const getAllWishlists = asyncErrorWrapper(async (req,res) =>{
    const wishlist = await Wishlist.findAll()
    res.status(200).json({wishlist})
})


/**
 * * Create a new Wishlist and save it in the database
 * @param req Request from the client (req.body should contain wishlist data)
 * @param res Response sent to the client containing new wishlist data
 * */
const createWishlist= asyncErrorWrapper(async (req,res) =>{
    const wishlist = await Wishlist.create(req.body)
    res.status(201).json({wishlist})
})


/**
 * * Get a single wishlist from the database
 * @param req Request from the client (req.params should contain a valid wishlistID)
 * @param res Response sent to the client containing wishlist data
 * */
const getWishlist = asyncErrorWrapper(async (req,res,next) =>{
    const {id:wishlistID} = req.params

    const wishlist = await Wishlist.findOne({
        where:{
            id: wishlistID
        }
    })
    if (!wishlist){
        res.status(404).json({ error: "Wishlist not found" });
        next(new APIError(`No wishlist with id : ${wishlistID}`),404)
    }
    else{
        res.status(200).json({wishlist})
    }

})


/**
 * * Update wishlist in a database
 * @param req Request from the client (req.params should contain a valid wishlistID and req.body should contain new wishlist data)
 * @param res Response sent to the client containing wishlist data
 * */
const updateWishlist = asyncErrorWrapper(async (req,res,next) =>{
    const {id:wishlistID} = req.params
    const wishlist = await Wishlist.update(req.body,{
        where: {
            id: wishlistID
        }

    })
    if (wishlist[0] === 0){
        res.status(404).json({error:"Wishlist not found"})
        next(new APIError(`No wishlist with id : ${wishlistID}`),404)
    }
    else{
        res.status(200).json({wishlist})
    }

})


/**
 * * Delete a wishlist from a database
 * ! Warning! This will actually delete a wishlist from a database
 * @param req Request from the client (req.params should contain a valid wishlistID)
 * @param res Response sent to the client containing wishlist data
 * */
const deleteWishlist = asyncErrorWrapper(async (req,res,next) =>{
    try {
        const id = req.params.id;
        const deleted = await Wishlist.destroy({ where: { id: id } });
        if (deleted) {
            return res.status(204).send(); // No content
        } else {
            return res.status(404).json({ error: "Wishlist not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = {
    getAllWishlists,createWishlist,getWishlist,updateWishlist,deleteWishlist
}