const Message = require('../models/messages');
const User = require('../models/users');
const sequelize = require('../util/database');
const usergroup = require('../models/usergroups');
const S3services = require('../services/s3Services');
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

//getting new msg(if present) in every 1 se
// exports.getMessages = async(req, res, next) => {
//     try{
//         let oldMsgLength = +req.params.totalLen;
//         const groupid = req.params.groupid;

//         const messagess = await Message.findOne({
//             where: {groupId: groupid},
//             order: [['createdAt','DESC']],
//         })

//         const username = req.user.name;
//         res.status(201).json({allMessages:messagess,username});

//     }
//     catch(err){
//         res.status(500).json({error:err})
//     }
// }

exports.groupMessages = async (req,res,next) => {
    try{
        const groupid = req.params.groupid;
        let messages = await Message.findAll({where: {groupId:groupid}});
        let adminid = await usergroup.findOne({where: {isadmin: true,groupId:groupid}})
        res.status(201).json({allMessages:messages,admin:adminid,logInUser:req.user.name});
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



exports.uploadImageFile = async(req, res, next) => {
    try{
        const groupid = req.params.groupid;
        const userid = req.user.id;
        const file = req.file
        console.log(file);
        
        const fileUrl = await S3services.uploadToS3(file);
        
        const result = await Message.create({message:fileUrl,userId:userid,groupId:groupid});
        res.status(201).json({message:true,result,username:req.user.name});
        
    }
    catch(err){
        console.log(err);
    }
}