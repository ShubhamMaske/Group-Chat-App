const express = require('express');
const messageController = require('../controllers/messageController');
const userAuth = require('../middleware/Authorization');

const router = express.Router();

router.post('/imgUpload/:groupid',userAuth.authenticate,messageController.uploadImageFile);


module.exports = router;