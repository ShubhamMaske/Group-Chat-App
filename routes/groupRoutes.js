const express = require('express');
const groupController = require('../controllers/groupController');
const userAuth = require('../middleware/Authorization');


const router = express.Router();

router.post('/creategroup',userAuth.authenticate,groupController.creategroup);
router.get('/getallgroups',userAuth.authenticate,groupController.getusergroups);
router.get('/allgroups',userAuth.authenticate,groupController.allgroups);
router.post('/adduser/:userid/:groupid/:adminid',groupController.adduserToGroup);
router.post('/makeadmin/:userid/:groupid/:adminid',groupController.makeusertoAdmin);
router.post('/removeuser/:userid/:groupid/:adminid',groupController.removeUserFromGroup);



module.exports = router;