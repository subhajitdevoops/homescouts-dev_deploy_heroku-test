const express = require('express');
var admin = express.Router();
const adminAuthController = require('../controller/adminAuthController');
const {checkLogin,passwordverify,userverify} = require("../middleware/login");
const {logdetailsverify}=require("../validator/userAuthVerify");
const {detailschecking}=require("../middleware/registration");



  admin.post('/login',logdetailsverify,userverify,function (req, res) {
    var data = req.body;
    adminAuthController.login(data, function (response) {
      res.send(response);
    });
  });

  admin.post('/changepassword',checkLogin,passwordverify,function (req, res) {
      var data = req.body;
      adminAuthController.userchangepwd(data, function (response) {
        res.send(response);
      });
  });

  // admin.post('/registration',function (req, res) {
  //   const data = req.body;
  //   adminAuthController.registration(data, function (response) {
  //     res.send(response);
  //   });
  // });

  // admin.post('/resetpassword',otpSendingValidation,function (req, res) {
  //   var data = req.body;
  //   adminAuthController.otpsend(data, function (response) {
  //     res.send(response);
  //   });
  // });

  // admin.post('/resetotpverify', function (req, res) {
  //   var data = req.body;
  //   adminAuthController.otpverify(data, function (response) {
  //     res.send(response);
  //   });
  // });

  // admin.post('/setpassword',resetPasswordValidation,function (req, res) {
  //   var data = req.body;
  //   adminAuthController.resetpassword(data, function (response) {
  //     res.send(response);
  //   });
  // });

module.exports=admin;