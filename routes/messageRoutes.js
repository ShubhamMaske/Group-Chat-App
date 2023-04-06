const express = require('express');
const messageController = require('../controllers/messageController');
const userAuth = require('../middleware/Authorization');

const router = express.Router();

router.post('/saveMsg',userAuth.authenticate,messageController.saveMessage);
router.get('/getMsg/:totalLen',userAuth.authenticate,messageController.getMessages)
 router.get('/getNewMsg/:lastMsgId',userAuth.authenticate,messageController.getNewMessage);


module.exports = router;