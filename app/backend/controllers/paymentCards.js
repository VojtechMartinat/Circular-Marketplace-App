const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {Card} = require('../models/initialise')


/**
 * * Get all cards from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all cards
 * */
const getAllCards = asyncErrorWrapper(async (req,res) =>{
    const card = await Card.findAll()
    res.status(200).json({card})
})


/**
 * * Create a new Card and save it in the database
 * @param req Request from the client (req.body should contain card data)
 * @param res Response sent to the client containing new card data
 * */
const createCard= asyncErrorWrapper(async (req,res) =>{
    const card = await Card.create(req.body)
    res.status(201).json({card: card})
})


/**
 * * Get a single card from the database
 * @param req Request from the client (req.params should contain a valid cardID)
 * @param res Response sent to the client containing card data
 * */
const getCard = asyncErrorWrapper(async (req,res,next) =>{
    const {id:cardID} = req.params
    const card = await Card.findOne({
        where:{
            cardID: cardID
        }
    })
    if (!card){
        next(new APIError(`No card with id : ${cardID}`),404)
    }
    res.status(200).json({card})
})


/**
 * * Update card in a database
 * @param req Request from the client (req.params should contain a valid cardID and req.body should contain new card data)
 * @param res Response sent to the client containing card data
 * */
const updateCard = asyncErrorWrapper(async (req,res,next) =>{
    const {id:cardID} = req.params
    const card = await Card.update(req.body,{
        where: {
            cardID: cardID
        }
    })
    if (!card){
        next(new APIError(`No card with id : ${cardID}`),404)
    }
    res.status(200).json({card})
})


/**
 * * Delete a card from a database
 * ! Warning! This will actually delete a card from a database
 * @param req Request from the client (req.params should contain a valid cardID)
 * @param res Response sent to the client containing card data
 * */
const deleteCard = asyncErrorWrapper(async (req,res,next) =>{
    const {id:cardID} = req.params
    const card = await Card.destroy({
        where:{
            cardID:cardID
        }
    });
    if (!card){
        next(new APIError(`No card with id : ${cardID}`),404)
    }
    res.status(200).json({card})
})

module.exports = {
    getAllCards,createCard,getCard,updateCard,deleteCard
}