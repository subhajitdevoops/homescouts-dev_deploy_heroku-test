const Joi = require('joi');
const config = require("../config/config.json");
const secretKey = config.googleAuth.secretKey;
const jwt = require("jwt-decode");
const bcryptjs = require("bcrypt");
const userschema = require('../schema/userschema');
var randomstring = require("randomstring");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;




const regdetailsverify=async (req,res,next)=>{
    try { 
            
            const schema = Joi.object({ 
                name:Joi.string().required(),
                email:Joi.string().email().required(),
                password: Joi.string().required(),
                confirmpassword: Joi.string().required(),
                user_type:Joi.string().required(),
                name:Joi.string(),
                termandcondition:Joi.boolean().required(),
                mobilenumber:Joi.number()
            }) 
            const value = await schema.validateAsync(req.body);
            next() 
    } 
    catch (error) {
            
            return res.status(400).send({ 
                code: 3, 
                message: "Bad Request :Invalid Parameters", 
                payload: error }) 
    }
}

const googleregdetailsverify=async (req,res,next)=>{
    try { 
            const schema = Joi.object({ 
                credential:Joi.string().required(),
                user_type:Joi.string().required(),
                name:Joi.string(),
                email:Joi.string(),
                password:Joi.string(),

            }) 
            const value = await schema.validateAsync(req.body);
            next() 
    } 
    catch (error) {
            
            return res.status(400).send({ 
                code: 3, 
                message: "Bad Request :Invalid Parameters", 
                payload: error }) 
    }
}

const decodeandpasswordgenarating=async (req,res,next)=>{
     
        try {
            
            const googletoken = req.body.credential ;
            const decoded = jwt(googletoken);
            const user= await userschema.findOne({email:decoded.email});
            if(user!=null){
                return(res.send({ 
                    code: 400, 
                    message: "This Emailid is already Registred!!", 
                    }) )
            }
            else{
                var password= randomstring.generate({
                                    length: 6,
                                    charset: 'numeric'
                                });
                req.body.name=decoded.name;
                req.body.email=decoded.email;
                req.body.password=password;
                next();
            }  
            
    } 
    catch (error) {
            console.log(error);
            res.send({ 
                code: 400, 
                message: "Bad Request :Invalid Parameters", 
                payload: error }) 
    }
}

const logdetailsverify=async (req,res,next)=>{
    try { 
            const schema = Joi.object({ 
                email:Joi.string().email().required(),
                password: Joi.string().required(),
            }) 
            const value = await schema.validateAsync(req.body);
            next() 
    } 
    catch (error) {
            
            return res.status(400).send({ 
                code: 3, 
                message: "Bad Request :Invalid Parameters", 
                payload: error }) 
    }
}

const googleuser=async (req,res,next)=>{
     
    try {
        
        const googletoken = req.body.credential ;
        const decoded = jwt(googletoken);
        const user= await userschema.findOne({email:decoded.email});
        if(user==null){
            return(res.send({ 
                code: 400, 
                message: "This Emailid is not associated with our site!!", 
                }) )
        }
        else{
            req.body.name=decoded.name;
            req.body.email=decoded.email;
            next();
        }  
        
} 
catch (error) {
        console.log(error);
        res.send({ 
            code: 400, 
            message: "Bad Request :Invalid Parameters", 
            payload: error }) 
}
}

const otpsendingDetailsVerify=async (req,res,next)=>{
    try { 
            const schema = Joi.object({ 
                email:Joi.string().email().required(),
            }) 
            const value = await schema.validateAsync(req.body);
            next() 
    } 
    catch (err) {
                res.status(400).send({  
                message: "Bad Request :Invalid Parameters", 
                err: err }) 
    }
}

const resetPasswordDetailsVerify=async (req,res,next)=>{
    try { 
            const schema = Joi.object({ 
                email:Joi.string().email().required(),
                password:Joi.number().password().required(),
                confrimpassword:Joi.number().password().required(),
            }) 
            const value = await schema.validateAsync(req.body);
            next() 
    } 
    catch (err) {
                res.status(400).send({  
                message: "Bad Request :Invalid Parameters", 
                err: err }) 
    }
}

const otpgen=async (req,res,next)=>{
    try { 
        var otp= randomstring.generate({
            length: 6,
            charset: 'numeric'
        });
        req.body.otp=otp;
        console.log(req.body);
        var result= await userschema.updateOne({ _id:ObjectId(req.body.userId)},{currentOtp:otp}).exec();
        next();
    } 
    catch (err) {
                console.log(err);
                res.status(400).send({  
                message: "Bad Request :Invalid Parameters", 
                err: err }) 
    }
}



module.exports = {regdetailsverify,otpgen,googleregdetailsverify,googleuser,logdetailsverify,otpsendingDetailsVerify,resetPasswordDetailsVerify,decodeandpasswordgenarating};