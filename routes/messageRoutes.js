const express = require('express');
const messageController = require('../controllers/messageController');
const userAuth = require('../middleware/Authorization');

const router = express.Router();

router.post('/saveMsg',userAuth.authenticate,messageController.saveMessage);


module.exports = router;