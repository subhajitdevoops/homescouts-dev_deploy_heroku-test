const express = require('express');
var home = express.Router();
//const adminservice = require('../controller/adminservice');



home.post('/detailpage', function (req, res) {
   
   res.send("===========");
    // adminservice.detailpage(data,picture,function (response) {
    //   res.send(response);
    // });
   });
   
 
module.exports=home;