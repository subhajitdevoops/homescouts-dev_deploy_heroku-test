const jwt = require("jsonwebtoken");
const bcryptjs = require("bcrypt");
const userschema = require('../schema/userschema');
const { messages } = require("../helper/constant-messages");
const config = require("../config/config.json");
const secretKey = config.jwtsecretKey;
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');



const checkLogin = async (req, res, next) => {
    console.log("checkLogin");
    try {
        const token = req.headers.authtoken ;
        const decoded = jwt.verify(token, secretKey);
        const user= await userschema.findOne({email:decoded.email});
        if(user){
            req.query.userId=decoded._id;
            req.query.name=decoded.name;
            req.body.email=decoded.email;
            req.query.email=decoded.email;
            next();
        }
        else{
            
            return(res.send("Session timeOut.Please login!!"));
        }  
    } catch(err) {
        console.log(err);
        res.send(err);
    }
};
const activeOrNot = async (req, res, next) => {
    console.log("activeOrNot");
    try {
        const token = req.headers.authtoken ;
        const decoded = jwt.verify(token, secretKey);
        const user= await userschema.findOne({email:decoded.email},{is_active:1});
        if(user.is_active==true){
            next();
        }
        else{
            return(res.send("Your account has been disabled please contact administrator Please contact with HomeScouts support for resolution."));
        }  
    } catch(err) {
        console.log(err);
        res.send(err);
    }
};
const emailExistOrNot = async (req, res, next) => {
    console.log("emailExistOrNot");
    try {
        const user= await userschema.findOne({email:req.body.newemail});
        if(user){
            res.send({
                statuscode:400,
                message:"email is already exist , please give new email or other email"
            });
        }
        else{
            next();
        }  
    } catch(err) {
        console.log(err);
        res.send(err);
    }
};

const loginornot = async (req, res, next) => {
    
    try {
            
            if(req.headers.authtoken){
                const token = req.headers.authtoken ;
                const decoded = jwt.verify(token, secretKey);
                const user= await userschema.findOne({email:decoded.email});
                if(user){
                    req.query.userId=decoded._id;
                    req.query.name=decoded.name;
                    req.body.email=decoded.email;
                    req.query.email=decoded.email;
          
                    next();
                 }
                 else{
                    res.send({
                        success: false,
                        statuscode: 500,
                        message: "authtoken expired or user not found!!!",
                    });
                 }
            }
            else{
                next();
            }
        }catch(err) {
            res.send(err);
        }
};

const isAdmin = async (req, res, next) => {
    console.log("isadmin");
    try {
        const token = req.headers.authtoken ;
        const decoded = jwt.verify(token, secretKey);
        const user= await userschema.findOne({email:decoded.email});
        if(user.user_type=="admin"){
              next();
        }
        else{
            res.send("You are not authorized!!!!!");
        }
        
    } catch(err) {
        res.send(err);
    }
};
const passwordverify=async (req,res,next)=>{
    const data = req.body;

    const foundData = await userschema.findOne({email:data.email}).exec();
          //  
            if(foundData)
            {
            bcryptjs.compare(data.oldpassword, foundData.password, function (err, result) {
                if (result){
                    console.log();
                    if(data.newpassword != data.confirmpassword){
                        res.send({
                            success: false,
                            statuscode: 500,
                            message: "Password & ConfirmPassword are not same !!",
                            response: {}
                        });
                    }
                    else{
                        next();
                    }
                }
                else{
                    res.send({
                        success: false,
                        statuscode: 500,
                        message: "old Password not matched!!",
                        response: {}
                    });      
                }
              })
            }
            else{
                res.send({
                    success: false,
                    statuscode: 500,
                    message: "user not exist!",
                    response: {}
                });
            }         
};

