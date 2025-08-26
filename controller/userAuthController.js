const userschema = require('../schema/userschema');
const bcryptjs = require("bcrypt");
// const secretKey = "hyrgqwjdfbw4534efqrwer2q38945765"
var jwt = require('jsonwebtoken');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
const config = require("../config/config.json");
var {messages}=require('../helper/constant-messages');
const notificationSchema = require('../schema/notificationSchema');
const {notificationmessage} = require('../helper/notification-message');


const saltRounds = 10;

var userAuthController = {

//==================User Registration==================
    registration:async function (data, callback) {
        try{
            
                        const hash =bcryptjs.hashSync(data.password, saltRounds);
                        const newUser =  new userschema({
                            ...data,
                            password: hash,
                            avatar: "https://ik.imagekit.io/homescouts/Defaultuser.png?updatedAt=1690907014760",
                        });
                        newUser.save((err, res) => {
                            if (err) {
                                callback({
                                    success: false, 
                                    message: messages.databaseSaveError, 
                                    err: err
                                })
                            }
                            else { 
                                
                                var otpcode= randomstring.generate({
                                    length: 6,
                                    charset: 'numeric'
                                });
                                    const hash = otpcode;
                                    userschema.updateOne({ email: data.email },{ $set: { currentOtp: hash , is_active:true} }).exec(function (err, result) {
                                    if (!err) {
                                       
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
                                                    subject: messages.emailSubjectOtpSentForRegistration,
                                                    html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="https://ik.imagekit.io/homescouts/HomeScouts%20logo.png?updatedAt=1690981399501" alt="HomeScouts logo" title="HomeScouts logo" border="0" width="200" style="height: auto;"/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + data.name + ' ,<br><br> We have received your application for new registration. <br><br> Your new OTP is <strong>' + otpcode + '</strong> <br><br> Please verify your account  ASAP for security purpose. <br><br> Thank you !!<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2023 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>',                                                    
                                                    };
                                                    transporter.sendMail(mailOptions, function(err, info){
                                                    if (err) {
                                                        
                                                                callback({
                                                                    success: true,
                                                                    statuscode: 200,
                                                                    message: messages.errorToSentEmail,
                                                                    response: err
                                                                })
                                                    } else {
                                                        const notification =  new notificationSchema({
                                                            touser:data.email,
                                                            notificationtype:"Registration",
                                                            notification:{ 
                                                                notification_subject: notificationmessage.registrationsubject,
                                                                notification_body: notificationmessage.registrationbody
                                                            },
                                                        });
                                                        notification.save((err, res) => {
                                                            if (err) {
                                                                callback({
                                                                    success: false, 
                                                                    message: "notificaton error", 
                                                                    err: err
                                                                })
                                                            }
                                                            else{
                                                                
                                                                callback({
                                                                    success: true,
                                                                    response: info.response,
                                                                    statuscode: 200,
                                                                    message: messages.sucessfullySentOtp,
                                                                })
                                                            }});
                                                       
                                                    }
                                                    });
                                        }                       
                                        else{
                                            callback({
                                                success: true,
                                                statuscode: 200,
                                                message: messages.errorToSentOtp,
                                                response:err
                                            })
                                        }
                                    })
                                }
                        });
        }
        catch(err){
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },

    googleregistration:async function (data, callback) {
        try{
                        const hash =bcryptjs.hashSync(data.password, saltRounds);
                        const newUser =  new userschema({
                            ...data,
                            password: hash,
                            avatar: "https://ik.imagekit.io/homescouts/Defaultuser.png?updatedAt=1690907014760",
                            is_active:true,
                            is_verified:1
                        });
                        var newuser=await newUser.save();
          //////////////////
                        var temppassword= data.password
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
                                                                to: newuser.email,
                                                                subject: messages.emailSubjectpasswordSentForRegistration,
                                                                html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="https://ik.imagekit.io/homescouts/HomeScouts%20logo.png?updatedAt=1690981399501" alt="HomeScouts logo" title="HomeScouts logo" border="0" width="200" style="height: auto;"/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + data.name + ' ,<br><br> We have received your application for new registration. <br><br> Your new temporary password is <strong>' + temppassword + '</strong> <br><br> Please change it  ASAP for security purpose. <br><br> Thank you !!<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2023 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>',                                                    
                                                                };
                                                             var mailconfirm = await transporter.sendMail(mailOptions);
                                                               
/         ///////////////////////////////

                                                                    const notification =  new notificationSchema({
                                                                        touser:newuser.email,
                                                                        notificationtype:"Registration",
                                                                        notification:{ 
                                                                            notification_subject: notificationmessage.registrationsubject,
                                                                            notification_body: notificationmessage.registrationbody
                                                                        },
                                                                    });
                                                             var noticonfirm = await notification.save();
         /////////////////////////                                                

                                                                            var token = jwt.sign({
                                                                                email: newuser.email,
                                                                                _id:newuser._id,
                                                                                name:newuser.name,
                                                                                user_type:newuser.user_type
                                                                            }, config.jwtsecretKey);
                                                                            
                                                                            callback({
                                                                                success: true,
                                                                                statuscode: 200,
                                                                                message: messages.googleRegistration,
                                                                                response:{email: newuser.email,
                                                                                _id:newuser._id,
                                                                                name:newuser.name,
                                                                                token}
                                                                            });

            }catch(err){
                    callback({
                        success: false,
                        statuscode: 500,
                        message: messages.catchError,
                        response: err
                    })
            }
    },

