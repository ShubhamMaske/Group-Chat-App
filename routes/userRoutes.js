const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signUp',userController.signupUser);
router.post('/signIn',userController.signinUser);
router.get('/allusers',userController.getAllUsers)

module.exports = router;