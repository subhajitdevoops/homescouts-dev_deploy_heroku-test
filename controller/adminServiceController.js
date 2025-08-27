"use strict"
const detailschema = require('../schema/dynamicHomepageSchema');
const propertyschema = require('../schema/propertyschema');
const propertypostschema = require('../schema/propertypostschema');
const serviceSchemaSettings = require('../schema/serviceSchemaSettings');
const userschema = require('../schema/userschema');
const applyForService = require('../schema/applyForServiceSchema');
const reportSchema = require('../schema/reportSchema');
const notificationSchema = require('../schema/notificationSchema');
const {notificationmessage}=require('../helper/notification-message');
const mongoose = require('mongoose');
const contactSchema = require('../schema/contactSchema');
db = require('mongodb').Db;
const { messages } = require('../helper/constant-messages');

const { date } = require('joi');


var adminServiceController = {

//-----------------------------Property Settings --------------------------------------
propertysettings: async function (data, callback) {
    try{
        var step=data.step;
        if(data.id){
          let result1 = await propertyschema.findOne({ _id: data.id }).exec();
          let flag = false;  // Initialize flag to false
          var index = -1;  // Initialize index to -1
          console.log(result1);
          for (let j = 0; j < result1.typeOfProperty.length; j++) {
              if (result1.typeOfProperty[j].name == step) {
                  flag = true;
                  index = j;
                  break;  // Exit loop if found
              }
          }
          console.log(flag);
            if(flag){  
                         // foundData.typeOfProperty[index]=data.typeOfProperty;
                         const result =  await propertyschema.updateOne(
                          { _id: data.id, 'typeOfProperty.name': step },
                          { 'typeOfProperty.$.catagory':  data.typeOfProperty.catagory } 
                        );
                         return(callback({
                            success: true, 
                            message: "Sucessfully Updated!!!", 
                            result
                          }))
            }
            else{  // added new option with existing documents
                    var result= await propertyschema.updateOne({ _id:data.id },{$push:{typeOfProperty:data.typeOfProperty}}).exec();
                    callback({
                        success: true, 
                        message: "Sucessfully new type of property added!!!", 
                        result
                     });
                }          
        }
        else{ // first time created documents
          console.log("qqqqqqqqqq");
            const propertypost = new propertyschema({
                ...data,
            });
            propertypost.save((err, res) => {
                if (err) {
                    callback({
                        success: false, 
                        message: "some internal error has occurred", 
                        error: err
                    });
                }
                else {     
                        callback({
                        success: true, 
                        message: "Sucessfull!!!!!", 
                        res
                    });
                }
            });
        };
    }
    catch(err){
      console.log(err);
        callback({
            success: false, 
            message: "unsucess",
            err
        });
    }
},
getpropertysettings: async function (data, callback) {
    try{
        var foundData=await propertyschema.find({}).exec();
        callback({
                 success: true, 
                 response:foundData
                });
    }
    catch(err){
        callback({
            success: false, 
            message: "unsucess",err
        });
    }
},
getpropertybyid: async function (data, callback) {
    try{
        
        const property = await propertypostschema.aggregate([
            {
              $match: {
                userId: mongoose.Types.ObjectId(data.id)
            }},
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $unwind: '$user',
            },
          ]);
            callback({
                        success: true, 
                        message: "property fetched Sucessfully!!",
                        property
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
serviceslistingbyid: async function (data, callback) {
    try{ 
        var location;
        var searchQuery;
        var limit;
        var page;

        if(data.page && data.limit && data.searchQuery && data.location){
            
            searchQuery=data.searchQuery;
            location=data.location;
            limit=Number(data.limit);
            page=Number(data.page);
        }
        else if(data.page && data.limit && data.searchQuery){
            
                limit=Number(data.limit);
                page=Number(data.page);
                searchQuery=data.searchQuery;
                location="";  
        }
        else if(data.page && data.limit && data.location){
            
                limit=Number(data.limit);
                page=Number(data.page);
                location=data.location;  
        }
        else if(data.page && data.limit){
            
            limit=Number(data.limit);
            page=Number(data.page);
            searchQuery="";
            location="";
        }
        else if(data.searchQuery && data.location){
            
            searchQuery=data.searchQuery;
            location=data.location;
        }
        else if( data.searchQuery){
            
            searchQuery=data.searchQuery;
            location="";
        }
        else if( data.location){
            
            var location=data.location;
            searchQuery="";
        }
        else{
            
            limit=2;
            page=1;
            searchQuery="";
            location="";
        };  
        // var dataQuery=[];
        // dataQuery.push({'$match':{'$and':[{'add_offering_location':{$regex:location,$options:'i'}},
        //                         {'service_offering_title':{$regex:searchQuery,$options:'i'}},
        //                         {'admin_approval':"approved"}]}});
        
  //  const result =await applyForService.find({userId:data.id}).skip((page-1)*limit).limit(Number(limit)).exec();
  
//   const result = await applyForService.aggregate([
//     { '$match': { userId: mongoose.Types.ObjectId(data.id) } },
//     {
//       $lookup: {
//         from: "users",
//         localField: "userId",
//         foreignField: "_id",
//         as: "user"
//       },
//     }
//   ]).skip((page - 1) * limit).limit(Number(limit));
const result = await applyForService.aggregate([
    { '$match': { userId: mongoose.Types.ObjectId(data.id) } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      },
    },
    {
      $lookup: {
        from: "serviceschemasettings",
        localField: "select_your_offering",
        foreignField: "name",
        as: "serviceSettings"
      }
    }
  ]).skip((page - 1) * limit).limit(Number(limit));
  
  
  
  result.forEach((item) => {
    if (Array.isArray(item.user)) {
      item.user = item.user[0];
    }
  });
    var countdata=await applyForService.find({userId:data.id}).exec();
    var count=countdata.length;
  var prevPage,hasPrevPage,nextPage,hasNextPage;
    var totallength=Math.ceil(count/limit);
        if(totallength==1 && page==totallength ){
            prevPage=null;
            hasPrevPage=false;
            nextPage=null;
            hasNextPage=false;
            
        }
        else if(page==1 && totallength>page) {
                    prevPage=null;
                    hasPrevPage=false;``
                    nextPage=Number(page)+1; 
                    hasNextPage=true;
                    
        }
        else if(page>1 && page==totallength){
                prevPage=Number(page)-1;
                hasPrevPage=true;
                nextPage=null;
                hasNextPage=false;
                
        }
        else{
                prevPage=Number(page)-1;
                nextPage=Number(page)+1;
                hasPrevPage=true;
                hasNextPage=true;
                
        }

            const  Pagination ={
            "TotalDocuments":count,
            "limit":limit,
            "TotalPages":totallength,
            "Current Page":page,
            "PrevPage":prevPage,
            "NextPage":nextPage,
            "HasPrevPage":hasPrevPage,
            "HasNextPage":hasNextPage,
            "PagingCounter":page,        // consider index starting from 1,so pagingcounter will be same like index number //
            };

         callback({
            success: true, 
            message: "sucessfully fetch!!!!!", 
            result,
            Pagination
        });  
        }
        catch(error){
            
            callback({
                success: false, 
                message: "error!!!!!", 
                error
            });
        }
},
//------------------------------Furnishing Settings -----------------------------------
addfurnishing: async function (data, callback) {
    try{
                      
        // if(data._id){   
        //     
        //                  var result= await propertyschema.updateOne({ _id:data._id},{$set:{furnishingDetails:data.furnishingDetails}}).exec();
        //                  callback({
        //                     success: true, 
        //                     message: "Sucessfully Updated!!!", 
        //                     result
        //                   });
      //  var foundData=data.furnishingDetails;      
        var step=data.step;
        if(data.id){
          let result1 = await propertyschema.findOne({ _id: data.id }).exec();
          let flag = false;  // Initialize flag to false
          let index = -1;  // Initialize index to -1

          for (let j = 0; j < result1.furnishingDetails.length; j++) {
              if (result1.furnishingDetails[j].type === step) {
                  flag = true;
                  index = j;
                  break;  // Exit loop if found
              }
          }
            if(flag){  
                         // foundData.typeOfProperty[index]=data.typeOfProperty;
                         const result =  await propertyschema.updateOne(
                          { _id: data.id, 'furnishingDetails.type': step },
                          { 'furnishingDetails.$.amenities':  data.furnishingDetails.amenities }
                        );
                         return(callback({
                            success: true, 
                            message: "Sucessfully Updated!!!", 
                            result
                          }))
            }
            else{  // added new option with existing documents
              console.log("e");
                    var result= await propertyschema.updateOne({ _id:data.id },{$push:{furnishingDetails:data.furnishingDetails}}).exec();
                    return(callback({
                        success: true, 
                        message: "Sucessfully new type of property added!!!", 
                        result
                     }))
            }          
        }      
        else{ // first time created documents
            const propertypost = new propertyschema({
                ...data,
            });
            propertypost.save((err, res) => {
                if (err) {
                    return(callback({
                        success: false, 
                        message: "some internal error has occurred", 
                        error: err
                    }))
                }
                else {     
                        return(callback({
                        success: true, 
                        message: "Sucessfully added!!!!!", 
                        res
                    }))
                }
            });
        };
    }
    catch(err){
      console.log(err);
        callback({
            success: false, 
            message: "unsucess",
            err
        });
    }
},
// addfurnishing: async function (data, callback) {
//   try {
//       var step = data.step;
//       if (data.id) {
//           let result1 = await propertyschema.findOne({ _id: data.id }).exec();
//           let flag = false;  // Initialize flag to false
//           let index = -1;  // Initialize index to -1

//           for (let j = 0; j < result1.furnishingDetails.length; j++) {
//               if (result1.furnishingDetails[j].type === step) {
//                   flag = true;
//                   index = j;
//                   break;  // Exit loop if found
//               }
//           }

//           if (flag) {
//               // Update amenities under the corresponding furnishingDetails index
//               result1.furnishingDetails[index].amenities = data.furnishingDetails[0].amenities;
//               var result = await propertyschema.updateOne({ _id: data.id }, { $set: { furnishingDetails: result1.furnishingDetails } }).exec();
//               return (callback({
//                   success: true,
//                   message: "Sucessfully Updated!!!",
//                   result
//               }));
//           } else {
//               // Add new option with existing documents
//               var result = await propertyschema.updateOne({ _id: data.id }, { $push: { furnishingDetails: data.furnishingDetails } }).exec();
//               return (callback({
//                   success: true,
//                   message: "Sucessfully new type of property added!!!",
//                   result
//               }));
//           }
//       } else {
//           // First time creating documents
//           const propertypost = new propertyschema({
//               ...data,
//           });
//           propertypost.save((err, res) => {
//               if (err) {
//                   return (callback({
//                       success: false,
//                       message: "some internal error has occurred",
//                       error: err
//                   }));
//               } else {
//                   return (callback({
//                       success: true,
//                       message: "Sucessfully added!!!!!",
//                       res
//                   }));
//               }
//           });
//       }
//   } catch (err) {
//       console.log(err);
//       callback({
//           success: false,
//           message: "unsucess",
//           err
//       });
//   }
// },


getfurnishing: async function (callback) {
    try{
        var result= await propertyschema.findOne({ },{furnishingDetails:1}).exec();
        callback({
                    success: true, 
                    message: "Sucessfully fetch!!!", 
                    result
                });
    }
    catch(err){
        callback({
            success: false, 
            message: "unsucess",
            err
        });
    }
},
//---------------------------DynamicHomepage Settings ---------------------------------
dynamichomepage:async function (data,callback){
    
    try{
        let step=data.step;
        let _id=data._id;
   
        switch(step)
        {
            case "home":        
                                var newhome={
                                    "title":data.title,
                                    "description":data.description,
                                    "quote":data.quote,
                                    "sliderImagepath": data.sliderImagepath,
                                    "seccondaryImagePath": data.seccondaryImagePath
                                };
                               if(_id){
                                // var sliderImagepath=[];
                                // for(var i=0;i<filename.sliderImage.length;i++){
                                //     sliderImagepath.push(filename.sliderImage[i].filename);
                                // };
                                // 
                                
                               var a= await detailschema.updateOne({ _id:_id },
                                    {$set:{home:newhome}}).exec();
                                callback({
                                            success: true, 
                                            message: messages.sucessfullySavedDetails,
                                            });
                                }
                                else{
                                    // 
                                    // var sliderImagepath=[];
                                    // for(var i=0;i<filename.sliderImage.length;i++){
                                    //     sliderImagepath.push(filename.sliderImage[i].filename);
                                    // };
                                    //
                                    // var newhome={
                                    //     home:{
                                    //         "title":data.title,
                                    //         "description":data.description,
                                    //         "quote":data.quote,
                                    //         "sliderImagepath": data.sliderImagepath,
                                    //          "seccondaryImagePath": data.seccondaryImage
                                    //         }
                                    //     };
                                
                                     var postproperty = new detailschema({
                                     ...newhome,
                                     });
                                     postproperty.save((err, res) => {
                                        if(res){  
                                            callback({
                                            success: true, 
                                            message: messages.sucessfullyCreatedDetails,
                                            });
                                        }
                                        else{
                                            callback({
                                                success: false, 
                                                message:messages.notSucess,
                                                err
                                                });
                                        }
                                        })    
                                }
                                break;
                                
            case "feature":     
                                if(_id){
                                //   var featureDetails=[];
                                //     for(var i=0;i<data.featureDetails.length;i++){
                                //         const imageName = "feature"+Date.now()+".jpeg";
                                //         const imageNamePath = path.join(__dirname,"../upload/dynamicHomepage",imageName);
                                //         const buffer = Buffer.from(data.featureDetails[i].featureIcon,"base64");
                                //         fs.writeFileSync(imageNamePath, buffer,'base64', function(err) {
                                //             
                                //           });
                                //       featureDetails.push({
                                //             iconPath:imageName,
                                //             featureDescription:data.featureDetails[i].featureDescription});
                                //     };  
                                //  const feature ={
                                //             "featureImagePath":filename.featureImage[0].filename, 
                                //             "featureHeadDescription":data.featureHeadDescription,  
                                //             "featureDetails":featureDetails
                                //           };
                                    await detailschema.updateOne({ _id:_id },
                                        {$set: {feature :data}}).exec();
                                        callback({
                                            success: true, 
                                            message: messages.sucessfullySavedDetails,
                                            });
                                }
                                else{
                                    
                                //        var featureDetails=[];
                                //     for(var i=0;i<data.featureDetails.length;i++){
                                //         const imageName = "feature"+Date.now()+".jpeg";
                                //         const imageNamePath = path.join(__dirname,"../upload/dynamicHomepage",imageName);
                                //         const buffer = Buffer.from(data.featureDetails[i].featureIcon,"base64");
                                //         fs.writeFileSync(imageNamePath, buffer,'base64', function(err) {
                                //             
                                //           });
                                //       featureDetails.push({
                                //             iconPath:filename.featureIcon[i].filename,
                                //             featureDescription:data.featureDetails[i].featureDescription});
                                //     };  
                               
                                //  const newfeature ={
                                //          feature:{
                                //             "featureImagePath":filename.featureImage[0].filename, 
                                //             "featureHeadDescription":data.featureHeadDescription,  
                                //             "featureDetails":featureDetails
                                //           }};
                                     var postproperty = new detailschema({
                                                ...data,
                                            });
                                     postproperty.save((err, res) => {
                                        if(err){  
                                          
                                            callback({
                                                success: false, 
                                                message:messages.notSucess,
                                                err
                                                });
                                        }
                                        else{
                                            callback({
                                                success: true, 
                                                message: messages.sucessfullyCreatedDetails,
                                                });
                                        }
                                        })    
                                }
                                break; 

            case "update":   
           
                                
                                if(_id){
                                 
                                    // var updateDetails=[];
                                    //   for(var i=0;i<data.updateDetails.length;i++){
                                    //     const imageName = "update"+Date.now()+".svg";
                                    //     const imageNamePath = path.join(__dirname,"../upload/dynamicHomepage",imageName);
                                    //     const buffer = Buffer.from(data.updateDetails[i].updateIcon,"base64");
                                    //     fs.writeFileSync(imageNamePath, buffer,'base64', function(err) {
                                    //         
                                    //       });
                                    //     updateDetails.push({
                                    //           iconPath:imageName,
                                    //           updateDescription:data.updateDetails[i].updateDescription});
                                    //   };

                                    //   var updateImagePath=[];
                                    //   for(var i=0;i<2;i++){
                                    //     updateImagePath[i]=filename.updateImage[i].filename
                                    //   }
                                      
                                    // const update ={
                                    //     "updateImagePath":updateImagePath,   
                                    //     "updateDetails":updateDetails
                                    //   };

                                    await detailschema.updateOne({ _id:_id },
                                        {$set: {update :data} }).exec();
                                        callback({
                                            success: true, 
                                            message:messages.sucessfullySavedDetails,
                                            });
                                }
                                else{
                                    
                                    // var updateDetails=[];
                                    // 
                                    //   for(var i=0;i<data.updateDetails.length;i++){
                                    //     const imageName = "update"+Date.now()+".jpeg";
                                    //     const imageNamePath = path.join(__dirname,"../upload/dynamicHomepage",imageName);
                                    //     const buffer = Buffer.from(data.updateDetails[i].updateIcon,"base64");
                                    //     fs.writeFileSync(imageNamePath, buffer,'base64', function(err) {
                                    //         
                                    //       });
                                    //     updateDetails.push({
                                    //           iconPath:imageNamePath,
                                    //           updateDescription:data.updateDetails[i].updateDescription});
                                    //   };  
                                    //   var updateImagePath=[];
                                    //   for(var i=0;i<2;i++){
                                    //     updateImagePath[i]=filename.updateImage[i].filename
                                    //   }
                                      
                                    // const newupdate ={
                                    //     update:{
                                    //     "updateImagePath":updateImagePath,
                                    //     "updateDetails":updateDetails
                                    //     }
                                    //   };
                                    //   
                                    var postproperty = new detailschema({
                                               ...data,
                                           });
                                    postproperty.save((err, res) => {
                                       if(res) {  
                                           callback({
                                           success: true, 
                                           message: messages.sucessfullyCreatedDetails,
                                           });
                                       }
                                       else{
                                           callback({
                                               success: false, 
                                               message:messages.notSucess,
                                               err
                                               });
                                       }
                                       })
                                }
                                break;  
                                
            case "services":     
                                if(_id)
                                {
                                    // 
                                    // var servicesDescription=[];
                                    // for(var i=0;i<data.servicesDescription.length;i++){
                                    //     const imageName = "services"+Date.now()+".jpeg";
                                    //     const imageNamePath = path.join(__dirname,"../upload/dynamicHomepage",imageName);
                                    //     const buffer = Buffer.from(data.servicesDescription[i].serviceIcon, "base64");
                                    //     fs.writeFileSync(imageNamePath, buffer,'base64', function(err) {
                                    //         
                                    //       });
                                    //     servicesDescription.push({
                                    //         iconPath:imageName,
                                    //         serviceTitle:data.servicesDescription[i].serviceTitle});
                                    // };    
                                  
                                    //  const services={
                                    //             "serviceImagePath":filename.serviceImage[0].filename,
                                    //             "servicesDescription": servicesDescription,
                                    //    };
                                    
                                    await detailschema.updateOne({_id:_id},{$set: {services :data}}).exec();
                                    callback({
                                            success: true, 
                                            message:messages.sucessfullySavedDetails,
                                            });
                                }
                                else{
                                    
                                //     var servicesDescription=[];
                                //     for(var i=0;i<data.servicesDescription.length;i++){
                                //         const imageName = "services"+Date.now()+".jpeg";
                                //         const imageNamePath = path.join(__dirname,"../upload/dynamicHomepage",imageName);
                                //         const buffer = Buffer.from(data.servicesDescription[i].serviceIcon, "base64");
                                //         fs.writeFileSync(imageNamePath, buffer,'base64', function(err) {
                                //             
                                //           });
                                //         servicesDescription.push({
                                //             iconPath:imageNamePath,
                                //             serviceTitle:data.servicesDescription[i].serviceTitle});
                                //     };  
                                // const newservices={
                                //     services:{
                                //         "serviceImagePath":filename.serviceImage[0].path,
                                //         "servicesDescription": servicesDescription,
                                //       }};
                                    var postproperty = new detailschema({
                                               ...data.services,
                                           });
                                    postproperty.save((err, res) => {
                                       if(res){  
                                           callback({
                                           success: true, 
                                           message: messages.sucessfullyCreatedDetails,
                                           });
                                       }
                                       else{
                                           callback({
                                               success: false, 
                                               message:messages.notSucess,
                                               err
                                               });
                                       }
                                       })
                                }    
                                break; 
                               
            case "testimony":  
                                
                               
                                if(_id){
                                    // var testimony=[];
                                    // for(var i=0;i<data.testimony.length;i++){
                                    //     const imageName = "testimony"+Date.now()+".jpeg";
                                    //     const imageNamePath = path.join(__dirname,"../upload/dynamicHomepage",imageName);
                                    //     const buffer = Buffer.from(data.testimony[i].testimonyImage, "base64");
                                    //     fs.writeFileSync(imageNamePath, buffer,'base64', function(err) {
                                    //         
                                    //       });
                                    //     testimony.push({
                                    //         testimonyImagePath:imageName,
                                    //         testimonyDescription:data.testimony[i].testimonyDescription});
                                    // };
                                
                                    detailschema.updateOne({ _id:_id },
                                        { $set: {testimony:data.testimony}},
                                        function (er, up) {
                                            callback({
                                                success: true, 
                                                message:messages.sucessfullySavedDetails
                                            })
                                        })
                                }
                                else{
                                   // 
                                    
                                    // var testimony=[];
                                    // for(var i=0;i<data.testimony.length;i++){
                                    //     const imageName = "testimony"+Date.now()+".jpeg";
                                    //     const imageNamePath = path.join(__dirname,"../upload/dynamicHomepage",imageName);
                                    //     const buffer = Buffer.from(data.testimony[i].testimonyImage, "base64");
                                    //     fs.writeFileSync(imageNamePath, buffer,'base64', function(err) {
                                    //         
                                    //       });
                                    //     testimony.push({
                                    //         testimonyImagePath:imageName,
                                    //         testimonyDescription:data.testimony[i].testimonyDescription});
                                    // };
                                
                                    const newtestimony={testimony:data.testimony};
                                    var postproperty = new detailschema({
                                               ...newtestimony,
                                           });
                                    postproperty.save((err, res) => {
                                       if(res){  
                                           callback({
                                           success: true, 
                                           message: messages.sucessfullyCreatedDetails,
                                           });
                                       }
                                       else{
                                           callback({
                                               success: false, 
                                               message:messages.notSucess,
                                               err
                                               });
                                       }
                                       })
                                }
                               
                                break; 

            case "faqs":
                                
                                if(_id){
                                    const faqs=data.faqs;
                                    detailschema.updateOne({ _id:_id },
                                        { $set: {faqs:faqs}},
                                        function (er, up) {
                                            callback({
                                                success: true, 
                                                message:messages.sucessfullySavedDetails,
                                            })
                                        })
                                }
                                else{
                                    
                                    var postproperty = new detailschema({
                                               ...data,
                                           });
                                    postproperty.save((err, res) => {
                                       if(res){  
                                           callback({
                                           success: true, 
                                           message: messages.sucessfullyCreatedDetails,
                                           });
                                       }
                                       else{
                                           callback({
                                               success: false, 
                                               message:messages.notSucess,err
                                               });
                                       }
                                       })
                                }
                                break;
        
            case "contact":
                                    
                                    if(_id){
                                        const contact=data.contact;
                                        detailschema.updateOne({ _id:_id },
                                            { $set: {contact:contact}},
                                            function (er, up) {
                                                callback({
                                                    success: true, 
                                                    message:messages.sucessfullySavedDetails,
                                                })
                                            })
                                    }
                                    else{
                                        
                                        var postproperty = new detailschema({
                                                   ...data,
                                               });
                                        postproperty.save((err, res) => {
                                           if(res){  
                                               callback({
                                               success: true, 
                                               message: messages.sucessfullyCreatedDetails,
                                               });
                                           }
                                           else{
                                               callback({
                                                   success: false, 
                                                   message:messages.notSucess,err
                                                   });
                                           }
                                           })
                                    }
                                    break;
                            }

 }catch(err){
    
    callback({
        success: false, 
        message: "unsucess",err
        });
 }
},
getdynamichomepage:async function (data,callback){
    try{
           const foundData = await detailschema.findOne({}).exec();
           if(foundData)
           {
            callback({
                success: true, 
                message: "sucess",
                foundData
            });
           }
           else{
            callback({
                success: false, 
                message: "no data found!! ",
            });
           }
    }
    catch(err){
        callback({
            success: false, 
            message: "unsucess",err
        });
    }
},
//-----------------------------Service Settings --------------------------------------
addservicesettings: async function (data,callback) {
    try{ 
        if(data._id && data._id!=""){
            console.log("22");  
            var result= await serviceSchemaSettings.updateOne({ _id:data._id},{...data}).exec();
            callback({
               success: true, 
               message: "Sucessfully Updated!!!", 
               result
             });
        }
        else{  
             console.log("===");
             if (data._id === "") {
                delete data._id;
             }              
            const serviceSchema = new serviceSchemaSettings({
                ...data,
            });
            serviceSchema.save((err, res) => {
                if (err) {
                    callback({
                        success: false, 
                        message: "some internal error has occurred", 
                        error: err
                    });
                }
                else {     
                        callback({
                        success: true, 
                        message: "Sucessfully done!!!!!", 
                        res
                    });
                }
            });
        // }  
    }}
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
getservicesettings: async function (data,callback) {
    try{
        var result= await serviceSchemaSettings.find().exec();
        callback({
                    success: true, 
                    message: "Sucessfully fetch!!!", 
                    result
                });
    }
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
activeinactiveservice: async function (data,callback) {
    try{
        var result= await serviceSchemaSettings.findOne({_id:data._id}).exec();
        if(result.is_active===data.is_active){
            callback({
                success: false, 
                message: "not possible!!", 
                result
            });
        }
        else{
            var result= await serviceSchemaSettings.updateOne({ _id:data._id},{is_active:data.is_active}).exec();
            callback({
                success: true, 
                message: "Sucessfully toggle!!!", 
                result
            });
        }
    }
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
deleteservice: async function (data,callback) {
    try{
        var result= await serviceSchemaSettings.deleteOne({_id:data._id}).exec();
        callback({
                    success: true, 
                    message: "Sucessfully deleted!!!", 
                    result
                });
    }
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
//-------------------------------User listing ----------------------------------------
// getuserlist: async function (data,callback) {

//     try{
//         var location;
//         var searchQuery;
//         var limit;
//         var page;

//         if(data.page && data.limit && data.searchQuery && data.location){
            
//             searchQuery=data.searchQuery;
//             location=data.location;
//             limit=Number(data.limit);
//             page=Number(data.page);
//         }
//         else if(data.page && data.limit && data.searchQuery){
                
//                 limit=Number(data.limit);
//                 page=Number(data.page);
//                 searchQuery=data.searchQuery;
//                 location="";  
//         }
//         else if(data.page && data.limit && data.location){
                
//                 limit=Number(data.limit);
//                 page=Number(data.page);
//                 location=data.location;  
//         }
//         else if(data.page && data.limit){
            
//             limit=Number(data.limit);
//             page=Number(data.page);
//             searchQuery="";
//             location="";
//         }
//         else if(data.searchQuery && data.location){
            
//             searchQuery=data.searchQuery;
//             location=data.location;
//         }
//         else if( data.searchQuery){
            
//             searchQuery=data.searchQuery;
//             location="";
//         }
//         else if( data.location){
            
//             var location=data.location;
//             searchQuery="";
//         }
//         else{
            
//             limit=2;
//             page=1;
//             searchQuery="";
//             location="";
//         };


//         const result= await userschema.aggregate([
//             {
//               $lookup: {
//                 from: "propertyposts",
//                 localField: "_id",
//                 foreignField: "userId",
//                 as: "add_offer",
//               },
//             },
//             {
//                 $lookup: {
//                   from: "applyforservices",
//                   localField: "_id",
//                   foreignField: "userId",
//                   as: "services_offer",
//                 },
//             },
//             { "$project": {
//                 "name":1,
//                 "user_type":1,
//                 "email":1,
//                 "mobilenumber":1,
//                 "avatar":1,
//                 "is_active":1,
//                 "services_offer": { "snapsort_offering":1},
//               //"services_offer": {"$size": "$services_offer"},          //for counting number of services
//                 "add_offer": {"$size": "$add_offer"}  
//               }},
             
//           ]).skip((page-1)*limit).limit(Number(limit));
//           var result1=await userschema.find();
//           var count=result1.length;
//           var prevPage,hasPrevPage,nextPage,hasNextPage;
//           var totallength=Math.ceil(count/limit);
//               if(totallength==1 && page==totallength ){
//                   prevPage=null;
//                   hasPrevPage=false;
//                   nextPage=null;
//                   hasNextPage=false;
                  
//               }
//               else if(page==1 && totallength>page) {
//                           prevPage=null;
//                           hasPrevPage=false;``
//                           nextPage=Number(page)+1; 
//                           hasNextPage=true;
                          
//               }
//               else if(page>1 && page==totallength){
//                       prevPage=Number(page)-1;
//                       hasPrevPage=true;
//                       nextPage=null;
//                       hasNextPage=false;
                      
//               }
//               else{
//                       prevPage=Number(page)-1;
//                       nextPage=Number(page)+1;
//                       hasPrevPage=true;
//                       hasNextPage=true;
                      
//               }
      
//                   const  Pagination ={
//                   "TotalDocuments":count,
//                   "limit":limit,
//                   "TotalPages":totallength,
//                   "Current Page":page,
//                   "PrevPage":prevPage,
//                   "NextPage":nextPage,
//                   "HasPrevPage":hasPrevPage,
//                   "HasNextPage":hasNextPage,
//                   "PagingCounter":page,        // consider index starting from 1,so pagingcounter will be same like index number //
//                   };
//         callback({
//                     success: true, 
//                     message: "Sucessfully fetch!!!", 
//                     result,
//                     Pagination
//                 });
//     }
//     catch(err){
//         callback({
//             success: false, 
//             message: "error!!!", 
//             err
//         });
//     }
// },
getuserlist: async function (data, callback) {
    try {
      var location;
      var searchQuery;
      var limit;
      var page;
  
      if (data.page && data.limit && data.searchQuery && data.location) {
        console.log(1);
        searchQuery = data.searchQuery;
        location = data.location;
        limit = Number(data.limit);
        page = Number(data.page);
      } else if (data.page && data.limit && data.searchQuery) {
        console.log(2);
        limit = Number(data.limit);
        page = Number(data.page);
        searchQuery = data.searchQuery;
        location = "";
      } else if (data.page && data.limit && data.location) {
        console.log(3);
        limit = Number(data.limit);
        page = Number(data.page);
        location = data.location;
      } else if (data.page && data.limit) {
        console.log(4);
        limit = Number(data.limit);
        page = Number(data.page);
        searchQuery = "";
        location = "";
      } else if (data.searchQuery && data.location) {
        console.log(5);
        searchQuery = data.searchQuery;
        location = data.location;
      } else if (data.searchQuery) {
        console.log(6);
        searchQuery = data.searchQuery;
        location = "";
      } else if (data.location) {
        console.log(7);
        location = data.location;
        searchQuery = "";
      } else {
        console.log(8);
        limit = 2;
        page = 1;
        searchQuery = "";
        location = "";
      }
  
      const searchPipeline = [];
      if (searchQuery) {
        searchPipeline.push({
          $match: {
            $or: [
              { name: { $regex: searchQuery, $options: "i" } },
              { email: { $regex: searchQuery, $options: "i" } },
              { "services_offer.select_your_offering": { $regex: searchQuery, $options: "i" } },
            ],
          },
        });
      }
  
      const result = await userschema
        .aggregate([
          ...searchPipeline,
          {
            $lookup: {
              from: "propertyposts",
              localField: "_id",
              foreignField: "userId",
              as: "add_offer",
            },
          },
          {
            $lookup: {
              from: "applyforservices",
              localField: "_id",
              foreignField: "userId",
              as: "services_offer",
            },
          },
          {
            $project: {
              name: 1,
              user_type: 1,
              email: 1,
              mobilenumber: 1,
              avatar: 1,
              is_active: 1,
              rera_number:1,
              services_offer: { snapsort_offering: 1 ,select_your_offering:1},
              add_offer: { $size: "$add_offer" },
            },
          },
      ]).skip((page - 1) * limit).limit(Number(limit));

        if(searchQuery){
            var result1=await userschema.aggregate([...searchPipeline])
        }
        else{
            var result1=await userschema.find();
        }

        var count=result1.length;
        var prevPage,hasPrevPage,nextPage,hasNextPage;
        var totallength=Math.ceil(count/limit);

      if (totallength == 1 && page == totallength) {
        prevPage = null;
        hasPrevPage = false;
        nextPage = null;
        hasNextPage = false;
      } else if (page == 1 && totallength > page) {
        prevPage = null;
        hasPrevPage = false;
        nextPage = Number(page) + 1;
        hasNextPage = true;
      } else if (page > 1 && page == totallength) {
        prevPage = Number(page) - 1;
        hasPrevPage = true;
        nextPage = null;
        hasNextPage = false;
      } else {
        prevPage = Number(page) - 1;
        nextPage = Number(page) + 1;
        hasPrevPage = true;
        hasNextPage = true;
      }
  
      const Pagination = {
        TotalDocuments: count,
        limit: limit,
        TotalPages: totallength,
        CurrentPage: page,
        PrevPage: prevPage,
        NextPage: nextPage,
        HasPrevPage: hasPrevPage,
        HasNextPage: hasNextPage,
        PagingCounter: page, // consider index starting from 1, so pagingcounter will be same like index number //
      };

      callback({
        success: true,
        message: "Successfully fetched!!!",
        result,
        Pagination,
      });
    } catch (err) {
        console.log(err);
        callback({
            success: false,
            message: "Error!!!",
            err,
        });
    }
},
blockuserlist: async function (data, callback) {
  try {              // not used ,this api have to rename //
    var location;
    var searchQuery;
    var limit;
    var page;

    if (data.page && data.limit && data.searchQuery && data.location) {
      console.log(1);
      searchQuery = data.searchQuery;
      location = data.location;
      limit = Number(data.limit);
      page = Number(data.page);
    } else if (data.page && data.limit && data.searchQuery) {
      console.log(2);
      limit = Number(data.limit);
      page = Number(data.page);
      searchQuery = data.searchQuery;
      location = "";
    } else if (data.page && data.limit && data.location) {
      console.log(3);
      limit = Number(data.limit);
      page = Number(data.page);
      location = data.location;
    } else if (data.page && data.limit) {
      console.log(4);
      limit = Number(data.limit);
      page = Number(data.page);
      searchQuery = "";
      location = "";
    } else if (data.searchQuery && data.location) {
      console.log(5);
      searchQuery = data.searchQuery;
      location = data.location;
    } else if (data.searchQuery) {
      console.log(6);
      searchQuery = data.searchQuery;
      location = "";
    } else if (data.location) {
      console.log(7);
      location = data.location;
      searchQuery = "";
    } else {
      console.log(8);
      limit = 2;
      page = 1;
      searchQuery = "";
      location = "";
    }

    const searchPipeline = [];
    if (searchQuery) {
      searchPipeline.push({
        $match: {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
            { "services_offer.select_your_offering": { $regex: searchQuery, $options: "i" } },
          ],
        },
      });
    }

    const result = await userschema
      .aggregate([
        ...searchPipeline,
        {
          $lookup: {
            from: "propertyposts",
            localField: "_id",
            foreignField: "userId",
            as: "add_offer",
          },
        },
        {
          $lookup: {
            from: "applyforservices",
            localField: "_id",
            foreignField: "userId",
            as: "services_offer",
          },
        },
        {
          $project: {
            name: 1,
            user_type: 1,
            email: 1,
            mobilenumber: 1,
            avatar: 1,
            is_active: 1,
            services_offer: { snapsort_offering: 1 ,select_your_offering:1},
            add_offer: { $size: "$add_offer" },
          },
        },
    ]).skip((page - 1) * limit).limit(Number(limit));

      if(searchQuery){
          var result1=await userschema.aggregate([...searchPipeline])
      }
      else{
          var result1=await userschema.find();
      }

      var count=result1.length;
      var prevPage,hasPrevPage,nextPage,hasNextPage;
      var totallength=Math.ceil(count/limit);

    if (totallength == 1 && page == totallength) {
      prevPage = null;
      hasPrevPage = false;
      nextPage = null;
      hasNextPage = false;
    } else if (page == 1 && totallength > page) {
      prevPage = null;
      hasPrevPage = false;
      nextPage = Number(page) + 1;
      hasNextPage = true;
    } else if (page > 1 && page == totallength) {
      prevPage = Number(page) - 1;
      hasPrevPage = true;
      nextPage = null;
      hasNextPage = false;
    } else {
      prevPage = Number(page) - 1;
      nextPage = Number(page) + 1;
      hasPrevPage = true;
      hasNextPage = true;
    }

    const Pagination = {
      TotalDocuments: count,
      limit: limit,
      TotalPages: totallength,
      CurrentPage: page,
      PrevPage: prevPage,
      NextPage: nextPage,
      HasPrevPage: hasPrevPage,
      HasNextPage: hasNextPage,
      PagingCounter: page, // consider index starting from 1, so pagingcounter will be same like index number //
    };

    callback({
      success: true,
      message: "Successfully fetched!!!",
      result,
      Pagination,
    });
  } catch (err) {
      console.log(err);
      callback({
          success: false,
          message: "Error!!!",
          err,
      });
  }
},
getuserbyid: async function (data,callback) {
    //{password:0,currentOtp:0,createdAt:0,updatedAt: 0,__v: 0}
    try{
        var user= await userschema.findOne({_id:data.id},{name:1,email:1,rera_number:1,mobilenumber:1,user_type:1,avatar:1,is_active:1,
          rera_certificate:1,
          rera_competency_certificate:1
        });
        var services= await applyForService.find({userId:data.id},{select_your_offering:1,snapsort_offering:1});
        
        var distinctServices = [];
        var existingOfferings = [];
        services.forEach((service) => {
            if (!existingOfferings.includes(service.select_your_offering)) {
              existingOfferings.push(service.select_your_offering);
              distinctServices.push(service);
            }
          });

          var joinedServices = await serviceSchemaSettings.aggregate([
            {
                $match: {
                    name: { $in: distinctServices.map(service => service.select_your_offering) }
                }
            },
            {
                $project: {
                    _id: 1,
                    serviceIcon: 1,
                    select_your_offering: {
                        $filter: {
                            input: distinctServices,
                            as: "service",
                            cond: { $eq: ["$$service.select_your_offering", "$name"] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    serviceIcon: 1,
                    select_your_offering: { $arrayElemAt: ["$select_your_offering.select_your_offering", 0] }
                }
            }
        ]);
        
        
        callback({
                    success: true, 
                    message: "Sucessfully fetch!!!", 
                    user,
                    joinedServices
                });
    }
    catch(err){
        
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
activeinactivebyuserid: async function (data,callback) {
    //{password:0,currentOtp:0,createdAt:0,updatedAt: 0,__v: 0}
    try{
        
        var user= await userschema.findOne({_id:data.id},{name:1,email:1,mobilenumber:1,user_type:1,avatar:1,is_active:1});
        var userstatus=user.is_active;
        
        if(userstatus==data.is_active){
            callback({
                success: false, 
                message: "not possible!!",
                userstatus 
            });
        }
        else{
            var result= await userschema.updateOne({_id:data.id},{is_active:data.is_active});
            callback({
                success: true, 
                message: "Sucessfully Change!!!",
                result 
            });
        }
        
    }
    catch(err){
        
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
//-------------------------------Pending Approval ------------------------------------
pendingproperty: async function (data, callback) {
    //
    try{
        var location;
        var searchQuery;
        var limit;
        var page;

        if(data.page && data.limit && data.searchQuery && data.location){
            
            searchQuery=data.searchQuery;
            location=data.location;
            limit=Number(data.limit);
            page=Number(data.page);
        }
        else if(data.page && data.limit && data.searchQuery){
                
                limit=Number(data.limit);
                page=Number(data.page);
                searchQuery=data.searchQuery;
                location="";  
        }
        else if(data.page && data.limit && data.location){
                
                limit=Number(data.limit);
                page=Number(data.page);
                location=data.location;  
        }
        else if(data.page && data.limit){
            
            limit=Number(data.limit);
            page=Number(data.page);
            searchQuery="";
            location="";
        }
        else if(data.searchQuery && data.location){
            
            searchQuery=data.searchQuery;
            location=data.location;
        }
        else if( data.searchQuery){
            
            searchQuery=data.searchQuery;
            location="";
        }
        else if( data.location){
            
            var location=data.location;
            searchQuery="";
        }
        else{
            
            limit=2;
            page=1;
            searchQuery="";
            location="";
        };  
       
        const result = await propertypostschema.aggregate([
            { '$match': { is_completed: true, admin_approval: "pending" } },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
              },
            }
          ]).skip((page - 1) * limit).limit(Number(limit)).exec();
        
          result.forEach((item) => {
            if (Array.isArray(item.user)) {
              item.user = item.user[0];
            }
          });
          
          
          
          
    var countdata=await propertypostschema.find({is_completed:true,admin_approval:"pending"}).exec();
    var count=countdata.length;
    var prevPage,hasPrevPage,nextPage,hasNextPage;
    var totallength=Math.ceil(count/limit);
        if(totallength==1 && page==totallength ){
            prevPage=null;
            hasPrevPage=false;
            nextPage=null;
            hasNextPage=false;
            
        }
        else if(page==1 && totallength>page) {
                    prevPage=null;
                    hasPrevPage=false;``
                    nextPage=Number(page)+1; 
                    hasNextPage=true;
                    
        }
        else if(page>1 && page==totallength){
                prevPage=Number(page)-1;
                hasPrevPage=true;
                nextPage=null;
                hasNextPage=false;
                
        }
        else{
                prevPage=Number(page)-1;
                nextPage=Number(page)+1;
                hasPrevPage=true;
                hasNextPage=true;
                
        }

            const  Pagination ={
            "TotalDocuments":count,
            "limit":limit,
            "TotalPages":totallength,
            "Current Page":page,
            "PrevPage":prevPage,
            "NextPage":nextPage,
            "HasPrevPage":hasPrevPage,
            "HasNextPage":hasNextPage,
            "PagingCounter":page,        // consider index starting from 1,so pagingcounter will be same like index number //
            };
        
        callback({
                    success: true, 
                    message: "property fetched Sucessfully!!",
                    pendingproperty:result,
                    Pagination
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
pendingservices: async function (data, callback) {
    try{
        var location;
        var searchQuery;
        var limit;
        var page;

        if(data.page && data.limit && data.searchQuery && data.location){
            
            searchQuery=data.searchQuery;
            location=data.location;
            limit=Number(data.limit);
            page=Number(data.page);
        }
        else if(data.page && data.limit && data.searchQuery){
                
                limit=Number(data.limit);
                page=Number(data.page);
                searchQuery=data.searchQuery;
                location="";  
        }
        else if(data.page && data.limit && data.location){
                
                limit=Number(data.limit);
                page=Number(data.page);
                location=data.location;  
        }
        else if(data.page && data.limit){
            
            limit=Number(data.limit);
            page=Number(data.page);
            searchQuery="";
            location="";
        }
        else if(data.searchQuery && data.location){
            
            searchQuery=data.searchQuery;
            location=data.location;
        }
        else if( data.searchQuery){
            
            searchQuery=data.searchQuery;
            location="";
        }
        else if( data.location){
            
            var location=data.location;
            searchQuery="";
        }
        else{
            
            limit=2;
            page=1;
            searchQuery="";
            location="";
        };  
    // const result =await applyForService.aggregate([{'$match':{admin_approval:"pending"}},
    // {
    //     $lookup: {
    //       from: "users",
    //       localField: "userId",
    //       foreignField: "_id",
    //       as: "user"
    //     },
    // }]).skip((page-1)*limit).limit(Number(limit)).exec();
    // if (result.length > 0 && Array.isArray(result[0].user)) {
    //     result[0].user = result[0].user[0];
    //   };
      const result = await applyForService.aggregate([
        { '$match': { admin_approval: "pending" } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          },
        },
        {
            $lookup: {
              from: "serviceschemasettings",
              localField: "select_your_offering",
              foreignField: "name",
              as: "serviceSettings"
            }
          }
      ]).skip((page - 1) * limit).limit(Number(limit)).exec();
      
      result.forEach((item) => {
        if (Array.isArray(item.user)) {
          item.user = item.user[0];
        }
      });
      
      
    var countdata=await applyForService.find({admin_approval:"pending"}).exec();
    var count=countdata.length;
    var prevPage,hasPrevPage,nextPage,hasNextPage;
    var totallength=Math.ceil(count/limit);
        if(totallength==1 && page==totallength ){
            prevPage=null;
            hasPrevPage=false;
            nextPage=null;
            hasNextPage=false;
            
        }
        else if(page==1 && totallength>page) {
                    prevPage=null;
                    hasPrevPage=false;``
                    nextPage=Number(page)+1; 
                    hasNextPage=true;
                    
        }
        else if(page>1 && page==totallength){
                prevPage=Number(page)-1;
                hasPrevPage=true;
                nextPage=null;
                hasNextPage=false;
                
        }
        else{
                prevPage=Number(page)-1;
                nextPage=Number(page)+1;
                hasPrevPage=true;
                hasNextPage=true;
                
        }

            const  Pagination ={
            "TotalDocuments":count,
            "limit":limit,
            "TotalPages":totallength,
            "Current Page":page,
            "PrevPage":prevPage,
            "NextPage":nextPage,
            "HasPrevPage":hasPrevPage,
            "HasNextPage":hasNextPage,
            "PagingCounter":page,        // consider index starting from 1,so pagingcounter will be same like index number //
            };

        
     
        callback({
                    success: true, 
                    message: "services fetched Sucessfully!!",
                    pendingservices:result,
                    Pagination
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
//--------------------------Status change for property and services  -----------------
statuschangepostproperty: async function (data,callback) {
    try{
        var result= await propertypostschema.findOne({_id:data._id}).exec();
        var userdata= await userschema.findOne({_id:result.userId},{email:1}).exec();
        if(result.admin_approval===data.admin_approval){
            callback({
                success: false, 
                message: "not possible!!", 
                result
            });
        }
        else if(data.admin_approval==="rejected"){
            var result= await propertypostschema.updateOne({ _id:data._id},{is_active:true,admin_approval:data.admin_approval}).exec();
            const notification =  new notificationSchema({
                touser:userdata.email,
                notificationtype:"reject post property",
                notification:{ 
                    notification_subject: notificationmessage.postrejectsubject,
                    notification_body: notificationmessage.postrejectbody
                },
                notificationinfo:{ 
                    postproperty_id: data._id,
                },
        });
        notification.save((err, res) => {
                if (err) {
                    callback({
                        success: false, 
                        message: "notificaton error", 
                        err: err
                    });
                }
                else{
                    callback({
                        success: true, 
                        message: "Sucessfully status change!!!", 
                        result
                    });
                }});

           
        }
        else{
            var result= await propertypostschema.updateOne({ _id:data._id},{is_active:true,admin_approval:data.admin_approval}).exec();
            const notification =  new notificationSchema({
                    touser:userdata.email,
                    notificationtype:"Approved post property",
                    notification:{ 
                        notification_subject: notificationmessage.addlivesubject,
                        notification_body: notificationmessage.addlivebody
                    },
                    notificationinfo:{ 
                        postproperty_id: data._id,
                    },
            });
            notification.save((err, res) => {
                    if (err) {
                        callback({
                            success: false, 
                            message: "notificaton error", 
                            err: err
                        });
                    }
                    else{
                        callback({
                            success: true, 
                            message: "Sucessfully status change!!!", 
                            result
                        });
                    }});
        }
    }
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
statuschangeservices: async function (data,callback) {
    try{
        var result= await applyForService.findOne({_id:data._id}).exec();
        var userdata= await userschema.findOne({_id:result.userId},{email:1}).exec();
        console.log(userdata);

        if(result.admin_approval===data.admin_approval){
            callback({
                success: false, 
                message: "not possible!!", 
                result
            });
        }
        else if(data.admin_approval==="rejected"){
          console.log(data);
            const notification =  new notificationSchema({
                touser:userdata.email,
                notificationtype:"reject services",
                notification:{ 
                    notification_subject: notificationmessage.servicerejectsubject,
                    notification_body: notificationmessage.servicerejectbody
                },
                notificationinfo:{ 
                    services_id: data._id,
                },
        });
        notification.save((err, res) => {
                if (err) {
                    callback({
                        success: false, 
                        message: "notificaton error", 
                        err: err
                    });
                }
                else{
                    callback({
                        success: false, 
                        message: "Rejected!!",
                        result
                    })
                }});

        }
        else{
            var result= await applyForService.updateOne({ _id:data._id},{is_active:true,admin_approval:data.admin_approval}).exec();
            const notification =  new notificationSchema({
                touser:userdata.email,
                notificationtype:"Approved service",
                notification:{ 
                    notification_subject: notificationmessage.approveservicesubject,
                    notification_body: notificationmessage.approveservicebody
                },
                notificationinfo:{ 
                    services_id: data._id,
                },
            });
            notification.save((err, res) => {
                if (err) {
                    callback({
                        success: false, 
                        message: "notificaton error", 
                        err: err
                    });
                }
                else{
                    callback({
                        success: true, 
                        message: "Sucessfully status change!!!", 
                        result,
                    });
                }});
           
        }
    }
    catch(err){
        
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
//------------------------------- Report -----------------
reportlisting: async function (data,callback) {
    try{
        var prevPage;                                        
            var nextPage;
            var hasPrevPage;
            var hasNextPage;
            var searchQuery;
            var typeOfBusiness;
            var location;
                if(data.page && data.limit && data.searchQuery  && data.typeOfBusiness  && data.location){
                    
                    var limit=Number(data.limit);
                    var page=Number(data.page);
                    searchQuery=data.searchQuery;  
                    typeOfBusiness=data.typeOfBusiness,
                    location=data.location 
                }
                else if(data.page && data.limit && data.searchQuery && data.typeOfBusiness){
                    
                    var limit=Number(data.limit);
                    var page=Number(data.page);
                    searchQuery=data.searchQuery;
                    typeOfBusiness=data.typeOfBusiness;
                    location=""; 
                }
                else if(data.page && data.limit && data.searchQuery){
                    
                        var limit=Number(data.limit);
                        var page=Number(data.page);
                        searchQuery=data.searchQuery;
                        location="";  
                        typeOfBusiness="";
                }
                else if(data.page && data.limit){
                    
                    var limit=Number(data.limit);
                    var page=Number(data.page);
                    searchQuery="";
                    typeOfBusiness="";
                    location="";
                }
                else{
                    
                    var limit=2;
                    var page=1;
                };
         //  var results= await reportSchema.find({adminAction:"pending"}).exec();
         var result = await reportSchema.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "reportedUser"
              },
            },
            {
                $unwind: "$reportedUser",
             },
            {
              $lookup: {
                from: "users",
                localField: "personId",
                foreignField: "_id",
                as: "againstId"
              }
            },
            {
                $unwind: "$againstId",
            },
            
          ]).skip((page-1)*limit).limit(Number(limit));
                var result1=await reportSchema.find();
                var count=result1.length;
                var totallength=Math.ceil(count/limit);
                if(totallength==1 && page==totallength ){
                    prevPage=null;
                    hasPrevPage=false;
                    nextPage=null;
                    hasNextPage=false;
                    
                 }
                else if(page==1 && totallength>page) {
                            prevPage=null;
                            hasPrevPage=false;``
                            nextPage=Number(page)+1; 
                            hasNextPage=true;
                            
                }
                else if(page>1 && page==totallength){
                        prevPage=Number(page)-1;
                        hasPrevPage=true;
                        nextPage=null;
                        hasNextPage=false;
                        
                }
                else{
                        prevPage=Number(page)-1;
                        nextPage=Number(page)+1;
                        hasPrevPage=true;
                        hasNextPage=true;
                        
                }
   
         const  Pagination ={
           "TotalDocuments":count,
           "limit":limit,
           "TotalPages":totallength,
           "Current Page":page,
           "PrevPage":prevPage,
           "NextPage":nextPage,
           "HasPrevPage":hasPrevPage,
           "HasNextPage":hasNextPage,
           "PagingCounter":page,        // consider index starting from 1,so pagingcounter will be same like index number //
          
          }
          
            callback({
                success: true, 
                message: "Sucessfully report fetch!!!", 
                result,
                Pagination
            });
    }
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
// statuschangereport: async function (data,callback) {
//     try{
//         var result= await reportSchema.findOne({_id:data._id}).exec();
//         if(result.adminAction===data.adminAction){
//             callback({
//                 success: false, 
//                 message: "not possible!!", 
//                 result
//             });
//         }
//         else{
//             var result= await reportSchema.updateOne({_id:data._id},{...data}).exec();
//             callback({
//                 success: true, 
//                 message: "Sucessfully status change!!!", 
//                 result
//             });
//         }
//     }
//     catch(err){
        
//         callback({
//             success: false, 
//             message: "error!!!", 
//             err
//         });
//     }
// },
blockuser:async function (data, callback){
  try{
    var user= await userschema.findOne({_id:data.id},{name:1,email:1,mobilenumber:1,user_type:1,avatar:1,
                                                      is_active:1,block_by_admin:1});
    
    if(user.is_active===data.is_active){
        callback({
            success: false, 
            message: "not possible!!",
            userstatus
        });
    }
    else{
        
        var userupdate= await userschema.updateOne({_id:data.personId},{is_active:data.is_active,block_by_admin:data.block_by_admin});
        var reportupdate= await reportSchema.updateOne({_id:data.report_id},{adminAction:data.adminAction,adminComment:data.adminComment}).exec();
        callback({
            success: true, 
            message: "Sucessfully Blocked that person and Report closed!!!",
            userupdate,
            reportupdate
        });
    }
  }
  catch(err){
    console.log(err);
    callback({
      success: false, 
      message: "error!!!", 
      err
  });
  }
},
//------------------------------- Profile -----------------
getprofile: async function (data,callback) {
    //{password:0,currentOtp:0,createdAt:0,updatedAt: 0,__v: 0}
    try{
        
        var result= await userschema.findOne({_id:data.userId},{name:1,password:1,email:1,mobilenumber:1,user_type:1,avatar:1});
        callback({
                    success: true, 
                    message: "Sucessfully fetch!!!", 
                    result
                });
    }
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
updateprofile: async function (data,callback) {
    //{password:0,currentOtp:0,createdAt:0,updatedAt: 0,__v: 0}
    try{
       
        var result= await userschema.updateOne({_id:data.userId},{...data});
        callback({
                    success: true, 
                    message: "Sucessfully updated!!!", 
                    result
                });
    }
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},

verifyproperty: async function (data,callback) {
    //{password:0,currentOtp:0,createdAt:0,updatedAt: 0,__v: 0}
    try{
        
        var result= await propertypostschema.updateOne({_id:data.id},{is_verified:data.is_verified});
        callback({
                    success: true, 
                    message: "Sucessfully verified!!!", 
                    result
                });
    }
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},
feature: async function (data,callback) {
    //{password:0,currentOtp:0,createdAt:0,updatedAt: 0,__v: 0}
    try{
        
        var result= await propertypostschema.updateOne({_id:data.id},{is_feacher:data.is_feacher,feacher_validity:data.feacher_validity});
        callback({
                    success: true, 
                    message: "Sucessfully feachered!!!", 
                    result
                });
    }
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},

dashboard: async function (data,callback) {
   
        try {
          const [totalUsers, personalUsers, businessUsers] = await Promise.all([
            userschema.countDocuments(),
            userschema.countDocuments({ user_type: 'individual' }),
            userschema.countDocuments({ user_type: 'business' }),
          ]);

          const [totalProperties, personalProperties, businessProperties] = await Promise.all([
            propertypostschema.countDocuments(),
            propertypostschema.countDocuments().populate({ path: 'userId', match: { user_type: 'individual' } }).countDocuments(),
            propertypostschema.countDocuments().populate({ path: 'userId', match: { user_type: 'business' } }).countDocuments(),
          ]);
      
          const [totalServices, personalServices, businessServices] = await Promise.all([
            applyForService.countDocuments(),
            applyForService.countDocuments({ userId: { $in: await userschema.find({ user_type: 'individual' }, '_id') } }),
            applyForService.countDocuments({ userId: { $in: await userschema.find({ user_type: 'business' }, '_id') } }),
          ]);
      
          const serviceCounts = await applyForService.aggregate([
            {
              $group: {
                _id: "$select_your_offering",
                count: { $sum: 1 }
              }
            },
            {
                $lookup: {
                  from: "serviceschemasettings",
                  localField: "_id",
                  foreignField: "name",
                  as: "serviceSettings"
                }
              }
          ]);
          const feactureproperty = await Promise.all([
            propertypostschema.countDocuments( { userId: { $in: await userschema.find({ user_type: 'individual' }, '_id') },is_feacher:true}),
            propertypostschema.countDocuments( { userId: { $in: await userschema.find({ user_type: 'business' }, '_id') },is_feacher:true}),
        ]);

        

       ////==========================Graph Section================================////

       ////==================User Section======================////

        var useryear = Number(data.useryear); // The given year

        // Create an aggregation pipeline
        var pipeline = [
          // Match documents with the specified year
          {
            $match: {
              createdAt: {
                $gte: new Date(useryear, 0, 1), // Start of the year
                $lt: new Date(useryear + 1, 0, 1) // Start of the next year
              }
            }
          },
          // Project the month field and user_type
          {
            $project: {
              month: { $month: "$createdAt" },
              user_type: 1
            }
          },
          // Group by month and user_type, and count the number of users in each month and user_type
          {
            $group: {
              _id: { month: "$month", user_type: "$user_type" },
              count: { $sum: 1 }
            }
          },
          // Group by month and include the counts for each user_type as separate fields
          {
            $group: {
              _id: "$_id.month",
              count: { $sum: "$count" },
              individual: {
                $sum: { $cond: [{ $eq: ["$_id.user_type", "individual"] }, "$count", 0] }
              },
              business: {
                $sum: { $cond: [{ $eq: ["$_id.user_type", "business"] }, "$count", 0] }
              }
            }
          },
          // Add a new field to map month number to month name
          {
            $addFields: {
              monthName: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id", 1] }, then: "January" },
                    { case: { $eq: ["$_id", 2] }, then: "February" },
                    { case: { $eq: ["$_id", 3] }, then: "March" },
                    { case: { $eq: ["$_id", 4] }, then: "April" },
                    { case: { $eq: ["$_id", 5] }, then: "May" },
                    { case: { $eq: ["$_id", 6] }, then: "June" },
                    { case: { $eq: ["$_id", 7] }, then: "July" },
                    { case: { $eq: ["$_id", 8] }, then: "August" },
                    { case: { $eq: ["$_id", 9] }, then: "September" },
                    { case: { $eq: ["$_id", 10] }, then: "October" },
                    { case: { $eq: ["$_id", 11] }, then: "November" },
                    { case: { $eq: ["$_id", 12] }, then: "December" }
                  ],
                  default: "Unknown"
                }
              }
            }
          },
          // Sort the result by month in ascending order
          {
            $sort: {
              "_id": 1
            }
          }
        ];
        // Run the aggregation pipeline
        const usergraphresult = await userschema.aggregate(pipeline).exec();


        ////==========================Property Graph Section=============================////
        var propertyyear = data.propertyyear; // The given year

        // Create an aggregation pipeline
        var pipeline = [
          // Match documents with the specified year
          {
            $match: {
              createdAt: {
                $gte: new Date(propertyyear, 0, 1), // Start of the year
                $lt: new Date(propertyyear + 1, 0, 1) // Start of the next year
              }
            }
          },
          // Project the month and userId fields
          {
            $project: {
              month: { $month: "$createdAt" },
              userId: 1
            }
          },
          // Lookup the user_type from userschema based on the userId
          {
            $lookup: {
              from: "users", // Replace with the actual collection name for userschema
              localField: "userId",
              foreignField: "_id",
              as: "user"
            }
          },
          // Unwind the user array
          { $unwind: "$user" },
          // Project the month, user_type, and is_completed fields
          {
            $project: {
              month: 1,
              user_type: "$user.user_type",
              is_completed: 1
            }
          },
          // Group by month and user_type, and count the number of properties in each month and user_type
          {
            $group: {
              _id: { month: "$month", user_type: "$user_type" },
              count: { $sum: 1 }
            }
          },
          // Group by month and include the counts for each user_type as separate fields
          {
            $group: {
              _id: "$_id.month",
              count: { $sum: "$count" },
              individual: {
                $sum: { $cond: [{ $eq: ["$_id.user_type", "individual"] }, "$count", 0] }
              },
              business: {
                $sum: { $cond: [{ $eq: ["$_id.user_type", "business"] }, "$count", 0] }
              }
            }
          },
          // Add a new field to map month number to month name
          {
            $addFields: {
              monthName: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id", 1] }, then: "January" },
                    { case: { $eq: ["$_id", 2] }, then: "February" },
                    { case: { $eq: ["$_id", 3] }, then: "March" },
                    { case: { $eq: ["$_id", 4] }, then: "April" },
                    { case: { $eq: ["$_id", 5] }, then: "May" },
                    { case: { $eq: ["$_id", 6] }, then: "June" },
                    { case: { $eq: ["$_id", 7] }, then: "July" },
                    { case: { $eq: ["$_id", 8] }, then: "August" },
                    { case: { $eq: ["$_id", 9] }, then: "September" },
                    { case: { $eq: ["$_id", 10] }, then: "October" },
                    { case: { $eq: ["$_id", 11] }, then: "November" },
                    { case: { $eq: ["$_id", 12] }, then: "December" }
                  ],
                  default: "Unknown"
                }
              }
            }
          },
          // Sort the result by month in ascending order
          {
            $sort: {
              "_id": 1
            }
          }
        ];
        
        // Run the aggregation pipeline
        const propertygraphresult = await propertypostschema.aggregate(pipeline).exec();
  

        ////==========================Service Graph Section=============================////

        var serviceyear = data.serviceyear; // The given year

// Create an aggregation pipeline
var pipeline = [
  // Match documents with the specified year
  {
    $match: {
      createdAt: {
        $gte: new Date(serviceyear, 0, 1), // Start of the year
        $lt: new Date(serviceyear + 1, 0, 1) // Start of the next year
      }
    }
  },
  // Project the month and userId fields
  {
    $project: {
      month: { $month: "$createdAt" },
      userId: 1
    }
  },
  // Lookup the user_type from userschema based on the userId
  {
    $lookup: {
      from: "users", // Replace with the actual collection name for userschema
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  // Unwind the user array
  { $unwind: "$user" },
  // Project the month, user_type, and is_active fields
  {
    $project: {
      month: 1,
      user_type: "$user.user_type",
      is_active: 1
    }
  },
  // Group by month and user_type, and count the number of services in each month and user_type
  {
    $group: {
      _id: { month: "$month", user_type: "$user_type" },
      count: { $sum: 1 }
    }
  },
  // Group by month and include the counts for each user_type as separate fields
  {
    $group: {
      _id: "$_id.month",
      count: { $sum: "$count" },
      individual: {
        $sum: { $cond: [{ $eq: ["$_id.user_type", "individual"] }, "$count", 0] }
      },
      business: {
        $sum: { $cond: [{ $eq: ["$_id.user_type", "business"] }, "$count", 0] }
      }
    }
  },
  // Add a new field to map month number to month name
  {
    $addFields: {
      monthName: {
        $switch: {
          branches: [
            { case: { $eq: ["$_id", 1] }, then: "January" },
            { case: { $eq: ["$_id", 2] }, then: "February" },
            { case: { $eq: ["$_id", 3] }, then: "March" },
            { case: { $eq: ["$_id", 4] }, then: "April" },
            { case: { $eq: ["$_id", 5] }, then: "May" },
            { case: { $eq: ["$_id", 6] }, then: "June" },
            { case: { $eq: ["$_id", 7] }, then: "July" },
            { case: { $eq: ["$_id", 8] }, then: "August" },
            { case: { $eq: ["$_id", 9] }, then: "September" },
            { case: { $eq: ["$_id", 10] }, then: "October" },
            { case: { $eq: ["$_id", 11] }, then: "November" },
            { case: { $eq: ["$_id", 12] }, then: "December" }
          ],
          default: "Unknown"
        }
      }
    }
  },
  // Sort the result by month in ascending order
  {
    $sort: {
      "_id": 1
    }
  }
];

// Run the aggregation pipeline
const servicegraphresult = await applyForService.aggregate(pipeline).exec();


const usertotalcount = Array(12).fill(0);
const user_individual_array = Array(12).fill(0);
const user_business_array = Array(12).fill(0);

// Iterate over the usergraphresult data and update the arrays
usergraphresult.forEach(entry => {
  const usermonthIndex = entry["_id"] - 1;
  usertotalcount[usermonthIndex] = entry["count"];
  user_individual_array[usermonthIndex] = entry["individual"];
  user_business_array[usermonthIndex] = entry["business"];
});


const servicetotalcount = Array(12).fill(0);
const service_individual_array = Array(12).fill(0);
const service_business_array = Array(12).fill(0);

// Iterate over the servicegraphresult data and update the arrays
servicegraphresult.forEach(entry => {
  const servicemonthIndex = entry["_id"] - 1;
  servicetotalcount[servicemonthIndex] = entry["count"];
  service_individual_array[servicemonthIndex] = entry["individual"];
  service_business_array[servicemonthIndex] = entry["business"];
});



const propertytotalcount = Array(12).fill(0);
const property_individual_array = Array(12).fill(0);
const property_business_array = Array(12).fill(0);

// Iterate over the servicegraphresult data and update the arrays
propertygraphresult.forEach(entry => {
  const propertymonthIndex = entry["_id"] - 1;
  propertytotalcount[propertymonthIndex] = entry["count"];
  property_individual_array[propertymonthIndex] = entry["individual"];
  property_business_array[propertymonthIndex] = entry["business"];
});


// Get distinct years from userschema
var userSchemaYears = await userschema.distinct("createdAt", { createdAt: { $exists: true } })
  .then(dates => dates.map(date => date.getFullYear()));

// Get distinct years from propertypostschema
var propertyPostSchemaYears = await propertypostschema.distinct("createdAt", { createdAt: { $exists: true } })
  .then(dates => dates.map(date => date.getFullYear()));

// Get distinct years from applyForServices schema
var applyForServicesYears = await applyForService.distinct("createdAt", { createdAt: { $exists: true } })
  .then(dates => dates.map(date => date.getFullYear()));

  // Remove repeated years from userSchemaYears array
 userSchemaYears = [...new Set(userSchemaYears)];

// Remove repeated years from propertyPostSchemaYears array
 propertyPostSchemaYears = [...new Set(propertyPostSchemaYears)];

// Remove repeated years from applyForServicesYears array
 applyForServicesYears = [...new Set(applyForServicesYears)];


 const calender=[{"userSchemaYears":userSchemaYears,
                "propertyPostSchemaYears":propertyPostSchemaYears,
                "applyForServicesYears":applyForServicesYears}]

// Combine the distinct years from all schemas


        callback({
            servicetotalcount,
            service_individual_array,
            service_business_array,
            propertytotalcount,
            property_individual_array,
            property_business_array,
            usertotalcount,
            user_business_array,
            user_individual_array,
            calender,
            totalUsers,
            personalUsers,
            businessUsers,
            totalProperties,
            personalProperties,
            businessProperties,
            totalServices,
            personalServices,
            businessServices,
            serviceCounts,
            feactureproperty
          });
        } 
     
    catch(err){
        
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
    }
},

contact: async function (data,callback) {
   
    try {
            var location;
            var searchQuery;
            var limit;
            var page;
    
            if(data.page && data.limit && data.searchQuery && data.location){
                
                searchQuery=data.searchQuery;
                location=data.location;
                limit=Number(data.limit);
                page=Number(data.page);
            }
            else if(data.page && data.limit && data.searchQuery){
                
                    limit=Number(data.limit);
                    page=Number(data.page);
                    searchQuery=data.searchQuery;
                    location="";  
            }
            else if(data.page && data.limit && data.location){
                
                    limit=Number(data.limit);
                    page=Number(data.page);
                    location=data.location;  
            }
            else if(data.page && data.limit){
                
                limit=Number(data.limit);
                page=Number(data.page);
                searchQuery="";
                location="";
            }
            else if(data.searchQuery && data.location){
                
                searchQuery=data.searchQuery;
                location=data.location;
            }
            else if( data.searchQuery){
                
                searchQuery=data.searchQuery;
                location="";
            }
            else if( data.location){
                
                var location=data.location;
                searchQuery="";
            }
            else{
                
                limit=2;
                page=1;
                searchQuery="";
                location="";
            };  
        var result= await contactSchema.find().skip((page-1)*limit).limit(Number(limit)).exec();;
        var countdata=await contactSchema.find().exec();
        var count=countdata.length;
      var prevPage,hasPrevPage,nextPage,hasNextPage;
        var totallength=Math.ceil(count/limit);
            if(totallength==1 && page==totallength ){
                prevPage=null;
                hasPrevPage=false;
                nextPage=null;
                hasNextPage=false;
                
            }
            else if(page==1 && totallength>page) {
                        prevPage=null;
                        hasPrevPage=false;``
                        nextPage=Number(page)+1; 
                        hasNextPage=true;
                        
            }
            else if(page>1 && page==totallength){
                    prevPage=Number(page)-1;
                    hasPrevPage=true;
                    nextPage=null;
                    hasNextPage=false;
                    
            }
            else{
                    prevPage=Number(page)-1;
                    nextPage=Number(page)+1;
                    hasPrevPage=true;
                    hasNextPage=true;
                    
            }
    
                const  Pagination ={
                "TotalDocuments":count,
                "limit":limit,
                "TotalPages":totallength,
                "Current Page":page,
                "PrevPage":prevPage,
                "NextPage":nextPage,
                "HasPrevPage":hasPrevPage,
                "HasNextPage":hasNextPage,
                "PagingCounter":page,        // consider index starting from 1,so pagingcounter will be same like index number //
                };
        callback({
            success: true, 
            message: "sucess!!!", 
            result,
            Pagination
        });
    } 
 
    catch(err){
        callback({
            success: false, 
            message: "error!!!", 
            err
        });
}
},

}

module.exports = adminServiceController;