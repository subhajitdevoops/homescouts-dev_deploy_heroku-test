const userschema = require('../schema/userschema');
var {messages}=require('../helper/constant-messages');
const config = require("../config/config.json");
const jwt = require("jwt-decode");
const bcryptjs = require("bcrypt");
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');





const detailschecking=async (req,res,next)=>{
    try{
                const data = req.body;
                await userschema.findOne({ email: data.email },function (err, Res){
                    
                        if (err){
                            return(res.send({
                                success: false,
                                statuscode: 200,
                                message: "database error",
                                response: {}
                            }));
                        }
                        else if(Res && Res.is_verified==1){       
                            return( res.send({
                                    success: true,
                                    statuscode: 200,
                                    is_verified:true,
                                    message: messages.emailExistandVerify,
                                    response: {}
                                }));
                        }
                        else if(Res && Res.is_verified==0){

                            var otpcode= randomstring.generate({
                                length: 6,
                                charset: 'numeric'
                            });
                                const hash = otpcode;
                                console.log("Registration Middleware - Generated OTP:", otpcode, "for email:", data.email);
                                userschema.updateOne(
                                { email: data.email },
                                { $set: { currentOtp: hash } }
                            ).exec(function (err, result) {
                                    if (err) {
                                        console.log("Registration Middleware - Error updating OTP in database:", err);
                                        return(res.send({
                                            success: true,
                                            statuscode: 200,
                                            message: messages.errorToSentOtp,
                                            response:err
                                        }))
                                    }
                                    else{
                                        console.log("Registration Middleware - OTP successfully stored in database for email:", data.email, "Update result:", result);
                                        // Verify the OTP was actually stored
                                        userschema.findOne({ email: data.email }, { currentOtp: 1 }, function(verifyErr, verifyResult) {
                                            if (verifyErr) {
                                                console.log("Registration Middleware - Error verifying OTP storage:", verifyErr);
                                            } else {
                                                console.log("Registration Middleware - Verified OTP in database:", verifyResult);
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
                                            subject: messages.emailSubjectOtpSentForRegistration,
                                            html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="' + 'assets/imgs/logo.png" alt="HomeScouts logo" title="HomeScouts logo" border=0;/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + data.name + ' ,<br><br> We have received your application for account verification. <br><br> Your verification OTP is <strong>' + otpcode + '</strong> <br><br> Please verify your account ASAP to complete registration. <br><br> Thank you<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2023 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>'
                                            };
                                            transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                console.log("Registration Middleware - Email sending error:", error);
                                                return(res.send({
                                                                success: false,
                                                                statuscode: 400,
                                                                message: messages.errorToSentEmail,
                                                                response: error
                                                        }))
                                            } else {
                                                console.log("Registration Middleware - Email sent successfully to:", data.email);
                                                return(res.send({
                                                    success: true,
                                                    statuscode: 200,
                                                    message:  messages.emailExistUnverifiedResendOTP,
                                                }))
                                            }
                                            });
                                    }
                                })   

                        }
                        else{       
                            if(data.password != data.confirmpassword){
                                return(res.send({
                                    success: false,
                                    statuscode: 500,
                                    message: passwordandconfirmpasswordsame,
                                    response: {}
                                }));
                            }
                            else{
                                    next();
                                }
                        }
                })
    }
    catch(err){
        return(res.send({
            success: false,
            statuscode: 500,
            response: err
        }))
    }   
}

module.exports = {detailschecking};