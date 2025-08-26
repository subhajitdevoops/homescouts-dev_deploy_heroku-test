const express = require('express');
var user = express.Router();
const userAuthController = require('../controller/userAuthController');
const multer  = require('multer');
const upload = multer({ dest: 'assets/servicedocs/' });
const {detailschecking} = require('../middleware/registration');
const {checkLogin,passwordverify,
       userverify,otpSendingValidation,resetPasswordValidation} = require("../middleware/login");
const {regdetailsverify,logdetailsverify,googleregdetailsverify,decodeandpasswordgenarating,googleuser}=require("../validator/userAuthVerify");


  user.post('/registration',regdetailsverify,detailschecking,function (req, res) {
    const data = req.body;
    console.log(data);
    userAuthController.registration(data, function (response) {
      res.send(response);
    });
  });

  user.post('/googleregistration',decodeandpasswordgenarating,googleregdetailsverify,function (req, res) {
    const data = req.body;
    userAuthController.googleregistration(data, function (response) {
      res.send(response);
    });
  });

  user.post('/registration/otpverify',function (req, res) {
    const data = req.body;
    console.log("Registration OTP Verify Route - Request body:", data);
    userAuthController.otpverify(data, function (response) {
      console.log("Registration OTP Verify Route - Controller response:", response);
      res.send(response);
    });
  });

  user.post('/login',logdetailsverify,userverify,function (req, res) {
    var data = req.body;
    userAuthController.login(data, function (response) {
      res.send(response);
    });
  });

  user.post('/googlelogin',googleuser,function (req, res) {
    var data = req.body;
    console.log(data);
    userAuthController.googlelogin(data, function (response) {
      res.send(response);
    });
  });

  user.post('/resetpassword',otpSendingValidation,function (req, res) {
    var sbrrdata = req.body;
    userAuthController.otpsend(sbrrdata, function (response) {
      res.send(response);
    });
  });

  user.post('/resetotpverify', function (req, res) {
    var sbrrdata = req.body;
    console.log("Reset OTP Verify Route - Request body:", sbrrdata);
    userAuthController.otpverify(sbrrdata, function (response) {
      console.log("Reset OTP Verify Route - Controller response:", response);
      res.send(response);
    });
  });

  user.post('/setpassword',resetPasswordValidation,function (req, res) {
    var sbrrdata = req.body;
    userAuthController.resetpassword(sbrrdata, function (response) {
      res.send(response);
    });
  });

  user.post('/changepassword',checkLogin,passwordverify,function (req, res) {
      var data = req.body;
      userAuthController.userchangepwd(data, function (response) {
        res.send(response);
      });
  });

module.exports=user