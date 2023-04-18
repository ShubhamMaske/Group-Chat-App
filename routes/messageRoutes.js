const express = require('express');
const messageController = require('../controllers/messageController');
const userAuth = require('../middleware/Authorization');

const router = express.Router();

router.post('/saveMsg/:groupid',userAuth.authenticate,messageController.saveMessage);
// router.get('/getMsg/:totalLen/:groupid',userAuth.authenticate,messageController.getMessages)
 router.get('/getNewMsg/:lastMsgId',userAuth.authenticate,messageController.getNewMessage);
 router.get('/getMsgFromGroup/:groupid',userAuth.authenticate,messageController.groupMessages);
 


module.exports = router;