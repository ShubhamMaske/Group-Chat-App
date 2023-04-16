const AWS = require('aws-sdk');
const fs = require('fs');

exports.uploadToS3 = (file) => {
    const BUCKET_NAME = 'expensetrackerwebapp'
    const IAM_USER_KEY = process.env.IAM_USER;
    const IAM_SECRET_KEY = process.env.IAM_SECRETE;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY ,
        secretAccessKey: IAM_SECRET_KEY,
    })

        const filestream = fs.createReadStream(file.path);
        
        var params = {
        Bucket: BUCKET_NAME,
        Body: filestream,
        Key: file.filename,
        ACL: 'public-read'
        }

        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, s3response) => {
                if(err){
                    console.log("err ==",err);
                    reject(err);
                }else{
                    console.log("resss -",s3response.Location);
                    resolve(s3response.Location);
                }
            })
        })   
}