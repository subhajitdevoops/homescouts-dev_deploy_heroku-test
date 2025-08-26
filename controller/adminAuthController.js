const userschema = require('../schema/userschema');
const bcryptjs = require("bcrypt");
const secretKey = "hyrgqwjdfbw4534efqrwer2q38945765"
var jwt = require('jsonwebtoken');
db = require('mongodb').Db;
const saltRounds = 10;
const { messages } = require('../helper/constant-messages');

var adminAuthController = {

    //------ Login--------
    login: async function (data, callback) {
      try{
        const user= await userschema.findOne({email:data.email}).exec();

                        var token = jwt.sign({
                            email: data.email,
                            _id:user._id,
                            name:user.name,
                            user_type:user.user_type
                        }, secretKey);

                        callback({
                            success: true,
                            statuscode: 200,
                            message: messages.loggedIn,
                            response: {
                                email: data.email,
                                token: token,
                                _id:user._id,
                            }
                        });
        }
        catch(err){
            callback({
                success: false, message: messages.catchError, response: err
            })
        }
    },
    // =============Password change=========
    userchangepwd:async function (data, callback) {
       try{                        
                                        const hash = bcryptjs.hashSync(data.newpassword, saltRounds);
                                        
                                        userschema.updateOne(
                                            { email: data.email },
                                            { $set: { password: hash } }
                                        ).exec(function (err, result) {
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
                success: false, message: "err!!", response: err
            })
        }                       
    },

  // -------------------------------admin Registration----------------------------------------
    registration:async function (data, callback) {
        try{       
                        const hash = bcryptjs.hashSync(data.password, saltRounds);
                        const newUser = new userschema({
                            ...data,
                            password: hash,
                            is_verified:1 ,
                            avatar: "Capture.JPG",
                        });
                        newUser.save((err, res) => {
                            if (err) {
                                callback({
                                    success: false, message: messages.databaseSaveError, err: err
                                })
                            }
                            else {
                                callback({
                                    success: true, message: messages.adminRegistration, response: res
                                })
                              }
                        });
            } 
            catch(err){
                callback({
                    success: false, message: messages.catchError, response: err
                })
            }    
            
    },
  //  ------Reset or forget Password for sbr---------//
  ///  before login of Distributor OTP send to user for forget password//

    otpsend: function (data, callback) {
        try{  
                                var otpcode= randomstring.generate({
                                    length: 6,
                                    charset: 'numeric'
                                  });
                                   //const hash = bcryptjs.hashSync(otpcode, saltRounds);
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
                                                    html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="' + 'assets/imgs/logo.png" alt="HomeScouts logo" title="HomeScouts logo" border=0;/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + result.name + ' ,<br><br> We have received your request to reset your password. <br><br> Your password reset OTP is <strong>' + otpcode + '</strong> <br><br> Please use this OTP to reset your password. <br><br> Thank you<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2020 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>'
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
                                                            response: info
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
                userschema.findOne({ email: data.email }, { email: 1, currentOtp: 1 },
                function (err, result) {
                if (err) {
                    callback({
                    success: false,
                    statuscode: 505,
                    message: messages.internalServerError,
                    response: err
                    })
                }
                else {
                    if (result == null) {
                    callback({
                        success: false,
                        statuscode: 505,
                        message: messages.emailNotExist,
                    })
                    }
                    else {  
                        // Try multiple comparison methods to handle data type mismatches
                        const otpMatch = result.currentOtp === data.otp || 
                                       String(result.currentOtp) === String(data.otp) ||
                                       Number(result.currentOtp) === Number(data.otp);
                        
                        if (otpMatch) {
                            userschema.updateOne({ email: data.email },{ $set: { is_verified: 1 } }).exec();
                        callback({
                        success: true,
                        statuscode: 200,
                        message: messages.otpVerified,
                        response: result
                        })
                    }
                    else {
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
                            userschema.updateOne({ email: data.email },
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


module.exports=adminAuthController;