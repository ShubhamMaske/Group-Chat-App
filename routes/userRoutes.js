const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signUp',userController.signupUser);
router.post('/signIn',userController.signinUser);

module.exports = router;