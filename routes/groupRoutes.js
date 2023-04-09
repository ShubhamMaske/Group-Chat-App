const express = require('express');
const groupController = require('../controllers/groupController');
const userAuth = require('../middleware/Authorization');


const router = express.Router();

router.post('/creategroup',userAuth.authenticate,groupController.creategroup);
router.get('/getallgroups',userAuth.authenticate,groupController.getusergroups);



module.exports = router;