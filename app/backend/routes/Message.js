const express = require('express');
const router = express.Router();

const {getMessages,
       getMessage,
       getAllMessages,
       deleteMessage,
       updateMessage,
       createMessage,
       sendBargain,
       updateBargainStatus
    } = require('../controllers/message');
router.route('/').get(getAllMessages).post(createMessage);
router.route('/:id').get(getMessage).patch(updateMessage).delete(deleteMessage);
router.route('/:senderID/:receiverID').get(getMessages);
router.route('/send-bargain').post(sendBaragin);
router.route('/update-bargain-status').post(updateBargainStatus);
module.exports = router;