const asyncErrorWrapper = require('../middleware/asyncErrorWrapper')
const APIError = require('../errors/ErrorAPI')
const {Message} = require('../models/initialise')
const {Op} = require("sequelize");
const uuidValidate = require('uuid-validate');

const validateUUID = (id, next) => {
    if (!uuidValidate(id)) {
        next(new APIError(`Invalid UUID: ${id}`, 400));
        return false;
    }
    return true;
};


/**
 * * Get all Messages from the database
 * @param req Request from the client
 * @param res Response sent to the client containing data about all Messages
 * */
const getAllMessages = asyncErrorWrapper(async (req,res) =>{
    const messages =  await Message.findAll()
    res.status(200).json({messages})

})


/**
 * * Create a new User and save him in the database
 * @param req Request from the client (req.body should contain user data)
 *  @param res Response sent to the client containing new user data
 * */
const createMessage = asyncErrorWrapper(async (req,res) =>{
    try{
        const message = await Message.create(req.body)
        res.status(201).json({message})
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(400).json({error})
    }

})


/**
 * * Get a single user from the database
 * @param req Request from the client (req.params should contain a valid userID)
 * @param res Response sent to the client containing user data
 * */
const getMessage = asyncErrorWrapper(async (req,res,next) =>{
    const {id:messageID} = req.params
    if (!validateUUID(messageID, next)) return;
    const message = await Message.findOne({
        where:{
            messageID: messageID
        }
    })
    if (!message){
        next(new APIError(`No user with id : ${messageID}`),404)
        return
    }
    res.status(200).json({message})
})


/**
 * * Update user in a database
 * @param req Request from the client (req.params should contain a valid userID and req.body should contain new user data)
 * @param res Response sent to the client containing user data
 * */
const updateMessage = asyncErrorWrapper(async (req,res,next) =>{
    const {id:messageID} = req.params
    const message = await Message.update(req.body,{
        where: {
            messageID: messageID
        }
    })
    if (!message){
        next(new APIError(`No user with id : ${messageID}`),404)
    }
    res.status(200).json({message})
})


/**
 * * Delete a user from a database
 * ! Warning! This will actually delete a user from a database
 * @param req Request from the client (req.body should contain a valid userID)
 * @param res Response sent to the client containing user data
 * */
const deleteMessage = asyncErrorWrapper(async (req,res,next) =>{
    const {id:messageID} = req.params
    const message = await Message.destroy({
        where: {
            messageID: messageID
        }
    });
    if (!message){
        next(new APIError(`No user with id : ${messageID}`),404)
    }
    res.status(200).json({message})
})
const getMessages = asyncErrorWrapper(async (req, res, next) => {
    const { senderID, receiverID } = req.params;

    const messages = await Message.findAll({
        where: {
            [Op.or]: [
                { senderID: senderID, receiverID: receiverID },
                { senderID: receiverID, receiverID: senderID }
            ]
        },
        order: [['createdAt', 'ASC']]
    });

    if (!messages || messages.length === 0) {
        return res.status(200).json({ messages: [] }); 
    }
});

/**
 * Send a Bargain Offer
 * @param req Request from the client (req.body should contain senderID, recieverID, itemID, newPrice)
 * @param res Response containing the bargain message
 */

const sendBargain = asyncErrorWrapper(async(req, res, next) => {
    const { senderId, receiverID, itemId, newPrice} = req.body;

    if (!senderId || !receiverID || !itemId || !newPrice){
        return next(new APIError("Missing required fields", 400));
    }

    const bargainMessage = await Message.create({
        senderID,
        receiverID,
        message: JSON.stringify({type: "bargain", itemID, newPrice, status: "pending"})
    });

    res.status(201).JSON({bargainMessage});
});

/**
 * Update Bargain Status
 * @param req Request from the client (req.body should contain messageID, status)
 * @param res Response containing updated bargain message
 */

const updateBargainStatus = asyncErrorWrapper(async(req, res, next) => {
    const {messageID, status} = req.body;

    if (!messageID || !["accepted","rejected"].includes(status)){
        return next(new APIError("Invalid status update", 400));
    }

    const bargainMessage = await Message.findOne({where:{messageID}});

    if (!bargainMessage){
        return next(new APIError(`No message found with id: ${messageID}`,404))
    }

    let updatedMessageData = JSON.parse(bargainMessage.message);
    updatedMessageData.status = status;

    await Message.update(
        { message: JSON.stringify(updatedMessageData)},
        { where: {messageID}}
    );

    res.status(200).json({
        message: "Bargain status updated successfully",
        updatedMessageData
    });
})

module.exports = {
    getAllMessages,createMessage,getMessage,updateMessage,deleteMessage, getMessages, sendBargain, updateBargainStatus
}