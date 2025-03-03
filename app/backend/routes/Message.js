const express = require('express');
const router = express.Router();

const {getMessages,getMessage,getAllMessages,deleteMessage,updateMessage,createMessage} = require('../controllers/message');
router.route('/').get(getAllMessages).post(createMessage);
router.route('/:id').get(getMessage).patch(updateMessage).delete(deleteMessage);
router.route('/:senderID/:receiverID').get(getMessages);
module.exports = router;