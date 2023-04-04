const Message = require('../models/messages');
const User = require('../models/users');
const sequelize = require('../util/database');


exports.saveMessage = async(req, res, next) => {
    try{
        console.log(req.body.message)
        const message = req.body.message;
        var Msg = `${req.user.name} : ${message}`

        const result = await Message.create({message:Msg,userId:req.user.id});
        res.status(201).json({message:"message save in DB",Info:result})

    }
    catch(err){
        res.status(500).json({error:err});
    }
}

exports.getMessages = async(req, res, next) => {
    try{
        const users = await User.findAll();
        const messages = await Message.findAll();

        res.status(201).json({allMessages:messages,AllUsers: users});

    }
    catch(err){
        res.status(500).json({error:err})
    }
}