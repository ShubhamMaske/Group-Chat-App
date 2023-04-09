const Group = require('../models/groups');
const usergroup = require('../models/usergroups');



exports.creategroup = async (req, res, next) => {
    try {
        var userId = req.user.id;
        var name = req.body.groupName;

        const group = await Group.create({ group_name: name });
        const result = await usergroup.create({groupId:group.id,userId:userId})
        res.status(201).json({gName:group});

    }
    catch (err) {
        res.status(500).json({ err });
    }

}

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