const userverify=async (req,res,next)=>{
    try{
        const data = req.body;
        console.log(data);
        const foundData = await userschema.findOne({email: data.email},{password:1,is_verified:1,is_active:1,block_by_admin:1}).exec();
        
        console.log(foundData);
        if(foundData===null  ){
            res.send({
                    success: false,
                    statuscode: 500,
                    message: "no such registered email id found!!!",
                    response: {}
                });
        }
        else if (foundData && foundData.is_verified==1 && foundData.is_active===true) {

            bcryptjs.compare(data.password, foundData.password, function(err, result) {
                if(result){
                    next();
                }
                else{
                    res.send({
                        success: false,
                        statuscode: 500,
                        message: "Password not matched!!",
                    });
                }
            });
        }
        else if (foundData && foundData.is_active===false) {
            res.send({
                success: false,
                statuscode: 400,
                message: "Your account is deactivated.please contact admin to get access again.",
            });
        }
        else if (foundData && foundData.is_active===false && foundData.block_by_admin.type==="temporary") {
            res.send({
                success: false,
                statuscode: 500,
                message: "Your account is temporary blocked.Contact admin to unblock your account!!",
            });
        }
        else if (foundData && foundData.is_active===false && foundData.block_by_admin.type==="permanent") {
            res.send({
                success: false,
                statuscode: 500,
                message: "Your account is permanently blocked.So You cannot use this emailid further!!",
            });
        }      
        else {
            
            var otpcode= randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
                const hash = otpcode;
                console.log("Login Middleware - Generated OTP:", otpcode, "for email:", data.email);
                userschema.updateOne(
                { email: data.email },
                { $set: { currentOtp: hash } }
            ).exec(function (err, result) {
                    if (err) {
                        console.log("Login Middleware - Error updating OTP in database:", err);
                        res.send({
                            success: true,
                            statuscode: 200,
                            message: messages.errorToSentOtp,
                            response:err
                        })
                    }
                    else{
                        console.log("Login Middleware - OTP successfully stored in database for email:", data.email, "Update result:", result);
                        // Verify the OTP was actually stored
                        userschema.findOne({ email: data.email }, { currentOtp: 1 }, function(verifyErr, verifyResult) {
                            if (verifyErr) {
                                console.log("Login Middleware - Error verifying OTP storage:", verifyErr);
                            } else {
                                console.log("Login Middleware - Verified OTP in database:", verifyResult);
                            }
                        });
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: config.emailauth.user,
                                pass: config.emailauth.passKey
                            },
                            port:config.emailauth.port,
                            host:config.emailauth.smtp_host
                            });
                            var mailOptions = {
                            from: config.emailauth.email_from,
                            to: data.email,
                            subject: messages.emailSubjectOtpSentForResetPassword,
                            html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="' + 'assets/imgs/logo.png" alt="HomeScouts logo" title="HomeScouts logo" border=0;/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + data.name + ' ,<br><br> We have received your application for new password. <br><br> Your OTP is <strong>' + otpcode + '</strong> <br><br> Please Verify this OTP ASAP for security purpose. <br><br> Thank you<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2023 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>'
                            };
                            transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log("Login Middleware - Email sending error:", error);
                                res.send({
                                                success: false,
                                                statuscode: 400,
                                                message: messages.errorToSentEmail,
                                                response: error
                                        })
                            } else {
                                console.log("Login Middleware - Email sent successfully to:", data.email);
                                res.send({
                                    success: true,
                                    statuscode: 200,
                                    message:  messages.afterloginverifywithotp,
                                })
                            }
                            });
                    }
                })   
        }
    }
    catch(err){
        console.log(err);
        res.send({
            success: false,
            statuscode: 500,
            message: "error!!!",
            response: err
        });
    }
   
};


const otpSendingValidation=async (req,res,next)=>{
    try{
        const data = req.body;
        const foundData = await userschema.findOne({email: data.email}).exec();
        if (foundData) {
                    req.body._id=foundData._id;
                    req.body.name=foundData.name;
                    next();
        }
        else{
            res.send({
                    success: false,
                    statuscode: 500,
                    message: "no such registered email id found!!!",
                    response: {}
                });
        }
    }
    catch(err){
        
        res.send({
            success: false,
            statuscode: 500,
            message: "error!!!",
            response: err
        });
    }
}

const resetPasswordValidation=async (req,res,next)=>{
    try{
        const data = req.body;
        if (data.password != data.confirmpassword) {
            res.send({
                success: false,
                statuscode: 500,
                message: messages.PasswordAndConfirmPasswordNotSame,
            });
        }
        else{
            const foundData = await userschema.findOne({ _id: data._id}).exec();
            if (foundData) {
                next();
            }
            else{
                res.send({
                        success: false,
                        statuscode: 500,
                        message: "no such registered user id found!!!",
                        response: {}
                    });
            }
        }
    }
    catch(err){
        
        res.send({
            success: false,
            statuscode: 500,
            message: "error!!!",
            response: err
        });
    }
}

const isUserExitOrNot=async (req,res,next)=>{
    try{
        const data = req.body;
            const foundData = await userschema.findOne({ _id: data._id}).exec();
            if (foundData) {
                next();
            }
            else{
                res.send({
                        success: false,
                        statuscode: 500,
                        message: "no such registered email id found!!!",
                        response: {}
                    });
            }
    }
    catch(err){
        
        res.send({
            success: false,
            statuscode: 500,
            message: "error!!!",
            response: err
        });
    }
}

const isUserAdminOrNot=async (req,res,next)=>{
    try{
        const data = req.body;
            const foundData = await userschema.findOne({ email: data.email},{user_type:1}).exec();
            if (foundData.user_type==="admin") {
                next();
            }
            else{
                res.send({
                        success: false,
                        statuscode: 500,
                        message: "user is not authorized!!",
                        response: {}
                    });
            }
    }
    catch(err){
        
        res.send({
            success: false,
            statuscode: 500,
            message: "error!!!",
            response: err
        });
    }
}

const contactexistornot = async (req, res, next) => {
    
    try {
        const token = req.headers.authtoken ;
        const decoded = jwt.verify(token, secretKey);
        const user= await userschema.findOne({email:decoded.email});
        
        if(user){
            req.query.userId=decoded._id;
            req.query.name=decoded.name;
            req.body.email=decoded.email;
            req.query.email=decoded.email;
         };
        if(user.mobilenumber){
              next();
        }
        else{
            res.send("Frist add mobile number and verify it");
        }
        
    } catch(err) {
        res.send(err);
    }
};

module.exports = {checkLogin,passwordverify,userverify,otpSendingValidation,activeOrNot,
                    resetPasswordValidation,isUserExitOrNot,emailExistOrNot,isUserAdminOrNot,isAdmin,loginornot,contactexistornot};