//================== Login==================
    login: async function (data, callback) {
     try{
            const user= await userschema.findOne({email:data.email}).exec();
            
            var token = jwt.sign({
                email: user.email,
                _id:user._id,
                name:user.name,
                user_type:user.user_type
            }, config.jwtsecretKey);
            
            callback({
                success: true,
                statuscode: 200,
                message: messages.loggedIn,
                response: {
                    email: user.email,
                    token: token,
                    _id:user._id,
                }
            });
     }
     catch(err){
        callback({
            success: false,
            statuscode: 500,
            message: messages.catchError,
            response: err
        })
     }             
    },

    googlelogin: async function (data, callback) {
        try{
               const user= await userschema.findOne({email:data.email}).exec();
               
               var token = jwt.sign({
                   email: user.email,
                   _id:user._id,
                   name:user.name,
                   user_type:user.user_type
               }, config.jwtsecretKey);
               
               callback({
                   success: true,
                   statuscode: 200,
                   message: messages.loggedIn,
                   response: {
                       email: user.email,
                       token: token,
                       _id:user._id,
                   }
               });
        }
        catch(err){
            console.log(err);
           callback({
               success: false,
               statuscode: 500,
               message: messages.catchError,
               response: err
           })
        }             
    },

// =============Password change==================
    userchangepwd:async function (data, callback) {
      try{
            const hash = bcryptjs.hashSync(data.newpassword, saltRounds);
                                        
            userschema.updateOne({email:data.email},{ $set:{password: hash}}).exec(function (err, result) {
                                            if (!err) {
                                                callback({
                                                    success: true,
                                                    statuscode: 200,
                                                    message: messages.sucessfullyChangePassword,
                                                    response: {
                                                        email: data.email,
                                                        result 
                                                    }
                                                })
                                            }
                                            else{
                                                callback({
                                                    success: true,
                                                    statuscode: 200,
                                                    message: messages.notChangePassword,
                                                    response: {
                                                        email: data.email,
                                                        err
                                                    }
                                                })
                                            }
                                        });
         }
         catch(err){
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
         }
                                
   },
   
