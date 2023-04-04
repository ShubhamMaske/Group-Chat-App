const Message = require('../models/messages');
const User = require('../models/users');
const sequelize = require('../util/database');


exports.saveMessage = async(req, res, next) => {
    try{
        const message = req.body.message;

        const result = await Message.create({message,userId:req.user.id});

        res.status(201).json({message:"message save in DB"})

    }
    catch(err){
        res.status(500).json({error:err});
    }
}