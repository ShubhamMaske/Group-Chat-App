const Message = require('../models/messages');
const User = require('../models/users');
const sequelize = require('../util/database');
const { Op } = require("sequelize");


exports.saveMessage = async(req, res, next) => {
    try{
        const message = req.body.message;
        const groupid = req.params.groupid;
        var Msg = `${req.user.name} : ${message}`

        const result = await Message.create({message:Msg,userId:req.user.id,groupId:groupid});
        res.status(201).json({message:"message save in DB",Info:result})

    }
    catch(err){
        res.status(500).json({error:err});
    }
}

//getting new msg(if present) in every 2 sec
exports.getMessages = async(req, res, next) => {
    try{
        let oldMsgLength = +req.params.totalLen;
        const messages = await Message.findAll({
            where:{id: { [Op.gt]: oldMsgLength }},
        });

        const username = req.user.name;
        res.status(201).json({allMessages:messages,username});

    }
    catch(err){
        res.status(500).json({error:err})
    }
}

exports.groupMessages = async (req,res,next) => {
    try{
        const groupid = req.params.groupid;
        let messages = await Message.findAll({where: {groupId:groupid}});
        res.status(201).json({allMessages:messages});
    }
    catch(err){
        console.log(err)
    }
}

//
exports.getNewMessage = async (req, res,next) => {
    try{
        const oldMessageId = req.params.lastMsgId;
        console.log("old msg Id",oldMessageId);
        const username = req.user.name;
         if(oldMessageId === undefined){
            oldMessageId = -1;   
         }
        console.log("old msg Id after comparing",oldMessageId);
        const messages = await Message.findAll({
            where:{id: { [Op.gt]: oldMessageId }},
        })
      
        res.status(201).json({success:true,allMessages:messages,username}); 
        
        
        
    }
    catch(err){
        console.log(err);
    }
}