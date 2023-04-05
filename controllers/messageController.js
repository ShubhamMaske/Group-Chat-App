const Message = require('../models/messages');
const User = require('../models/users');
const sequelize = require('../util/database');
const { Op } = require("sequelize");


exports.saveMessage = async(req, res, next) => {
    try{
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
        const messages = await Message.findAll();
        console.log("messages length",messages.length)
        const username = req.user.name;
        res.status(201).json({allMessages:messages,username});

    }
    catch(err){
        res.status(500).json({error:err})
    }
}


// exports.getNewMessage = async (req, res,next) => {
//     try{
//         const oldMessageId = +req.params.messageId;
//         const message = await Message.findAll({
//             where:{id: { [Op.gt]: oldMessageId }},
//         })
//         if(message.length > 0){
//             return res.status(201).json({success:true,newMessage:message}); 
//         }
//         else{
//             res.status(201).json({success:false});
//         }

//         // console.log("newMessage",message);
//         // res.status(201).json({newMessage:message});
//     }
//     catch(err){
//         console.log(err);
//     }
// }