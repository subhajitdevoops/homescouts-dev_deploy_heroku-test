const express = require('express');
const app=express();
var admin = express.Router();
const adminServiceController = require('../controller/adminServiceController');
const {checkLogin,isAdmin,isUserExitOrNot} = require("../middleware/login");
const propertysetting= require("../middleware/propertySetting");
const existornot= require("../middleware/existornot");
const multer  = require('multer');
const path  = require('path');
var crypto = require('crypto');

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));


var storage = multer.diskStorage({
  destination: function(req, file, cb) { 
    var location ='./upload/dynamicHomepage';
    cb(null, location);    
},
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
    if (err) return cb(err)
    var files= raw.toString('hex') + path.extname(file.originalname);
      cb(null, files);
    })
  },

});
const fileFilter = (req, file, cb) => {
  if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype== 'video/svg' ){
  cb(null, true);
  } else {
  cb(null, false);
  }
 }
const upload = multer({ storage: storage },fileFilter)


var Upload=upload.fields([{name: 'sliderImage', maxCount: 5 }, { name: 'seccondaryImage', maxCount: 1 },
                          {name:'featureImage',maxCount:1},{name:'updateImage',maxCount:3},
                          {name:'serviceImage',maxCount:1},{name:'testimonyImage',maxCount:1}]);


  admin.post('/propertysettings',checkLogin,isAdmin,propertysetting,function (req, res) {
    var propertysettings = req.body;
    adminServiceController.propertysettings(propertysettings, function (response) {
      res.send(response);
    });
  });
  admin.get('/propertysettings',checkLogin,function (req, res) {
    var data=req.body;
    adminServiceController.getpropertysettings(data,function (response) {
      res.send(response);
    });
  });
  admin.post('/addfurnishing',checkLogin,isAdmin,propertysetting,function (req, res) {
    var data=req.body;
    adminServiceController.addfurnishing(data,function (response) {
      res.send(response);
    });
  });
  admin.get('/getfurnishing',checkLogin,isAdmin,function (req, res) {
    var data;
    //data.userId=req.query.userId;
    adminServiceController.getfurnishing(function (response) {
      res.send(response);
    });
  });

  admin.post('/addservicesettings',checkLogin,isAdmin,function (req, res) {
  var data=req.body;
  adminServiceController.addservicesettings(data,function (response) {
     res.send(response);
    });  
  });
  admin.get('/servicesettings',checkLogin,isAdmin,function (req, res) {
    var data= req.query.userId;
    adminServiceController.getservicesettings(data,function (response) {
       res.send(response);
      });  
  });
  admin.post('/deleteservice',checkLogin,isAdmin,existornot,function (req, res) {
      var data=req.body;
      adminServiceController.deleteservice(data,function (response) {
         res.send(response);
        });  
  });
  admin.post('/activeinactiveservice',checkLogin,isAdmin,existornot,function (req, res) {
    var data=req.body;
    adminServiceController.activeinactiveservice(data,function (response) {
       res.send(response);
      });  
  });

  admin.get('/getuserlist',checkLogin,isAdmin,function (req, res) {
    var data= req.query;
    adminServiceController.getuserlist(data,function (response) {
       res.send(response);
      });  
  });
  admin.post('/blockuser',checkLogin,isAdmin,function (req, res) {
    var data= req.body;
    adminServiceController.blockuser(data,function (response) {
       res.send(response);
      });  
  });
  admin.get('/blockuserlist',checkLogin,isAdmin,function (req, res) {
    var data= req.query;
    adminServiceController.blockuserlist(data,function (response) {
       res.send(response);
      });  
  });
  admin.get('/getuserbyid',checkLogin,isAdmin,function (req, res) {
    var data= req.query;
    adminServiceController.getuserbyid(data,function (response) {
       res.send(response);
      });  
  });
  admin.get('/pendingproperty',checkLogin,isAdmin,function (req, res) {
    var data= req.query;
    adminServiceController.pendingproperty(data,function (response) {
       res.send(response);
      });  
  });
  admin.get('/pendingservices',checkLogin,isAdmin,function (req, res) {
    var data= req.query;
    adminServiceController.pendingservices(data,function (response) {
       res.send(response);
      });  
  });
  admin.post('/activeinactivebyuserid',checkLogin,isAdmin,function (req, res) {
    var data= req.body;
    adminServiceController.activeinactivebyuserid(data,function (response) {
       res.send(response);
      });  
  });

  admin.post('/statuschangepostproperty',checkLogin,isAdmin,function (req, res) {
    var data=req.body;  //property id and admin_approval receive
    
    adminServiceController.statuschangepostproperty(data,function (response) {
       res.send(response);
      });  
  });
  admin.post('/statuschangeservices',checkLogin,isAdmin,function (req, res) {
    var data=req.body;  //property id and admin_approval receive
    adminServiceController.statuschangeservices(data,function (response) {
       res.send(response);
      });  
  });

  admin.post('/dynamichomepage',checkLogin,isAdmin,function (req, res) {
    // const filename=req.files;
    const data=req.body;
    
    adminServiceController.dynamichomepage(data,function (response) {
      res.send(response);
    });
  });
  admin.get('/dynamichomepage',function (req, res) {
  const data=req.query;
  adminServiceController.getdynamichomepage(data, function (response) {
     res.send(response);
  });

  });
  admin.get('/reportlisting',checkLogin,isAdmin,function (req, res) {
    var data=req.query;  //report id and admin_approval receive
    adminServiceController.reportlisting(data,function (response) {
       res.send(response);
      });  
  });
  // admin.post('/statuschangereport',checkLogin,isAdmin,function (req, res) {
  //   var data=req.body;  //report id and admin_approval receive
  //   adminServiceController.statuschangereport(data,function (response) {
  //      res.send(response);
  //     });  
  // });
  admin.get('/getprofile',checkLogin,isAdmin,function (req, res) {
    var data;  //report id and admin_approval receive
    data=req.query;
    
    adminServiceController.getprofile(data,function (response) {
       res.send(response);
      });  
  });
  admin.post('/updateprofile',checkLogin,isAdmin,function (req, res) {
    var data;  //report id and admin_approval receive
    data=req.body;
    data.userId=req.query.userId;
    
    adminServiceController.updateprofile(data,function (response) {
       res.send(response);
      });  
  });
  admin.get('/getpropertybyuserid',checkLogin,isAdmin,function (req, res) {
    var details = req.query;
    
    adminServiceController.getpropertybyid(details, function (response) {
      res.send(response);
    });
  });
  admin.get('/serviceslistingbyid',checkLogin,isAdmin,function(req,res){
    var data = req.query;
    data.userId=req.query.userId;
    
    adminServiceController.serviceslistingbyid(data,function(response){
    res.send(response);
    });
  });
  admin.post('/verifyproperty',checkLogin,isAdmin,function (req, res) {
    var details = req.body;
    adminServiceController.verifyproperty(details, function (response) {
      res.send(response);
    });
  });
  admin.post('/feature',checkLogin,isAdmin,function(req,res){
    var data = req.body;
    adminServiceController.feature(data,function(response){
    res.send(response);
    });
  });
  admin.get('/dashboard',checkLogin,isAdmin,function(req,res){
    var data = req.query;
    adminServiceController.dashboard(data,function(response){
    res.send(response);
    });
  });
  admin.get('/contact',checkLogin,isAdmin,function(req,res){
    var data = req.query;
    adminServiceController.contact(data,function(response){
    res.send(response);
    });
  });
  
module.exports=admin;