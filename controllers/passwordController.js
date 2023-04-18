const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
require('dotenv').config()

const User = require('../models/users');
const Forgotpassword = require('../models/forgotpassword');

exports.forgotPassword = async (req, res, next) => {
    try {
        const Email = req.body.email;
        const user = await User.findOne({ where: { email: Email } });

        if (user) {
            const id = uuid.v4();
            user.createForgotpassword({ id ,userId:user.id, active: true })
                .catch(err => {
                    throw new Error(err)
                })

            const client = Sib.ApiClient.instance
            const apiKey = client.authentications['api-key']
            apiKey.apiKey = process.env.API_KEY

            const tranEmailApi = new Sib.TransactionalEmailsApi()
            const sender = {
                email: 'maske3317@gmail.com',
            }
            const receiver = [
                {
                    email: Email,
                },
            ]

            tranEmailApi
                .sendTransacEmail({
                    sender,
                    to: receiver,
                    subject: 'Password Reset mail',
                    textContent: `
        Click the link to reset password.
        `,
                    htmlContent: `
                    <h1>Click on the below link to reset the password</h1>
                    <a href = "http://localhost:3000/password/resetpassword/${id}">Reset Password</a>
                    `
                })
                .then((result) => {
                    console.log(result)
                    return res.status(200).json({ message: 'Link to reset password sent to your mail ', sucess: true })
                }).catch((error) => {
                    throw new Error(error);
                })
        } else {
            throw new Error('User doesnt exist')
        }
    }
    catch (err) {
        res.status(500).json({ error: err });
        console.log("Error---<>---", err)
    }
}





exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

exports.updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}