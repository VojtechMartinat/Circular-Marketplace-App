const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {PaymentCard} = require('../models/initialise')


/**
 * * Get all cards from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all cards
 * */
const getAllCards = asyncErrorWrapper(async (req,res) =>{
    const card = await PaymentCard.findAll()
    res.status(200).json({card})
})


/**
 * * Create a new Card and save it in the database
 * @param req Request from the client (req.body should contain card data)
 * @param res Response sent to the client containing new card data
 * */
const createCard= asyncErrorWrapper(async (req,res) =>{
    const card = await PaymentCard.create(req.body)
    res.status(201).json({card: card})
})


/**
 * * Get a single card from the database
 * @param req Request from the client (req.params should contain a valid cardID)
 * @param res Response sent to the client containing card data
 * */
const getCard = asyncErrorWrapper(async (req,res,next) =>{
    const {id:cardID} = req.params
    const card = await PaymentCard.findOne({
        where:{
            paymentMethodID: cardID
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
const updateCard = asyncErrorWrapper(async (req, res, next) => {
    const { id: cardID } = req.params;

    // Update card
    const [rowsUpdated] = await PaymentCard.update(req.body, {
        where: { paymentMethodID: cardID },
    });

    if (rowsUpdated === 0) {
        return next(new APIError(`No card with id: ${cardID}`, 404));
    }

    // Fetch the updated card
    const updatedCard = await PaymentCard.findOne({
        where: { paymentMethodID: cardID },
    });

    res.status(200).json({ card: updatedCard });
});


/**
 * * Delete a card from a database
 * ! Warning! This will actually delete a card from a database
 * @param req Request from the client (req.params should contain a valid cardID)
 * @param res Response sent to the client containing card data
 * */
const deleteCard = asyncErrorWrapper(async (req, res, next) => {
    const { id: cardID } = req.params;

    // Delete card
    const rowsDeleted = await PaymentCard.destroy({
        where: { paymentMethodID: cardID },
    });

    if (rowsDeleted === 0) {
        return next(new APIError(`No card with id: ${cardID}`, 404));
    }

    res.status(200).json({ message: `Card with id: ${cardID} successfully deleted` });
});


module.exports = {
    getAllCards,createCard,getCard,updateCard,deleteCard
}