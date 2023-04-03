const User = require('../models/users');
const bcrypt = require('bcrypt');


function isStringinValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

exports.signupUser = async (req, res, next)=> {
    try{
        const {name,email,phone, password} = req.body;
        if(isStringinValid(name) || isStringinValid(email) || isStringinValid(phone) || isStringinValid(password)){
            res.status(400).json({message: " Bad Parameters", success:false})
        }

        bcrypt.hash(password,10,async(err,hash) => {
            const data = await User.create({name,email,phone,password:hash})
            res.status(201).json({newUser: data});
        })
        
    }
    catch(err){
        res.status(500).json({error: err})
    }
}