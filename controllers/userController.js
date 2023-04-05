const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function isStringinValid(string) {
    if (string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

exports.signupUser = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;
        if (isStringinValid(name) || isStringinValid(email) || isStringinValid(phone) || isStringinValid(password)) {
            res.status(400).json({ message: " Bad Parameters", success: false })
        }

        let user = await User.findAll({ where: { email } })
        if (user.length > 0) {
            return res.status(400).json({ message: "User already exists, Please Login" })
        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                const data = await User.create({ name, email, phone, password: hash })
                res.status(201).json({ newUser: data });
            })
        }

    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}



function generateAccessToken(id){
    return jwt.sign({userId : id},process.env.TOKEN_PRIVATE_KEY);
}


exports.signinUser = async(req, res, next) =>{
    try{
        const {email, password} = req.body;
        if(isStringinValid(email) || isStringinValid(password)){
            return res.status(400).json({message: " Bad Parameters", success:false})
        }
        let user = await User.findAll({where: {email}})
        
        if(user.length > 0){
            bcrypt.compare(password,user[0].password, (err, result)=>{
                if(err){
                    throw new Error("Something went wrong");
                }
                if(result === true){
                    res.status(201).json({success:true, message: "User login Sucessful",token: generateAccessToken(user[0].id)});  
                }
                else{
                    return res.status(401).json({success:false, message: "User not authorized"}) 
                }
            })   
        }
        else{
            return res.status(404).json({success:false, message:"User not found"});
        }

    }
    catch(err){
       res.status(500).json({message:err, success:false})
    }
    
}


exports.getAllUsers = async(req, res, next) => {
    try{
        const users = await User.findAll();
        res.status(201).json({AllUsers: users});
    }
    catch(err){
        res.status(500).json({err})
    }
}