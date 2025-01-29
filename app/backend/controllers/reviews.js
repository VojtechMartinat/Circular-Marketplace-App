const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {Review} = require('../models/initialise')



/**
 * * Get all reviews from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all reviews
 * */
const getAllReviews = asyncErrorWrapper(async (req,res) =>{
    const review =  await Review.findAll()
    res.status(200).json({review})

})


/**
 * * Create a new Review and save it in the database
 * @param req Request from the client (req.body should contain review data)
 *  @param res Response sent to the client containing new review data
 * */
const createReview = asyncErrorWrapper(async (req,res) =>{
    const review = await Review.create(req.body)
    res.status(201).json({review: review})
})


/**
 * * Get a single review from the database
 * @param req Request from the client (req.params should contain a valid reviewID)
 * @param res Response sent to the client containing review data
 * */
const getReview = asyncErrorWrapper(async (req,res,next) =>{
    const {id:reviewID} = req.params
    const review = await Review.findOne({
        where:{
            reviewID: reviewID
        }
    })
    if (!review){
        next(new APIError(`No review with id : ${reviewID}`),404)
    }
    res.status(200).json({review})
})


/**
 * * Update review in a database
 * @param req Request from the client (req.params should contain a valid reviewID and req.body should contain new review data)
 * @param res Response sent to the client containing review data
 * */
const updateReview = asyncErrorWrapper(async (req,res,next) =>{
    const {id:reviewID} = req.params
    const review = await Review.update(req.body,{
        where: {
            reviewID: reviewID
        }
    })
    if (!review){
        next(new APIError(`No review with id : ${reviewID}`),404)
    }
    res.status(200).json({review})
})


/**
 * * Delete a review from a database
 * ! Warning! This will actually delete a review from a database
 * @param req Request from the client (req.body should contain a valid reviewID)
 * @param res Response sent to the client containing review data
 * */
const deleteReview = asyncErrorWrapper(async (req,res,next) =>{
    const {id:reviewID} = req.params
    const review = await Review.destroy({
        where:{
            reviewID:reviewID
        }
    });
    if (!review){
        next(new APIError(`No review with id : ${reviewID}`),404)
    }
    res.status(200).json({review})
})

module.exports = {
    getAllReviews,createReview,getReview,updateReview,deleteReview
}