const Group = require('../models/groups');
const usergroup = require('../models/usergroups');
const User = require('../models/users');

//-------------------Create Group----------------------//
exports.creategroup = async (req, res, next) => {
    try {
        var userId = req.user.id;
        var name = req.body.groupName;

        const group = await Group.create({ group_name: name });
        const result = await usergroup.create({isadmin:true,groupId:group.id,userId:userId})
        res.status(201).json({gName:group});

    }
    catch (err) {
        res.status(500).json({ err });
    }

}


//-------------------Get user specific Group----------------------//
exports.getusergroups = async(req,res,next) => {
    try{
        var userId = req.user.id;
        var groups = [];
        let groupid = await usergroup.findAll({where:{userId:userId}});

        for(let i=0;i<groupid.length;i++){
            const group = groupid[i];
            const groupName= await Group.findOne({where:{id:group.dataValues.groupId}})

            groups.push(groupName.dataValues);  
        }

        res.status(201).json({groups});

    }
    catch(err){
        console.log(err);
    }
}


//------------------------Get All Groups------------------------//
exports.allgroups = async (req, res, next) => {
    try{
        const groups = await Group.findAll();
        res.status(201).json({groups});
    }
    catch(err){
        console.log(err);
        res.status(500).json({err});
    }
}



//-------------------Add user into Group----------------------//
exports.adduserToGroup = async (req, res, next) => {
    try{
        const userid = req.params.userid;
        const groupid = req.params.groupid;
        const adminuserid = +req.params.adminid;
        const checkAdmin = await usergroup.findOne({
            where: {
                groupId : groupid,
                userId: adminuserid,
                isadmin : true
            }
        })

        if(checkAdmin){
            const result = await usergroup.create({groupId:groupid,userId:userid});
            if(result.length <= 0){
                return res.status(203).json({message: "User is already added"});
            }
            const user = await User.findOne({where:{id:userid}})
            user.dataValues.admin = 0;
            return res.status(201).json({success:false, message:"user added successfully",User:user.dataValues})
        }
        else{
            return res.status(202).json({success:false,message: "You are not admin"})
        }

    }
    catch(err){
        return res.status(500).json({message: "User is already added",err});
        console.log(err);
    }
}



//-------------------Make user an admin----------------------//
exports.makeusertoAdmin = async (req, res, next) => {
    try{
        const userid = req.params.userid;
        const groupid = req.params.groupid;
        const adminid = +req.params.adminid;
        const checkAdmin = await usergroup.findOne({
            where: {
                groupId : groupid,
                userId: adminid,
                isadmin : true
            }
        })

        if(checkAdmin){
            const result = await usergroup.update({isadmin:true},
                {where:{groupId:groupid,userId:userid}}
            );
            return res.status(201).json({success:false, message:"user is admin now"})
        }
        else{
            return res.status(202).json({success:false,message: "You are not admin to make changes"})
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({err})
    }
}


//-------------------Remove user From Group----------------------//
exports.removeUserFromGroup = async (req, res, next) => {
    try{
        const userid = req.params.userid;
        const groupid = req.params.groupid;
        const adminid = +req.params.adminid;
        const checkAdmin = await usergroup.findOne({
            where: {
                groupId : groupid,
                userId: adminid,
                isadmin : true
            }
        })

        if(checkAdmin){
            const result = await usergroup.destroy({where:{groupId:groupid,userId:userid}});
            return res.status(201).json({success:false, message:"user is no more group member"})
        }
        else{
            return res.status(202).json({success:false,message: "You are not admin to make changes"})
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({err})
    }
}