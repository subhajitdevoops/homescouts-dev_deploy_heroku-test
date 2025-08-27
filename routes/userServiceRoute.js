const express = require('express');
var user = express.Router();
const userServiceController = require('../controller/userServiceController');
const {otpgen} = require('../validator/userAuthVerify');

const multer  = require('multer');
var crypto = require('crypto');
const path  = require('path');
const {checkLogin,passwordverify,loginornot,contactexistornot,emailExistOrNot,activeOrNot} = require("../middleware/login");
const mongoose = require('mongoose');
var unirest = require('unirest');
user.use(express.urlencoded({ extended: false }));
var {userExistOrNot}=require('../middleware/userExistOrNot');


var storage = multer.diskStorage({
  destination: function(req, file, cb) { 
      var location ='./upload/postproperty';
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
const upload = multer( {});
var Upload=upload.fields([{ name: 'propertyimage', maxCount: 7 }]);



//------------------------------------user mobile checking ----------------------------------------
    user.get('/phonenumberchecking',checkLogin,activeOrNot,function(req,res){
      var data = req.body;
      data.userId=req.query.userId
      userServiceController.phonenumberchecking(data,function(response){
      res.send(response);
      });
    });

//------------------------------------Service Services----------------------------------------
    user.post('/applyforservices',checkLogin,activeOrNot,contactexistornot,function(req,res){
      var data = req.body;
      data.userId=req.query.userId
      
      userServiceController.applyforservices(data,function(response){
      res.send(response);
      });
    });
    user.get('/getservicesbyserviceid',checkLogin,function(req,res){
      var data = req.query;
      data.userId=req.query.userId;
      
      userServiceController.getservicesbyserviceid(data,function(response){
      res.send(response);
      });
    });
    user.post('/servicactiveinactive',checkLogin,activeOrNot,function(req,res){
      var data = req.body;
      data.userId=req.query.userId
      userServiceController.servicactiveinactive(data,function(response){
      res.send(response);
      });
    });
    user.get('/getapplyforservices',checkLogin,function(req,res){
      var data = req.body;
      data.userId=req.query.userId
      userServiceController.getapplyforservices(data,function(response){
      res.send(response);
      });
    });
    user.get('/serviceslistingsettings',function(req,res){
      var data = req.query;
      data.userId=req.query.userId;
      userServiceController.serviceslistingsettings(data,function(response){
      res.send(response);
      });
    });
    user.get('/serviceslisting',checkLogin,function(req,res){
      var data = req.query;
      data.userId=req.query.userId
      userServiceController.serviceslisting(data,function(response){
      res.send(response);
      });
    });
    user.get('/serviceslistingbyid',checkLogin,function(req,res){
      var data = req.query;
      data.userId=req.query.userId;
      
      userServiceController.serviceslistingbyid(data,function(response){
      res.send(response);
      });
    });
    user.get('/visitorcounterbyserviceid',checkLogin,function (req, res) {
      const data=req.query;
      userServiceController.visitorcounterbyserviceid(data,function (response) {
        res.send(response);
      });
    });

//-------------------------------Post Property ------------------------------------------
    user.get('/getallproperty',loginornot,function (req, res) {
    var details = req.query;
    details.userId=req.query.userId;
    if(req.query.filterdata){
      details.filterdata=details.filterdata;
    }
  
    if(details.filterdata && details.filterdata.typeOfProperty && details.filterdata.typeOfProperty.length>0){
      toLower = function(x){ 
        return x.toLowerCase();
      };
      details.filterdata.typeOfProperty=details.filterdata.typeOfProperty.map(toLower);
    };

    if(details.filterdata && details.filterdata.catagory && details.filterdata.catagory.length>0){
      toLower = function(x){ 
        return x.toLowerCase();
      };
      details.filterdata.catagory=details.filterdata.catagory.map(toLower);
    };

    if(details.filterdata && details.filterdata.subCatagory && details.filterdata.subCatagory.length>0){
      toLower = function(x){ 
        return x.toLowerCase();
      };
      details.filterdata.subCatagory=details.filterdata.subCatagory.map(toLower);
    }
 
    if(details.filterdata && details.filterdata.locality && details.filterdata.locality.length>0){
      toLower = function(x){ 
        return x.toLowerCase();
      };
      details.filterdata.locality=details.filterdata.locality.map(toLower);
    };

    if(details.filterdata && details.filterdata.noOfBedRooms && details.filterdata.noOfBedRooms.length>0){
      toLower = function(x){ 
        return x.toLowerCase();
      };
      details.filterdata.noOfBedRooms=details.filterdata.noOfBedRooms.map(toLower);
    };

    if(details.filterdata && details.filterdata.furnishingTyp && details.filterdata.furnishingType.length>0){
      toLower = function(x){ 
        return x.toLowerCase();
      };
      details.filterdata.furnishingType=details.filterdata.furnishingType.map(toLower);
    };

    if(details.filterdata && details.filterdata.ownership && details.filterdata.ownership.length>0){
      toLower = function(x){ 
        return x.toLowerCase();
      };
      details.filterdata.ownership=details.filterdata.ownership.map(toLower);
    };

    if(details.filterdata && details.filterdata.expectedPrice && details.filterdata.expectedPrice.length>0){
      details.filterdata.expectedPrice=details.filterdata.expectedPrice;
    };

    if(details.filterdata && details.filterdata.carpetArea && details.filterdata.carpetArea.length>0){
      // toLower = function(x){ 
      //   return x.toLowerCase();
      // };
      //details.filterdata.carpetArea=details.filterdata.carpetArea.map(toLower);
        details.filterdata.carpetArea=details.filterdata.carpetArea;
    };

    if(details.filterdata && details.filterdata.ageOfProperty && details.filterdata.ageOfProperty.length>0){
      toLower = function(x){ 
        return x.toLowerCase();
      };
      details.filterdata.ageOfProperty=details.filterdata.ageOfProperty.map(toLower);
    };

    if(details.filterdata && details.filterdata.availableFor && details.filterdata.availableFor.length>0){
      toLower = function(x){ 
        return x.toLowerCase();
      };
      details.filterdata.availableFor=details.filterdata.availableFor.map(toLower);
    };

    userServiceController.getallproperty(details, function (response) {
      res.send(response);
    });
    });
    user.get('/getallproperty/:property_id',loginornot,function (req, res) {
      var details = req.params;
      details.userId=req.query.userId;
      userServiceController.getpropertybypropertyid(details, function (response) {
        res.send(response);
      });
    });
    user.get('/getpropertybyuserid',checkLogin,function (req, res) {
      var details = req.query;
      userServiceController.getpropertybyid(details, function (response) {
        res.send(response);
      });
    });
    user.post('/postpropertydata',checkLogin,activeOrNot,contactexistornot,function (req, res) {
      var data=req.body;
      data.userId=req.query.userId;
      
      userServiceController.postpropertydata(data,function (response) {
        res.send(response);
      });
    });
    user.get('/incompletepostpropertydata',checkLogin,function (req, res) {
      const data=req.query;
      userServiceController.incompletepostpropertydata(data,function (response) {
        res.send(response);
      });
    });
    user.post('/discardpostpropertydata',checkLogin,activeOrNot,function (req, res) {
      const data=req.query;
      
      userServiceController.discardpostpropertydata(data,function (response) {
        res.send(response);
      });
    });
    user.get('/visitorcounterbyid',checkLogin,function (req, res) {
      const data=req.query;
      userServiceController.visitorcounterbyid(data,function (response) {
        res.send(response);
      });
    });
    user.post('/enquiry',userExistOrNot,activeOrNot,function(req, res) {
      const data=req.body;
      userServiceController.enquiry(data,function (response) {
        res.send(response);
      });
    });
    user.post('/propertyactiveinactive',checkLogin,activeOrNot,function(req,res){
      var data = req.body;
      data.userId=req.query.userId
      userServiceController.propertyactiveinactive(data,function(response){
      res.send(response);
      });
    });
    user.get('/getfurnishing',checkLogin,function (req, res) {
      var data;
      //data.userId=req.query.userId;
      userServiceController.getfurnishing(function (response) {
        res.send(response);
      });
    });

    //----------------------------------image Upload------------------------------------------

    // user.post('/imageupload',checkLogin,Upload.array('photos', 12),function (req, res) {
    // const data=req.query;
    // res.send(req.files)
    // });
    // user.post('/fileupload',checkLogin,fileUpload,function (req,res) {
    //   
    //   res.send(req.files);
    // });

//---------------------------------- Chat ------------------------------------------
    user.post('/chat',checkLogin,activeOrNot,function (req, res) {
      
      var data=req.body;
      data.userId=req.query.userId;
      data.name=req.query.name;
      userServiceController.chat(data,function (response) {
        res.send(response);
      });
    });
    user.get('/getchatbyuserid',checkLogin,function (req, res) {
      var data=req.body;
      data.userId=req.query.userId;
      data.name=req.query.name;
      userServiceController.getchatbyuserid(data,function (response) {
        res.send(response);
      });
    });
    user.get('/getchatbychatid',checkLogin,function (req, res) {
      var data=req.query;
      data.userId=req.query.userId;
      data.name=req.query.name;
      userServiceController.getchatbychatid(data,function (response) {
        res.send(response);
      });
    });
    user.post('/blockchatbychatid',checkLogin,activeOrNot,function (req, res) {
      var data=req.body;
      data.userId=req.query.userId;
      data.name=req.query.name;
      userServiceController.blockchatbychatid(data,function (response) {
        res.send(response);
      });
    });
    user.post('/deletechatroom',checkLogin,activeOrNot,function (req, res) {
      var data=req.body;
      data.userId=req.query.userId;
      data.name=req.query.name;
      console.log(data);
      userServiceController.deletechatroom(data,function (response) {
        res.send(response);
      });
    });

//------------------------------------Report Section----------------------------------------
    user.post('/statusupdate',checkLogin,activeOrNot,function (req, res) {
      var data=req.body;
      data.userId=req.query.userId;
      data.name=req.query.name;
      userServiceController.statusUpdate(data,function (response) {
        res.send(response);
      });
    });
    user.post('/createreport',checkLogin,activeOrNot,function (req, res) {
      var data=req.body;
      data.userId=req.query.userId;
      data.name=req.query.name;
      userServiceController.createreport(data,function (response) {
        res.send(response);
      });
    });
    user.get('/getstatusbylocation',function(req,res){
      var data={};
      data.userId=req.query.userId;
      data.location=req.query.location;
      data.name=req.query.name;
      userServiceController.getstatusbylocation(data,function (response) {
        res.send(response);
      });
    })

//------------------------------------Profile Section----------------------------------------
    user.get('/getprofile',checkLogin,function (req, res) {
      var data;  //report id and admin_approval receive
      data=req.query;
      
      userServiceController.getprofile(data,function (response) {
         res.send(response);
        });  
    });
    user.post('/updateprofile',checkLogin,activeOrNot,function (req, res) {
      var data;  //report id and admin_approval receive
      data=req.body;
      data.userId=req.query.userId;
      
      userServiceController.updateprofile(data,function (response) {
         res.send(response);
        });  
    });
    user.post('/otpsentforchangepassword',checkLogin,passwordverify,activeOrNot,function (req, res) {
      var data = req.body;
      data.userId=req.query.userId;
     // data.email=req.query.email;
     
     userServiceController.otpsend(data, function (response) {
        res.send(response);
      });
    });
    user.post('/otpverifyforchangepassword',checkLogin,activeOrNot, function (req, res) {
      var data = req.body;
      userServiceController.otpverify(data, function (response) {
        res.send(response);
      });
    });
    user.post('/otpsentforchangeemail',checkLogin,emailExistOrNot,activeOrNot,function (req, res) {
      var data = req.body;
      
      userServiceController.otpsendforemail(data, function (response) {
        res.send(response);
      });
    });
    user.post('/otpverifyforchangeemail',checkLogin,activeOrNot, function (req, res) {
      var data = req.body;
      userServiceController.otpverifyforemail(data, function (response) {
        res.send(response);
      });
    });
    // not used //
    user.post('/otpsentforrera',checkLogin,activeOrNot,function (req, res) {
      var data = req.body;
      data.userId=req.query.userId;     
     userServiceController.otpsentforrera(data, function (response) {
        res.send(response);
      });
    });
    user.post('/otpverifyforrera',checkLogin,activeOrNot, function (req, res) {
      var data = req.body;
      userServiceController.otpverifyforrera(data, function (response) {
        res.send(response);
      });
    });


    // mail id use for otp 
    // user.post('/otpsendforphonenumber',checkLogin,function (req, res) {
    //   var data = req.body;
      
    //   userServiceController.otpsendforphonenumber(data, function (response) {
    //     res.send(response);
    //   });
    // });
    // user.post('/otpverifyforphonenumber',checkLogin, function (req, res) {
    //   var data = req.body;
    //   userServiceController.otpverifyforphonenumber(data, function (response) {
    //     res.send(response);
    //   });
    // });

    // ph number use for otp
    user.post('/phonenumberotpsent',otpgen,activeOrNot,function(req,res){
      var data = req.body;
      data.userId=req.query.userId
      userServiceController.phonenumberotpsent(data,function(response){
      res.send(response);
      });
    });
    user.post('/phonenumberotpverify', activeOrNot,function (req, res) {
      var data = req.body;
      userServiceController.phonenumberotpverify(data, function (response) {
        res.send(response);
      });
    });

//------------------------------------Notification Services----------------------------------------
    user.get('/notification',checkLogin, function (req, res) {
      var data = req.query;
      userServiceController.getnotification(data, function (response) {
        res.send(response);
      });
    });
    user.post('/notification',checkLogin,activeOrNot, function (req, res) {
      var data = req.body;
      userServiceController.notificationcontroller(data, function (response) {
        res.send(response);
      });
    });

//------------------------------------Dynamic Filter Option----------------------------------------
    user.get('/dynamicfilteroption', function (req, res) {
      var data = req.query;
      userServiceController.dynamicfilteroption(data, function (response) {
        res.send(response);
      });
    });

//------------------------------------Property Sortlist Services----------------------------------------
    user.post('/propertysortlist',checkLogin,activeOrNot, function (req, res) {
      var data = req.body;
       data.userId = req.query.userId;
      userServiceController.propertysortlist(data, function (response) {
        res.send(response);
      });
    });
    user.get('/propertysortlist',checkLogin, function (req, res) {
      var data = req.body;
      data.userId = req.query.userId;
      userServiceController.getpropertysortlist(data, function (response) {
        res.send(response);
      });
    });

//------------------------------------Service Sortlist Services----------------------------------------
    user.post('/servicesortlist', checkLogin,activeOrNot,function (req, res) {
      var data = req.body;
      //data.userId = req.query.userId;
      data.userId=mongoose.Types.ObjectId(req.query.userId);
      userServiceController.servicesortlist(data, function (response) {
        res.send(response);
      });
    });
    user.get('/servicesortlist',checkLogin, function (req, res) {
      var data = req.body;
      data.userId=req.query.userId;
      userServiceController.getservicesortlist(data, function (response) {
        res.send(response);
      });
    });


    user.post('/test',function(req, res) {
      const data=req.body;
      userServiceController.test(data,function (e) {
        res.send(e);
      });
    });


module.exports=user;