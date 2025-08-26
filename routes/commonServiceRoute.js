const express = require('express');
var commonService = express.Router();
const {checkLogin}=require('../middleware/login');
const {fileUpload}=require('../middleware/fileUpload');
const userServiceController = require('../controller/userServiceController');
const { fork } = require('child_process');
const mychildprocess =fork('fileUpload.js')


commonService.post('/fileupload',checkLogin,fileUpload,function (req,res) {
  
    res.send(req.files);
});

commonService.post('/three', (req,res) => {
    
    mychildprocess.send({message:'message'});

    mychildprocess.on('message', (sum) => {
      res.send({ sum });
    });

});

commonService.post('/contact',function(req,res){
  var data = req.body;
  userServiceController.contact(data,function(response){
  res.send(response);
  });
});

module.exports=commonService;