//==================Reset or forget Password for user==================
    otpsend: function (data, callback) {
        try{  
                                var otpcode= randomstring.generate({
                                    length: 6,
                                    charset: 'numeric'
                                });
                                    const hash = otpcode;
                                    userschema.updateOne(
                                    { email: data.email },
                                    { $set: { currentOtp: hash } }
                                ).exec(function (err, result) {
                                        if (!err) {
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
                                                        
                                                                callback({
                                                                        success: true,
                                                                        statuscode: 200,
                                                                        message: messages.errorToSentEmail,
                                                                        response: err
                                                                })
                                                    } else {
                                                        callback({
                                                            success: true,
                                                            statuscode: 200,
                                                            message: messages.sucessfullySentOtp,
                                                            _id:data._id,
                                                        })
                                                    }
                                                    });
                                        }
                                        else{
                                            callback({
                                                success: true,
                                                statuscode: 200,
                                                message: messages.errorToSentOtp,
                                                response:err
                                            })
                                        }
                                    })           
        }
        catch(err){
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    //For OTP verify for forget password
    otpverify:function (data, callback) {
    try{
                console.log("OTP Verification - Input data:", data);
                userschema.findOne( { $or: [ { _id: data._id }, { email: data.email } ] }, { _id: 1, currentOtp: 1 },
                function (err, result) {
                if (err) {
                    console.log("OTP Verification - Database error:", err);
                    callback({
                    success: false,
                    statuscode: 505,
                    message: messages.internalServerError,
                    response: err
                    })
                }
                else {
                    console.log("OTP Verification - Database result:", result);
                    if (result == null) {
                        console.log("OTP Verification - User not found");
                    callback({
                        success: false,
                        statuscode: 505,
                        message: messages.userNotFound,
                    })
                    }
                    else {  
                        console.log("OTP Verification - Comparing OTPs. Received:", data.otp, "Type:", typeof data.otp, "Stored:", result.currentOtp, "Type:", typeof result.currentOtp);
                        console.log("OTP Verification - String comparison:", String(result.currentOtp) === String(data.otp));
                        console.log("OTP Verification - Direct comparison:", result.currentOtp === data.otp);
                        
                        // Try multiple comparison methods
                        const otpMatch = result.currentOtp === data.otp || 
                                       String(result.currentOtp) === String(data.otp) ||
                                       Number(result.currentOtp) === Number(data.otp);
                        
                        console.log("OTP Verification - Final match result:", otpMatch);
                        
                    if (otpMatch) {
                        console.log("OTP Verification - OTP matched, updating user verification status");
                        userschema.updateOne({ $or: [ { _id: data._id }, { email: data.email } ] },{ $set: { is_verified: 1 } }).exec();
                        callback({
                        success: true,
                        statuscode: 200,
                        message: messages.otpVerified,
                        response: result
                        })
                    }
                    else {
                        console.log("OTP Verification - OTP mismatch");
                        callback({
                        success: false,
                        statuscode: 505,
                        message: messages.otpNotMatch,
                        })
                    }
                    }
                }
                })
            
    }
    catch(err){
        console.log("OTP Verification - Exception:", err);
        callback({
            success: false,
            statuscode: 500,
            message: messages.catchError,
            response: err
        })
    }
    },
    // New password set by seller / rent / buyer in App
    resetpassword: function (data, callback) {
    try{
                        bcryptjs.hash(data.password, saltRounds, function (err, hash) {
                        if (err) {
                            callback({
                            success: false,
                            statuscode: 400,
                            message: messages.internalServerError,
                            err: err
                            });
                        }
                        else {
                            var update = {
                            password: hash,
                            currentOtp: ' '
                            }
                            userschema.updateOne({ _id: data._id },
                            { $set: update },
                            function (err, up) {
                                if (err) {
                                callback({
                                    success: false,
                                    statuscode: 505,
                                    message: messages.internalServerError,
                                    err: err
                                });
                                }
                                else {
                                callback({
                                    success: true,
                                    statuscode: 200,
                                    message: messages.setPassword,
                                    response: {}
                                });
                                }
                            })
                        }
                        })
            
        }
        catch(err){
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    }

}

module.exports = userAuthController;