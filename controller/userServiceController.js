const reportSchema = require('../schema/reportSchema');
const propertypostschema = require('../schema/propertypostschema');
const applyForServiceSchema = require('../schema/applyForServiceSchema');
const serviceSchemaSettings = require('../schema/serviceSchemaSettings');
const messageSchema = require('../schema/messageSchema');
const userStatus = require('../schema/userStatus');
const multer = require('multer');;
var { messages } = require('../helper/constant-messages');
const userschema = require('../schema/userschema');
//const applyForService = require('../schema/applyForServiceSchema');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
const config = require("../config/config.json");
const bcryptjs = require("bcrypt");
const { log } = require('async');
const notificationSchema = require('../schema/notificationSchema');
const { notificationmessage } = require('../helper/notification-message');
const mongoose = require('mongoose');
const contactSchema = require('../schema/contactSchema');
const propertyschema = require('../schema/propertyschema');
const socketConnection = require("../config/socketConnection");
const deleteExpiredStatuses = require('../helper/deleteExpiredStatuses');
const unirest = require("unirest");




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/postproperty/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
const upload = multer({ storage: 'storage' });
const saltRounds = 10;

var userService = {

    //-------------------------------User mobile verify----------------------------------------
    phonenumberchecking: async function (data, callback) {
        try {
            var result = await userschema.findOne({ _id: data.userId }).exec();


            if (result === null) {
                callback({
                    success: false,
                    message: "User does not exist!",
                    result
                });
            } else {
                if (result.email && result.mobilenumber) {
                    callback({
                        success: true,
                        message: "User verified!",
                        result
                    });
                } else {
                    callback({
                        success: false,
                        message: "User not verified. Please verify first!",
                        result
                    });
                }
            }
        } catch (error) {
            callback({
                success: false,
                message: "Error occurred while finding user.",
                error
            });
        }

    },

    //-------------------------------Service Services----------------------------------------
    applyforservices: async function (data, callback) {
        try {
            if (data._id) {

                // for(let i=0;i<data.documents_details.length;i++){
                //     let imageName = "applyforservice"+Date.now()+".jpeg";
                //     let imageNamePath = path.join(__dirname,"../upload/applyforservice",imageName);
                //     let buffer = Buffer.from(data.documents_details[i].documents,"base64");
                //     fs.writeFileSync(imageNamePath,buffer,'base64',function(err){
                //         
                //       });
                //     data.documents_details[i].documents=imageName ;   
                //     
                // }; 
                // for(let j=0;j<data.snapsort_offering.length;j++){
                //     let imageName1 = "snapsortoffering"+Date.now()+".jpeg";
                //     let imageNamePath1 = path.join(__dirname,"../upload/applyforservice",imageName1);
                //     let buffer1 = Buffer.from(data.snapsort_offering[j],"base64");
                //     fs.writeFileSync(imageNamePath1, buffer1,'base64', function(err) {
                //         
                //       });

                //     data.snapsort_offering[j]=imageName1;
                //     
                // }; 


                var result = await applyForServiceSchema.updateOne({ _id: data._id, userId: data.userId }, { ...data, admin_approval: "pending" }).exec();
                callback({
                    success: true,
                    message: "Sucessfully Updated!!!",
                    result
                });
            }
            else {
                if (data._id == '') {

                    delete data._id
                };
                const applyForService = new applyForServiceSchema({
                    ...data,
                });
                applyForService.save((err, res) => {
                    if (err) {
                        callback({
                            success: false,
                            message: "some internal error has occurred",
                            error: err
                        });
                    }
                    else {
                        const notification = new notificationSchema({
                            touser: data.email,
                            notificationtype: "Apply for Services",
                            notification: {
                                notification_subject: notificationmessage.serviceprovidersubject,
                                notification_body: notificationmessage.serviceproviderbody
                            },
                            notificationinfo: {
                                services_id: res._id,
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
                        });

                        callback({
                            success: true,
                            message: "Sucessfully applied!",
                            res: res._id,
                        });



                    }
                });
            }

        }
        catch (error) {

            callback({
                success: false,
                message: "error!!!!!",
                error
            });
        }
    },
    getapplyforservices: async function (data, callback) {
        try {
            var result = await serviceSchemaSettings.find({ is_active: true }, {
                name: 1, serviceIcon: 1, documents_details: 1, is_active: 1,
                is_documents_needed: 1, admin_approval: 1
            }).exec();
            callback({
                success: true,
                message: "sucessfully fetch!!!!!",
                result
            });
        }
        catch (error) {

            callback({
                success: false,
                message: "error!!!!!",
                error
            });
        }
    },
    getservicesbyserviceid: async function (data, callback) {
        try {
            var result = await applyForServiceSchema.find({ _id: data.id }).exec();
            callback({
                success: true,
                message: "sucessfully fetch!!!!!",
                result
            });
        }
        catch (error) {

            callback({
                success: false,
                message: "error!!!!!",
                error
            });
        }
    },
    serviceslisting: async function (data, callback) {
        try {
            var location;
            var searchQuery;
            var limit;
            var page;
            console.log(data);
            if (data.page && data.limit && data.searchQuery && data.location) {
                console.log(1);
                var limit = Number(data.limit);
                var page = Number(data.page);
                searchQuery = data.searchQuery;
                location = data.location
            }
            else if (data.page && data.limit && data.searchQuery) {
                console.log(2);
                limit = Number(data.limit);
                page = Number(data.page);
                searchQuery = data.searchQuery;
                location = "";
            }
            else if (data.page && data.limit && data.location) {
                console.log(3);
                limit = Number(data.limit);
                page = Number(data.page);
                location = data.location;
            }
            else if (data.page && data.limit) {
                console.log(4);
                limit = Number(data.limit);
                page = Number(data.page);
                searchQuery = "";
                location = "";
            }
            else if (data.searchQuery && data.location) {
                console.log(5);
                searchQuery = data.searchQuery;
                location = data.location;
            }
            else if (data.searchQuery) {
                console.log(6);
                searchQuery = data.searchQuery;
                location = "";
            }
            else if (data.location) {
                console.log(7);
                var location = data.location;
                searchQuery = "";
            }
            else {
                console.log("else");
                limit = 2;
                page = 1;
                searchQuery = "";
                location = "";
            };

            var dataQuery = [];
            var locationRegex = new RegExp(location, 'i');
            var searchQueryRegex = new RegExp(searchQuery, 'i');
            dataQuery.push({
                '$match': {
                    '$and': [
                        { 'add_offering_location': { $regex: locationRegex } },
                        { 'select_your_offering': { $regex: searchQueryRegex } },
                        { 'admin_approval': 'approved' },
                        { 'is_active': true }
                    ]
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            });

            var result = await applyForServiceSchema.aggregate(dataQuery).skip((page - 1) * limit).limit(Number(limit)).exec();

            // Remove the user array if it exists
            result.forEach((item) => {
                if (Array.isArray(item.user)) {
                    item.user = item.user[0];
                }
            });

            result.forEach((obj) => {
                if (obj.sortlist.some((item) => String(item) === String(data.userId))) {
                    obj.sortliststatus = true;
                }
            });

            const updatedResult = result.map(item => {
                if (item.service_view && item.service_view.viewers) {
                    var viewed = item.service_view.viewers.map(String).includes(data.userId);
                    return { ...item, viewed };
                }
                return { ...item, viewed: false };
            });

            result = updatedResult;


            var countdata = await applyForServiceSchema.aggregate(dataQuery).exec();
            var count = countdata.length;

            var totallength = Math.ceil(count / limit);
            if (totallength == 1 && page == totallength) {
                prevPage = null;
                hasPrevPage = false;
                nextPage = null;
                hasNextPage = false;

            }
            else if (page == 1 && totallength > page) {
                prevPage = null;
                hasPrevPage = false; ``
                nextPage = Number(page) + 1;
                hasNextPage = true;

            }
            else if (page > 1 && page == totallength) {
                prevPage = Number(page) - 1;
                hasPrevPage = true;
                nextPage = null;
                hasNextPage = false;

            }
            else {
                prevPage = Number(page) - 1;
                nextPage = Number(page) + 1;
                hasPrevPage = true;
                hasNextPage = true;

            }

            const Pagination = {
                "TotalDocuments": count,
                "limit": limit,
                "TotalPages": totallength,
                "Current Page": page,
                "PrevPage": prevPage,
                "NextPage": nextPage,
                "HasPrevPage": hasPrevPage,
                "HasNextPage": hasNextPage,
                "PagingCounter": page,        // consider index starting from 1,so pagingcounter will be same like index number //
            };

            callback({
                success: true,
                message: "sucessfully fetch!!!!!",
                result,
                Pagination
            });
        }
        catch (error) {
            console.log(error);
            callback({
                success: false,
                message: "error!!!!!",
                error
            });
        }
    },
    serviceslistingsettings: async function (data, callback) {
        try {

            var result = await serviceSchemaSettings.find({}, { name: 1, serviceIcon: 1 }).exec();
            callback({
                success: true,
                message: "sucessfully fetch!!!!!",
                result
            });
        }
        catch (error) {

            callback({
                success: false,
                message: "error!!!!!",
                error
            });
        }
    },
    serviceslistingbyid: async function (data, callback) {
        try {
            var location;
            var searchQuery;
            var limit;
            var page;

            if (data.page && data.limit && data.searchQuery && data.location) {

                searchQuery = data.searchQuery;
                location = data.location;
                limit = Number(data.limit);
                page = Number(data.page);
            }
            else if (data.page && data.limit && data.searchQuery) {

                limit = Number(data.limit);
                page = Number(data.page);
                searchQuery = data.searchQuery;
                location = "";
            }
            else if (data.page && data.limit && data.location) {

                limit = Number(data.limit);
                page = Number(data.page);
                location = data.location;
            }
            else if (data.page && data.limit) {

                limit = Number(data.limit);
                page = Number(data.page);
                searchQuery = "";
                location = "";
            }
            else if (data.searchQuery && data.location) {

                searchQuery = data.searchQuery;
                location = data.location;
            }
            else if (data.searchQuery) {

                searchQuery = data.searchQuery;
                location = "";
            }
            else if (data.location) {

                var location = data.location;
                searchQuery = "";
            }
            else {

                limit = 2;
                page = 1;
                searchQuery = "";
                location = "";
            };
            // var dataQuery=[];
            // dataQuery.push({'$match':{'$and':[{'add_offering_location':{$regex:location,$options:'i'}},
            //                         {'service_offering_title':{$regex:searchQuery,$options:'i'}},
            //                         {'admin_approval':"approved"}]}});

            const result = await applyForServiceSchema.find({ userId: data.userId }).skip((page - 1) * limit).limit(Number(limit)).exec();
            var countdata = await applyForServiceSchema.find({ userId: data.userId }).exec();
            var count = countdata.length;
            var prevPage, hasPrevPage, nextPage, hasNextPage;
            var totallength = Math.ceil(count / limit);
            if (totallength == 1 && page == totallength) {
                prevPage = null;
                hasPrevPage = false;
                nextPage = null;
                hasNextPage = false;

            }
            else if (page == 1 && totallength > page) {
                prevPage = null;
                hasPrevPage = false; ``
                nextPage = Number(page) + 1;
                hasNextPage = true;

            }
            else if (page > 1 && page == totallength) {
                prevPage = Number(page) - 1;
                hasPrevPage = true;
                nextPage = null;
                hasNextPage = false;

            }
            else {
                prevPage = Number(page) - 1;
                nextPage = Number(page) + 1;
                hasPrevPage = true;
                hasNextPage = true;

            }

            const Pagination = {
                "TotalDocuments": count,
                "limit": limit,
                "TotalPages": totallength,
                "Current Page": page,
                "PrevPage": prevPage,
                "NextPage": nextPage,
                "HasPrevPage": hasPrevPage,
                "HasNextPage": hasNextPage,
                "PagingCounter": page,        // consider index starting from 1,so pagingcounter will be same like index number //
            };

            callback({
                success: true,
                message: "sucessfully fetch!!!!!",
                result,
                Pagination
            });
        }
        catch (error) {

            callback({
                success: false,
                message: "error!!!!!",
                error
            });
        }
    },
    servicesortlist: async function (data, callback) {
        try {

            const property = await applyForServiceSchema.findOne({ _id: data.id, sortlist: mongoose.Types.ObjectId(data.userId) });


            if (property != null) {
                var result = await applyForServiceSchema.updateOne({ _id: data.id }, { $pull: { sortlist: mongoose.Types.ObjectId(data.userId) } }).exec();
                callback({
                    success: true,
                    sortlist: false,
                    message: "unsortlisted!!!",
                    result
                });
            }
            // else if(property===null){
            //             
            //             callback({
            //                 success: false, 
            //                 message: "Product not found !!!", 
            //             });
            //         }
            else {

                var result = await applyForServiceSchema.updateOne({ _id: data.id },
                    { $push: { sortlist: mongoose.Types.ObjectId(data.userId) } }).exec();
                callback({
                    success: true,
                    sortlist: true,
                    message: "sortlisted!!!",
                    result
                });
            }
        }
        catch (err) {

            callback({
                success: false,
                message: "error!!!",
                err
            });
        }
    },
    getservicesortlist: async function (data, callback) {
        try {

            const result = await applyForServiceSchema.aggregate([
                {
                    $match: {
                        sortlist: {
                            $in: [mongoose.Types.ObjectId(data.userId)]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                }
            ]);

            const response = result.map(obj => ({
                ...obj,
                sortliststatus: true
            }));

            callback({
                success: true,
                message: 'Fetch sortlisted!',
                response
            });
        }
        catch (err) {
            callback({
                success: false,
                message: "error!!!",
                err
            });
        }
    },
    servicactiveinactive: async function (data, callback) {
        const result = await applyForServiceSchema.findOne({ _id: data.id }).exec();
        if (result.is_active == true) {
            await applyForServiceSchema.updateOne({ _id: data.id }, { is_active: false }).exec();
            callback({
                success: true,
                message: "inactive!!!",
            });
        }
        else {
            await applyForServiceSchema.updateOne({ _id: data.id }, { is_active: true }).exec();
            callback({
                success: true,
                message: "active!!!",
            });
        }
    },
    visitorcounterbyserviceid: async function (data, callback) {

        try {
            const service = await applyForServiceSchema.findOne({ _id: data._id }, { service_view: 1 }).exec();


            var flag = false;
            for (var i = 0; i < service.service_view.viewers.length; i++) {
                if (service.service_view.viewers[i].toString() === data.userId.toString()) {
                    flag = true;
                    break; // Exit the loop since the viewer is found
                }
            }

            if (flag === false) {
                service.service_view.count += 1;
                service.service_view.viewers.push(data.userId);
            }



            const result = await applyForServiceSchema.updateOne({ _id: data._id }, { $set: { service_view: service.service_view } }).exec();

            callback({
                success: true,
                message: "Service visitor fetched successfully!",
                service,
                result
            });

        }
        catch (err) {
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },


    //-------------------------------Post Property ------------------------------------------
    getallproperty: async function (data, callback) {
        try {
            var prevPage;
            var nextPage;
            var hasPrevPage;
            var hasNextPage;
            var searchQuery;
            var typeOfBusiness;
            var location;

            //     if(data.page && data.limit && data.searchQuery  && data.typeOfBusiness  && data.location){
            //         console.log(1);
            //         var limit=Number(data.limit);
            //         var page=Number(data.page);
            //         searchQuery=data.searchQuery;  
            //         typeOfBusiness=data.typeOfBusiness,
            //         location=data.location 
            //     }
            //     else if(data.page && data.limit && data.searchQuery && data.typeOfBusiness){
            //         console.log(2);
            //         var limit=Number(data.limit);
            //         var page=Number(data.page);
            //         searchQuery=data.searchQuery;
            //         typeOfBusiness=data.typeOfBusiness;
            //         location=""; 
            //     }
            //     else if(data.page && data.limit && data.searchQuery &&data.location){
            //         console.log(3);
            //         var limit=Number(data.limit);
            //         var page=Number(data.page);
            //         searchQuery=data.searchQuery;
            //         location="";  
            //         typeOfBusiness="";
            //     }
            //     else if(data.page && data.limit &&data.location){
            //     console.log(3);
            //     var limit=Number(data.limit);
            //     var page=Number(data.page);
            //     searchQuery="";
            //     location=data.location;  
            //     typeOfBusiness="";
            //     }
            //     else if(data.page && data.limit && data.searchQuery){
            //             console.log(3);
            //             var limit=Number(data.limit);
            //             var page=Number(data.page);
            //             searchQuery=data.searchQuery;
            //             location="";  
            //             typeOfBusiness="";
            //     }
            //     else if(data.page && data.limit && data.typeOfBusiness){
            //         console.log(4);
            //         var limit=Number(data.limit);
            //         var page=Number(data.page);
            //         typeOfBusiness=data.typeOfBusiness;
            //         location="";  
            //         searchQuery="";
            //     }
            //     else if(data.page && data.limit){
            //         console.log(5);
            //         var limit=Number(data.limit);
            //         var page=Number(data.page);
            //         searchQuery="";
            //         typeOfBusiness="";
            //         location="";
            //     }
            //     else{
            //         console.log("else");
            //         typeOfBusiness="";
            //         location="";
            //         searchQuery="";
            //         var limit=2;
            //         var page=1;
            //     };


            var limit = data.limit ? Number(data.limit) : 2;
            var page = data.page ? Number(data.page) : 1;
            var searchQuery = data.searchQuery || "";
            var typeOfBusiness = data.typeOfBusiness || "";
            var location = data.location || "";
            var dataQuery = [];
            if (data.filterdata) {

                // Using eval to parse the string and convert it to an object
                const parsedData = eval('(' + data.filterdata + ')');
                var filterdata = {
                    typeOfBusiness: parsedData.typeOfBusiness,
                    typeOfProperty: parsedData.typeOfProperty,
                    catagory: parsedData.catagory,
                    subcatagory: parsedData.subCatagory,
                    locality: parsedData.location,
                    noOfBedRooms: parsedData.noOfBedRooms,
                    furnishingType: parsedData.furnishingType,
                    ownership: parsedData.ownership,
                    expectedPrice: parsedData.expectedPrice,
                    carpetArea: parsedData.carpetArea,
                    ageOfProperty: parsedData.ageOfProperty,
                    availableFor: parsedData.availableFor,
                    is_feacher: parsedData.is_feacher,
                    is_verified: parsedData.is_verified,
                    firesaleOrNot: parsedData.firesaleOrNot
                };

                function convertexpectedPrice(filterdata) {
                    if (!filterdata || !filterdata.expectedPrice || !Array.isArray(filterdata.expectedPrice)) {
                        throw new Error("Invalid input format");
                    }

                    const conversionFactors = { "L": 100000, "CR": 10000000 };
                    const expectedPrice = filterdata.expectedPrice.map(price => {
                        const numericValue = parseFloat(price.replace(/\s/g, '').replace(/[A-Za-z]/g, ''));
                        const multiplier = conversionFactors[price.replace(/\d|\s|\.+/g, '')];
                        if (isNaN(numericValue)) {
                            throw new Error("Invalid price format");
                        }
                        return (multiplier) ? (numericValue * multiplier) : parseFloat(numericValue.toFixed(2));
                    });

                    filterdata.expectedPrice = expectedPrice;
                }
                convertexpectedPrice(filterdata);

                if (filterdata.typeOfBusiness && filterdata.typeOfBusiness.length > 0 &&
                    filterdata.typeOfProperty && filterdata.typeOfProperty.length > 0 &&
                    filterdata.catagory && filterdata.catagory.length > 0 &&
                    filterdata.subcatagory && filterdata.subcatagory.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'basicdetails.typeOfBusiness': { "$in": filterdata.typeOfBusiness } },
                                { 'basicdetails.typeOfProperty': { "$in": filterdata.typeOfProperty } },
                                { 'basicdetails.catagory': { "$in": filterdata.catagory } },
                                { 'basicdetails.subcatagory': { "$in": filterdata.subcatagory } }]
                        }
                    })
                };
                if (filterdata.typeOfBusiness && filterdata.typeOfBusiness.length > 0 &&
                    filterdata.typeOfProperty && filterdata.typeOfProperty.length > 0 &&
                    filterdata.catagory && filterdata.catagory.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'basicdetails.typeOfBusiness': { "$in": filterdata.typeOfBusiness } },
                                { 'basicdetails.typeOfProperty': { "$in": filterdata.typeOfProperty } },
                                { 'basicdetails.catagory': { "$in": filterdata.catagory } }]
                        }
                    })
                };
                if (filterdata.typeOfBusiness && filterdata.typeOfBusiness.length > 0 &&
                    filterdata.typeOfProperty && filterdata.typeOfProperty.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'basicdetails.typeOfBusiness': { "$in": filterdata.typeOfBusiness } },
                                { 'basicdetails.typeOfProperty': { "$in": filterdata.typeOfProperty } }]
                        }
                    })
                };
                if (filterdata.typeOfBusiness = '' &&
                    filterdata.typeOfProperty && filterdata.typeOfProperty.length > 0 &&
                    filterdata.catagory && filterdata.catagory.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'basicdetails.typeOfProperty': { "$in": filterdata.typeOfProperty } },
                                { 'basicdetails.catagory': { "$in": filterdata.catagory } }]
                        }
                    })
                };
                if (filterdata.typeOfBusiness == '' && filterdata.typeOfProperty && filterdata.typeOfProperty.length > 0) {
                    dataQuery.push({
                        '$match':
                            { 'basicdetails.typeOfProperty': { "$in": filterdata.typeOfProperty } }
                    })
                };
                if (filterdata.typeOfBusiness == '' && filterdata.catagory && filterdata.catagory.length > 0) {
                    dataQuery.push({
                        '$match':
                            { 'basicdetails.catagory': { "$in": filterdata.catagory } }
                    })
                };
                if (filterdata.typeOfBusiness && filterdata.typeOfBusiness.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'basicdetails.typeOfBusiness': { "$in": filterdata.typeOfBusiness } }]
                        }
                    })
                };
                if (filterdata.locality && filterdata.locality.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$or': [{ 'location.locality': { '$in': filterdata.locality } },
                            { 'location.subLocality': { '$in': filterdata.locality } }
                            ]
                        }
                    });

                }
                if (filterdata.noOfBedRooms && filterdata.noOfBedRooms.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'aboutproperty.roomDetails.noOfBedRooms': { "$in": filterdata.noOfBedRooms } }]
                        }
                    })
                };
                if (filterdata.furnishingType && filterdata.furnishingType.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'aboutproperty.furnishingType': { "$in": filterdata.furnishingType } }]
                        }
                    })
                };
                if (filterdata.ownership && filterdata.ownership.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'pricinganddetails.ownership': { "$in": filterdata.ownership } }]
                        }
                    })
                };
                if (typeOfBusiness === "sell") {
                    if (filterdata.expectedPrice && filterdata.expectedPrice.length > 0) {

                        dataQuery.push({
                            '$match': {
                                '$and': [
                                    {
                                        $and: [{ 'pricinganddetails.pricingDetails.expectedPrice': { "$gte": filterdata.expectedPrice[0] } },
                                        { 'pricinganddetails.pricingDetails.expectedPrice': { "$lte": filterdata.expectedPrice[1] } }]
                                    }]
                            }
                        })
                    };
                }
                else {
                    if (filterdata.expectedPrice && filterdata.expectedPrice.length > 0) {

                        dataQuery.push({
                            '$match': {
                                '$and': [
                                    {
                                        $and: [{ 'pricinganddetails.rentDetails': { "$gte": filterdata.expectedPrice[0] } },
                                        { 'pricinganddetails.rentDetails': { "$lte": filterdata.expectedPrice[1] } }]
                                    }]
                            }
                        })
                    };
                }

                if (filterdata.carpetArea && filterdata.carpetArea.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                {
                                    $and: [{ 'aboutproperty.carpetArea': { "$gte": filterdata.carpetArea[0] } },
                                    { 'aboutproperty.carpetArea': { "$lte": filterdata.carpetArea[1] } }]
                                }]
                        }
                    })
                };
                if (filterdata.ageOfProperty && filterdata.ageOfProperty.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'aboutproperty.availability.ageOfProperty': { "$in": filterdata.ageOfProperty } }]
                        }
                    })
                };
                if (filterdata.is_feacher[0] === false) {
                    filterdata.is_feacher = [];
                };
                if (filterdata.is_verified[0] === false) {
                    filterdata.is_verified = [];
                }
                if (filterdata.is_feacher && filterdata.is_feacher.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'is_feacher': { "$in": filterdata.is_feacher } }]
                        }
                    })
                };
                if (filterdata.is_verified && filterdata.is_verified.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'is_verified': { "$in": filterdata.is_verified } }]
                        }
                    })
                };
                if (filterdata.firesaleOrNot && filterdata.firesaleOrNot.length > 0) {
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'pricinganddetails.firesaleOrNot': { "$in": filterdata.firesaleOrNot } }]
                        }
                    })
                };
                if (filterdata.availableFor && filterdata.availableFor.length > 0) {
                    filterdata.availableFor = filterdata.availableFor.map(element => { return element.toLowerCase(); });
                    dataQuery.push({
                        '$match': {
                            '$and': [
                                { 'aboutproperty.availableFor': { "$in": filterdata.availableFor } }]
                        }
                    })
                }
            }

            var searchQueryArray = searchQuery.split(' ').map(word => (word));


            searchQueryArray = searchQueryArray.filter(element => {
                return !element.includes("bhk") && element !== "in" && element !== "at";
            });

            var searchQueryArraylength = searchQueryArray.length;

            // dataQuery.push(
            //     {'$match':{
            //     '$and':[
            //             {'basicdetails.typeOfBusiness':{$regex:typeOfBusiness,$options:'i'}},
            //             {'location.city':{$regex:location,$options:'i'}}
            //            ],
            //     '$or':[
            //         {'basicdetails.typeOfBusiness':{$regex:searchQuery,$options:'i'}},
            //         {'basicdetails.typeOfProperty':{$regex:searchQuery,$options:'i'}},
            //         {'basicdetails.catagory':{$regex:searchQuery,$options:'i'}},
            //         {'basicdetails.subCatagory':{$regex:searchQuery,$options:'i'}},
            //         {'location.locality':{$regex:searchQuery,$options:'i'}},
            //         {'location.subLocality':{$regex:searchQuery,$options:'i'}},
            //         {'location.city':{$regex:searchQuery,$options:'i'}},
            //         {'pricinganddetails.ownership':{$regex:searchQuery,$options:'i'}},
            //         {'aboutproperty.carpetArea':Number(searchQuery)},
            //         {'aboutproperty.furnishingType':{$regex:searchQuery,$options:'i'}},
            //         {'aboutproperty.availability.ageOfProperty':{$regex:searchQuery,$options:'i'}},
            //         {'aboutproperty.roomDetails.noOfBedRooms':Number(searchQuery)},
            //         {'aboutproperty.roomDetails.roomTypes':Number(searchQuery)},
            //     ],"is_completed":true,"is_active":true,
            // }},{ $project: { "basicdetails.typeOfBusiness":1,
            //                  "basicdetails.typeOfProperty":1,
            //                  "basicdetails.catagory": 1,  
            //                  "basicdetails.subCatagory":1,
            //                  'location.locality':1,
            //                  'location.subLocality':1,
            //                  'location.city':1,
            //                  'aboutproperty.carpetArea':1,
            //                  "aboutproperty.areaMessurementUnit":1,
            //                  'aboutproperty.roomDetails.noOfBedRooms':1,
            //                  'aboutproperty.roomDetails.roomTypes':1,
            //                  'aboutproperty.roomDetails.howManyPeople':1,
            //                  'aboutproperty.furnishingType':1,
            //                  'aboutproperty.availableFor':1,
            //                  'aboutproperty.capacityAndAvailability':1,
            //                  "pricinganddetails":1,
            //                  "uploadImages":1,
            //                  "is_active":1,
            //                  'admin_approval':1,
            //                  "userId":1,
            //                  "createdAt":1,
            //                  "updatedAt":1,
            //                  "is_verified":1,
            //                  "is_feacher":1,
            //                  "feacher_validity":1,
            //                  "sortlist":1,
            //                  "property_view":1,
            //                  "rera_number":1
            //                 }},
            //                 {
            //                     $lookup: {
            //                       from: "users",
            //                       localField: "userId",
            //                       foreignField: "_id",
            //                       as: "user"
            //                     },
            //                 },

            //               ); 
            dataQuery.push(
                {
                    '$match': {
                        "is_completed": true, "is_active": true,
                        '$and': [
                            { 'basicdetails.typeOfBusiness': { $regex: typeOfBusiness, $options: 'i' } },
                            { 'location.city': { $regex: location, $options: 'i' } }
                        ],

                    }
                },
            )
            if (searchQueryArraylength > 1) {
                dataQuery.push(
                    {
                        '$match': {

                            '$and': [
                                { 'basicdetails.typeOfBusiness': { $in: searchQueryArray } },
                                { 'basicdetails.typeOfProperty': { $in: searchQueryArray } },
                                { 'basicdetails.catagory': { $in: searchQueryArray } },
                                { 'basicdetails.subCatagory': { $in: searchQueryArray } },
                                { 'location.locality': { $in: searchQueryArray } },
                                { 'location.subLocality': { $in: searchQueryArray } },
                                { 'location.city': { $in: searchQueryArray } },
                                { 'pricinganddetails.ownership': { $in: searchQueryArray } },
                                { 'aboutproperty.carpetArea': { $in: searchQueryArray.map(value => (parseInt(value))) } },
                                { 'aboutproperty.furnishingType': { $in: searchQueryArray } },
                                { 'aboutproperty.availability.ageOfProperty': { $in: searchQueryArray } },
                                { 'aboutproperty.roomDetails.noOfBedRooms': { $in: searchQueryArray.map(value => (parseInt(value))) } },
                                { 'aboutproperty.roomDetails.roomTypes': { $in: searchQueryArray } },
                            ]

                        }
                    }
                )
            }
            else {
                dataQuery.push(
                    {
                        '$match': {

                            '$or': [
                                { 'basicdetails.typeOfBusiness': { $in: searchQueryArray } },
                                { 'basicdetails.typeOfProperty': { $in: searchQueryArray } },
                                { 'basicdetails.catagory': { $in: searchQueryArray } },
                                { 'basicdetails.subCatagory': { $in: searchQueryArray } },
                                { 'location.locality': { $in: searchQueryArray } },
                                { 'location.subLocality': { $in: searchQueryArray } },
                                { 'location.city': { $in: searchQueryArray } },
                                { 'pricinganddetails.ownership': { $in: searchQueryArray } },
                                { 'aboutproperty.carpetArea': { $in: searchQueryArray.map(value => (parseInt(value))) } },
                                { 'aboutproperty.furnishingType': { $in: searchQueryArray } },
                                { 'aboutproperty.availability.ageOfProperty': { $in: searchQueryArray } },
                                { 'aboutproperty.roomDetails.noOfBedRooms': { $in: searchQueryArray.map(value => (parseInt(value))) } },
                                { 'aboutproperty.roomDetails.roomTypes': { $in: searchQueryArray } },
                            ]

                        }
                    }
                )
            }
            dataQuery.push(
                {
                    $project: {
                        "basicdetails.typeOfBusiness": 1,
                        "basicdetails.typeOfProperty": 1,
                        "basicdetails.catagory": 1,
                        "basicdetails.subCatagory": 1,
                        'location.locality': 1,
                        'location.subLocality': 1,
                        'location.city': 1,
                        'aboutproperty.carpetArea': 1,
                        "aboutproperty.areaMessurementUnit": 1,
                        'aboutproperty.roomDetails.noOfBedRooms': 1,
                        'aboutproperty.roomDetails.roomTypes': 1,
                        'aboutproperty.roomDetails.howManyPeople': 1,
                        'aboutproperty.furnishingType': 1,
                        'aboutproperty.availableFor': 1,
                        'aboutproperty.capacityAndAvailability': 1,
                        "pricinganddetails": 1,
                        "uploadImages": 1,
                        "is_active": 1,
                        'admin_approval': 1,
                        "userId": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "is_verified": 1,
                        "is_feacher": 1,
                        "feacher_validity": 1,
                        "sortlist": 1,
                        "property_view": 1,
                        "rera_number": 1,
                        "advanceDeposit":1
                    }
                },

                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    },
                },

            )




            var property = await propertypostschema.aggregate(dataQuery).skip((page - 1) * limit).limit(Number(limit)).exec();
            property.forEach((item) => {
                if (Array.isArray(item.user)) {
                    item.user = item.user[0];
                }
            });
            property.forEach((obj) => {
                if (obj.sortlist.some((item) => String(item) === String(data.userId))) {
                    obj.sortliststatus = true;
                }
            });
            const Properties = property.map(prop => {
                const viewed = prop.property_view.viewers.map(String).includes(data.userId);
                return { ...prop, viewed };
            });
            property = Properties;

            var countdata = await propertypostschema.aggregate(dataQuery).exec();
            var count = countdata.length;
            var totallength = Math.ceil(count / limit);
            if (totallength == 1 && page == totallength) {
                prevPage = null;
                hasPrevPage = false;
                nextPage = null;
                hasNextPage = false;

            }
            else if (page == 1 && totallength > page) {
                prevPage = null;
                hasPrevPage = false; ``
                nextPage = Number(page) + 1;
                hasNextPage = true;

            }
            else if (page > 1 && page == totallength) {
                prevPage = Number(page) - 1;
                hasPrevPage = true;
                nextPage = null;
                hasNextPage = false;

            }
            else {
                prevPage = Number(page) - 1;
                nextPage = Number(page) + 1;
                hasPrevPage = true;
                hasNextPage = true;

            }

            const Pagination = {
                "TotalDocuments": count,
                "limit": limit,
                "TotalPages": totallength,
                "Current Page": page,
                "PrevPage": prevPage,
                "NextPage": nextPage,
                "HasPrevPage": hasPrevPage,
                "HasNextPage": hasNextPage,
                "PagingCounter": page,        // consider index starting from 1,so pagingcounter will be same like index number //

            }
            callback({
                success: true,
                statuscode: 200,
                message: "Property fetched Sucessfully!!",
                property,
                Pagination
            })
        }
        catch (err) {
            callback({
                success: false,
                statuscode: 500,
                message: "An error occurred while fetching properties.",
                response: err

            })
        }
    },
    getpropertybypropertyid: async function (data, callback) {
        // 
        try {
            var dataQuery = [];
            dataQuery.push({
                $project: {
                    "basicdetails": 1,
                    'location': 1,
                    'aboutproperty': 1,
                    "pricinganddetails": 1,
                    "is_active": 1,
                    "uploadImages": 1,
                    "is_completed": 1,
                    "is_verified": 1,
                    "is_feacher": 1,
                    "feacher_validity": 1,
                    "sortlist": 1,
                    "rera_number": 1,
                    "advanceDeposit":1
                }
            });
            var property = await propertypostschema.findOne({ _id: data.property_id, is_completed: true }).exec();
            const sellerdetails = await userschema.findOne({ _id: property.userId }).exec();
            const propertycount = await propertypostschema.countDocuments({ userId: property.userId });
            const verifycount = await propertypostschema.countDocuments({ userId: property.userId, is_verified: true });

            // const sellerdetails=await userschema.aggregate([
            //     {
            //       $lookup: {
            //         from: "propertyposts",
            //         localField: "_id",
            //         foreignField: "userId",
            //         as: "properties"
            //       }
            //     },
            //     {
            //         $lookup: {
            //         from: "applyForServices",
            //         localField: "_id",
            //         foreignField: "userId",
            //         as: "services"
            //         }
            //     },
            //     {
            //       $project: {
            //         _id: 1,
            //         name: 1,
            //         email: 1,
            //         mobilenumber: 1,
            //         user_type:1,
            //         avatar:1,
            //         is_active: 1,
            //         is_verified: 1,
            //         num_properties: { $size: "$properties" },
            //         num_services: { $size: "$services" }
            //       }
            //     }
            //   ])
            console.log(property);
            console.log(data);

            //    property.forEach((item) => {
            //     if (Array.isArray(item.user)) {
            //       item.user = item.user[0];
            //     }
            //   });



            const viewed = property.property_view.viewers.includes(data.userId);
            const modifiedProperty = {
                ...property.toObject(),
                viewed: viewed
            };
            property = modifiedProperty;
            if (property.sortlist.some((item) => String(item) === String(data.userId))) {
                property.sortliststatus = true;
            }

            callback({
                success: "true",
                message: "property fetched Sucessfully!!",
                property,
                sellerdetails,
                propertycount,
                verifycount
            })
        }
        catch (err) {
            console.log(err);
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    getpropertybyid: async function (data, callback) {
        try {

            // const property =await propertypostschema.find({userId:data.userId,is_completed:true}).exec();
            // const property = await propertypostschema.aggregate([
            //     {
            //       $match: {
            //         userId:mongoose.Types.ObjectId(data.userId),
            //         is_completed:true
            //       },
            //     },
            //     {
            //       $unwind: '$sortlist',
            //     },
            //     {
            //         $lookup: {
            //           from: 'users',
            //           localField: 'sortlist',
            //           foreignField: '_id',
            //           as: 'user',
            //         },
            //       },
            //       {
            //         $unwind: '$user',
            //       },
            //   ]);
            const property = await propertypostschema.aggregate([
                {
                    $match: {
                        userId: mongoose.Types.ObjectId(data.userId),
                        is_completed: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'sortlist',
                        foreignField: '_id',
                        as: 'potential_buyers'
                    }
                },
            ]);
            callback({
                success: "true",
                message: "property fetched Sucessfully!!",
                property
            })
        }
        catch (err) {

            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    postpropertydata: async function (data, callback) {
        try {

            let step = data.step;
            if (data.userId) {
                var userId = data.userId
            };
            if (data._id) {
                var _id = data._id
            };
            switch (step) {
                case "basicdetails":

                    if (data._id) {
                        var result = await propertypostschema.updateOne({ _id: data._id, userId: data.userId }, { ...data }).exec();
                        callback({
                            success: true,
                            message: "Sucessfully Updated!!!",
                            result
                        });
                    }
                    else {
                        if (data._id == '') {
                            delete data._id
                        };

                        var postproperty = new propertypostschema({
                            ...data,
                            is_completed: false, userId: userId, is_active: false, admin_approval: "pending",
                        });
                        postproperty.save((err, res) => {
                            if (res) {
                                callback({
                                    success: true,
                                    message: "Sucessfully saved Basic Details",
                                    res
                                });
                            }
                            else {
                                callback({
                                    success: false,
                                    message: "unsucess", err
                                });
                            }
                        })

                    }
                    break;
                case "location":

                    propertypostschema.updateOne({ _id: _id },
                        {
                            $set: data,
                            is_completed: false, userId: userId, is_active: false, admin_approval: "pending"
                        },
                        function (er, up) {
                            if (er) {
                                callback({
                                    success: true, message: "error!!", er
                                });
                            }
                            else {
                                callback({
                                    success: true, message: "Sucessfully saved Location Details !!", up
                                });
                            }
                        })

                    break;
                case "aboutproperty":

                    propertypostschema.updateOne({ _id: _id },
                        {
                            $set: {
                                aboutproperty: data.aboutproperty,
                                is_completed: false,
                                userId: userId,
                                is_active: false,
                                admin_approval: "pending"
                            }
                        },
                        function (er, up) {
                            if (er) {
                                callback({
                                    success: false, message: "error!!", er
                                });
                            }
                            else {
                                callback({
                                    success: true, message: "Sucessfully saved PropertyProfile Details !!", up
                                })
                            }
                        })
                    break;
                case "uploadImages":


                    //     var uploadImages=[];

                    // for(var i=0;i<data.uploadImages.length;i++){
                    //     const imageName = "prperty"+Date.now()+".jpeg";
                    //     const imageNamePath = path.join(__dirname,"../upload/postproperty",imageName);
                    //     const buffer = Buffer.from(data.uploadImages[i].propertyImage,"base64");
                    //     fs.writeFileSync(imageNamePath, buffer,'base64', function(err) {
                    //         
                    //       });
                    //       uploadImages.push({
                    //         propertyImage:imageName,
                    //         name:data.uploadImages[i].name});
                    // };  

                    propertypostschema.updateOne({ _id: _id },
                        {
                            $set: { uploadImages: data.uploadImages, step: step },
                            is_completed: false, userId: userId, is_active: false, admin_approval: "pending"
                        },
                        function (er, up) {
                            if (up) {
                                callback({
                                    success: true, message: "Sucessfully upload !!", up
                                });
                            }
                            else {
                                callback({
                                    success: true, message: "eror", er
                                });
                            }
                        })
                    break;
                case "pricinganddetails":

                    console.log(data);
                    propertypostschema.updateOne({ _id: _id },
                        {
                            $set: data,
                            is_completed: true, userId: userId, is_active: false, admin_approval: "pending"
                        },
                        function (er, up) {
                            if (er) {
                                callback({
                                    success: false, message: "error!!", er
                                });
                            }
                            else {
                                const notification = new notificationSchema({
                                    touser: data.email,
                                    notificationtype: "post property",
                                    notification: {
                                        notification_subject: notificationmessage.addpostsubject,
                                        notification_body: notificationmessage.addpostbody
                                    },
                                    notificationinfo: {
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
                                    else {
                                        callback({
                                            success: true, message: "Sucessfully saved Price&Other Details !!", up
                                        });
                                    }
                                });
                            }
                        })
                    break;
            };
        }
        catch (err) {
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    incompletepostpropertydata: async function (data, callback) {
        try {

            var pendingData = await propertypostschema.find({ userId: data.userId, is_completed: false, admin_approval: "pending" }).exec();

            if (pendingData) {
                callback({
                    success: true,
                    statuscode: 200,
                    message: "Pending PostProperty Details!!!",
                    pendingData
                })
            }
            else {
                callback({
                    success: true,
                    statuscode: 200,
                    message: "alreday exist!!",
                    pendingData
                })
            }
        }
        catch (err) {
            callback({
                success: false,
                statuscode: 500,
                error: err
            })
        }
    },
    discardpostpropertydata: async function (data, callback) {
        try {

            var result = await propertypostschema.deleteOne({ userId: data.userId, is_completed: false, admin_approval: "pending" }).exec();

            if (result.deletedCount == 0) {
                callback({
                    success: false,
                    statuscode: 500,
                    message: "PostProperty not found!!!",
                })
            }
            else {
                callback({
                    success: true,
                    statuscode: 200,
                    message: "Pending PostProperty deleted!!!",
                    result
                })
            }
            ;
        }
        catch (error) {
            callback({
                success: false,
                message: error
            });
        }
    },
    visitorcounterbyid: async function (data, callback) {

        try {
            const property = await propertypostschema.findOne({ _id: data._id }, { property_view: 1 }).exec();


            var flag = false;
            for (var i = 0; i < property.property_view.viewers.length; i++) {
                if (property.property_view.viewers[i].toString() === data.userId.toString()) {
                    flag = true;
                    break; // Exit the loop since the viewer is found
                }
            }

            if (flag === false) {
                property.property_view.count += 1;
                property.property_view.viewers.push(data.userId);
            }



            const result = await propertypostschema.updateOne({ _id: data._id }, { $set: { property_view: property.property_view } }).exec();

            callback({

                success: true,
                message: "property visitor fetched successfully!",
                property,
                result
            });
        }
        catch (err) {

            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    enquiry: async function (data, callback) {

        try {
            const enquiry = "name:" + data.enquiry.name + "," + "propertyId:" + data.enquiry.propertyId + "," + "email:" + data.enquiry.email +
                "," + "phone:" + data.enquiry.phone + "," + "userType:" + data.enquiry.userType + "," + "message:" + data.enquiry.message;

            const chatRooms = await messageSchema.findOne(
                { $and: [{ chat_user: data.senderId }, { chat_user: data.receiverId }] }
            );

            //image of property
            const property = await propertypostschema.findOne({ _id: data.enquiry.propertyId }, { 'uploadImages': { $elemMatch: { isCoverImage: true } }, 'userId': 1 });
            const coverImage = property?.uploadImages[0]?.propertyImage || null;


            if (property) {
                const seller_id = property.userId;
                if (chatRooms != null) {
                    var chat_room_id = chatRooms._id;
                }

                if (chatRooms !== null && chatRooms !== undefined) {

                    if (chatRooms.block_info.is_block === true) {
                        if (chatRooms.block_info.block_by.userId == seller_id) {
                            return (callback({
                                success: false,
                                message: "The seller blocked you!! So you are not able to sent enquiry for this product.",

                            }))
                        }
                        else if (chatRooms.block_info.block_by.userId == data.senderId) {
                            return (callback({
                                success: false,
                                message: "You are  already block this seller, So please unblock the seller first!",
                            }))
                        }
                        else {
                            return (callback({
                                success: false,
                                message: "Invalid entry or params",
                            }))
                        }
                    }
                    else {
                        var chats = [{
                            user_id: data.senderId,
                            // name: data.enquiry.name,
                            messagetype: data.enquiry.messagetype,
                            message: enquiry,
                            date_time: data.enquiry.date_time,
                            medialink: coverImage,
                            is_deleted: data.is_deleted,
                        }];
                        await messageSchema.updateOne(
                            { _id: chatRooms._id },
                            { $push: { chats: { $each: chats } } }
                        );
                        socketConnection.enquiry(data.receiverId);
                    }
                }
                else {
                    var messages = new messageSchema({
                        chat_user: [data.senderId, data.receiverId],
                        chats: [{
                            user_id: data.senderId,
                            //name:data.enquiry.name,
                            messagetype: data.enquiry.messagetype,
                            message: enquiry,
                            date_time: data.enquiry.date_time,
                            medialink: coverImage,
                            is_deleted: data.is_deleted,
                        }],
                    });
                    messages.save();
                    // call function of socket  
                    socketConnection.enquiry(data.receiverId);
                }
                const user = await userschema.findOne({ _id: Object(data.receiverId) });

                const notification = new notificationSchema({
                    touser: user.email,
                    notificationtype: "Enquiry",
                    notification: {
                        notification_subject: notificationmessage.enquirysubject,
                        notification_body: notificationmessage.enquirybody
                    },
                });
                notification.save((err, res) => {
                    if (err) {
                        callback({
                            success: false,
                            message: "notificaton error",
                            err: err
                        })
                    }
                    else {

                        callback({
                            success: true,
                            statuscode: 200,
                            message: notificationmessage.enquirybody,
                        })
                    }
                });
            }
            else {
                callback({
                    success: false,
                    statuscode: 500,
                    message: "property not found",
                })
            }


        }
        catch (err) {
            console.log(err);
            callback({
                success: false,
                statuscode: 500,
                message: "catch error",
                response: err
            })
        }
    },
    propertysortlist: async function (data, callback) {
        try {

            const property = await propertypostschema.findOne({ _id: data.id, sortlist: mongoose.Types.ObjectId(data.userId) });
            if (property != null) {
                var result = await propertypostschema.updateOne({ _id: data.id }, { $pull: { sortlist: mongoose.Types.ObjectId(data.userId) } }).exec();
                callback({
                    success: true,
                    sortlist: false,
                    message: "unsortlisted!!!",
                    result
                });
            }
            // else if(property==null){
            //             
            //             callback({
            //                 success: false, 
            //                 message: "Product not found !!!", 
            //             });
            //         }
            else {

                var result = await propertypostschema.updateOne({ _id: data.id }, { $push: { sortlist: mongoose.Types.ObjectId(data.userId) } }).exec();
                callback({
                    success: true,
                    sortlist: true,
                    message: "sortlisted!!!",
                    result
                });
            }
        }
        catch (err) {

            callback({
                success: false,
                message: "error!!!",
                err
            });
        }
    },
    getpropertysortlist: async function (data, callback) {

        try {

            const result = await propertypostschema.aggregate([
                {
                    $match: {
                        sortlist: {
                            $in: [mongoose.Types.ObjectId(data.userId)]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                }
            ]);

            const response = result.map(obj => ({
                ...obj,
                sortliststatus: true
            }));

            callback({
                success: true,
                message: 'Fetch sortlisted!',
                response
            });
        }
        catch (err) {

            callback({
                success: false,
                message: 'Error!',
                err
            });
        }

    },
    propertyactiveinactive: async function (data, callback) {
        const result = await propertypostschema.findOne({ _id: data.id }).exec();
        if (result.is_active == true) {
            await propertypostschema.updateOne({ _id: data.id }, { is_active: false }).exec();
            callback({
                success: true,
                message: "inactive!!!",
            });
        }
        else {
            await propertypostschema.updateOne({ _id: data.id }, { is_active: true }).exec();
            callback({
                success: true,
                message: "active!!!",
            });
        }
    },
    getfurnishing: async function (callback) {
        try {
            var result = await propertyschema.findOne({}, { furnishingDetails: 1 }).exec();
            callback({
                success: true,
                message: "Sucessfully fetch!!!",
                result
            });
        }
        catch (err) {
            callback({
                success: false,
                message: "unsucess",
                err
            });
        }
    },


    //-------------------------------Chat Section ----------------------------------------
    chat: async function (data, callback) {
        try {
            var message = {
                chat_user: [data.userId, data.person_id],
                chats: {
                    user_id: data.userId,
                    name: data.name,
                    message: data.message,
                    date_time: 2022,
                    medialink: null,
                    is_deleted: false,
                },
                is_active: true
            };
            if (data._id) {
                const response = await messageSchema.updateOne({ _id: data._id }, { $push: { chats: message.chats } });
                global.io.emit("msg", response);
                callback({
                    success: true,
                    message: "sucess",
                    error: response
                });
            }
            else {
                var messagedata = new messageSchema({
                    ...message,
                });
                messagedata.save((err, res) => {
                    if (err) {
                        callback({
                            success: false,
                            message: "some internal error has occurred",
                            error: err
                        });
                    }
                    else {
                        global.io.emit("msg", res);
                        callback({
                            success: true,
                            message: "Sucessfull!!!!!",
                            res
                        });
                    }
                });
            }
        }
        catch (error) {

            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: error
            })
        }
    },
    getchatbyuserid: async function (data, callback) {
        try {
            var chatRooms = await messageSchema.aggregate([
                {
                    $match: {
                        chat_user: { $in: [data.userId] },
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            chatUserIds: {
                                $map: {
                                    input: '$chat_user',
                                    as: 'userId',
                                    in: { $toObjectId: '$$userId' } // Convert chat_user IDs to ObjectId
                                }
                            }
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $in: ['$_id', '$$chatUserIds'] }
                                }
                            },
                            {
                                $project: { name: 1, avatar: 1 }
                            }
                        ],
                        as: 'users'
                    }
                },
                {
                    $sort: { updatedAt: -1 } // Sort by updatedAt in descending order
                },
            ]);
            // const filteredChatRooms = chatRooms.filter(room => {
            //     const deletionInfo = room.room_deletion_info;
            //     if (deletionInfo && deletionInfo.length > 0) {
            //         var ab= deletionInfo.every(info => !info.deleted_by.equals(data.userId));
            //         var bc= deletionInfo.every(info => info.length == room.chats.length);

            //        // var bc=deletionInfo.length == room.chats.length; 
            //         console.log(bc);    // true
            //         console.log(ab);    //false
            //         if(bc==true && ab== false){
            //             console.log("here");
            //             return false;
            //         }
            //         else {
            //             return true;
            //         }
            //     }
            //     return true;
            // });
            const filteredChatRooms = chatRooms.map(room => {
                const deletionInfo = room.room_deletion_info;
                if (deletionInfo && deletionInfo.length > 0) {
                    const is_deleted_by = deletionInfo.every(info => info.deleted_by.equals(data.userId));
                    const is_deleted_chat_lesser = deletionInfo.every(info => info.deleted_chat_length < room.chats.length);



                    if (is_deleted_by && is_deleted_chat_lesser) {
                        // Find the maximum length within deletionInfo objects
                        const maxLength = Math.max(...deletionInfo.map(info => info.deleted_chat_length));

                        // Set startIndex to maxLength - 1 or 0 if maxLength is negative
                        const startIndex = Math.max(maxLength, 0);

                        // Slice room.chats based on startIndex
                        room.chats = room.chats.slice(startIndex);
                    }

                }
                return room;
            });



            chatRooms = filteredChatRooms;

            function parseMessage(messageString) {
                const keyValuePairs = messageString.split(',').map(pair => pair.split(':'));
                const messageObject = {};


                for (const [key, value] of keyValuePairs) {

                    if (key && value) {
                        messageObject[key] = value;
                    }

                }
                return messageObject;
            }

            for (const chatRoom of chatRooms) {
                for (const chat of chatRoom.chats) {
                    if (chat.messagetype == "enquiry") {
                        const messageString = chat.message;
                        chat.message = parseMessage(messageString);
                    }
                }
            }

            callback({
                success: true,
                statuscode: 200,
                message: messages.success,
                chatRooms
            })

        }
        catch (error) {
            console.log(error);
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: error
            })
        }
    },
    getchatbychatid: async function (data, callback) {
        try {
            const foundData = await messageSchema.findOne({ _id: data.chatid }).exec();

            callback({
                success: true,
                statuscode: 200,
                message: messages.success,
                response: foundData
            })

        }
        catch (error) {

            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: error
            })
        }
    },
    blockchatbychatid: async function (data, callback) {
        try {

            var remainingIds;
            const foundDataA = await messageSchema.findOne({ _id: data.chatid }).exec();
            console.log(foundDataA);
            if (data.is_block == foundDataA.block_info.is_block) {
                callback({
                    success: false,
                    statuscode: 400,
                    message: "Not possible.",
                })
            }
            else {

                if (data.is_block == true) {

                    var foundData = await messageSchema.updateOne({ _id: data.chatid },
                        {
                            $set: {
                                'block_info.is_block': data.is_block,
                                'block_info.block_by.userId': data.userId // Set the user ID you want
                            }
                        }).exec();
                }
                else {
                    var foundData = await messageSchema.updateOne({ _id: data.chatid },
                        {
                            $set: {
                                'block_info.is_block': data.is_block,
                                'block_info.block_by.userId': null // Set the user ID you want
                            }
                        }).exec();
                }
                callback({
                    success: true,
                    statuscode: 200,
                    message: messages.success,
                    response: foundData
                })
            }
        }
        catch (error) {
            console.log(error);
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: error
            })
        }
    },
    deletechatroom: async (data, callback) => {
        const chatRoomId = data.chatRoomId; // Assuming you have a way to identify the chat room
        try {
            // Find the chat room
            const chatRoom = await messageSchema.findById(chatRoomId);

            if (!chatRoom) {
                return (callback({
                    success: false,
                    statuscode: 404,
                    message: 'Chat room not found',
                }));
            }

            if (chatRoom.chat_user.includes(data.userId)) {
                await messageSchema.updateOne({
                    _id: data.chatRoomId,
                },
                    {
                        $set: {
                            room_deletion_info: [{
                                'deleted_by': data.userId,
                                'deleted_chat_length': chatRoom.chats.length,
                                'room_deletion_info.deletion_time': new Date()
                            }]
                        }
                    }
                );
                return callback({
                    success: true,
                    statuscode: 200,
                    message: 'Successfully deleted the chat room'
                });
            } else {
                return callback({
                    success: false,
                    statuscode: 500,
                    message: 'You are not in this chat room'
                });
            }


        } catch (error) {
            console.error(error);
            return (callback({
                success: false,
                statuscode: 500,
                message: 'An error occurred'
            }));
        }
    },


    //-------------------------------status Section ----------------------------------------
    statusUpdate: async function (data, callback) {
        try {

            if (data._id) {
                await userStatus.updateOne({ _id: data._id },
                    { ...data }).exec();
                callback({
                    success: true,
                    message: messages.sucessfullySavedDetails,
                });
            }
            else {
                let a = new userStatus({
                    ...data,
                });
                a.save((err, res) => {
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
            }
        }
        catch (error) {

            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: error
            })
        }
    },
    getstatusbylocation: async function (data, callback) {
        // Call the deleteExpiredStatuses function periodically, every 1 minute
        deleteExpiredStatuses();
        const status = await userStatus.find({ location: data.location }).exec();

        callback({
            success: "true",
            message: "fetched Sucessfully!!",
            status
        })
    },

    //-------------------------------report Section ----------------------------------------
    createreport: async function (data, callback) {
        try {

            var conversation = [];
            var da = [];
            const foundData = await messageSchema.findOne({ _id: data.chatId }).exec();
            var id = foundData.chats.map(getid);                      // all conversation id stored 
            function getid(item) {
                da.push(item);
                return item._id;
            }

            let index = id.indexOf(data.message._id);                //index and limit set
            var limit = index - 5;
            if (limit < 0) {
                limit = 0;
            };

            for (i = limit; i <= index; i++) {
                conversation.push(da[i]);                            //previous 5 chat stored
            }

            var flimit = index + 6                                        //index and limit set
            if (flimit > id.length) {
                flimit = id.length;
            };

            for (i = index + 1; i < flimit; i++) {                              //next 5 chat stored
                conversation.push(da[i]);
            };

            let a = new reportSchema({
                ...data,
                conversation: conversation
            });
            a.save((err, res) => {
                if (err) {
                    callback({
                        success: false,
                        message: "some internal error has occurred",
                        error: err
                    });
                }
                else {
                    const notification = new notificationSchema({
                        touser: data.email,
                        notificationtype: "Create Report",
                        notification: {
                            notification_subject: notificationmessage.reportsubject,
                            notification_body: notificationmessage.reportbody
                        },
                        // notificationinfo:{ 
                        //     postproperty_id: data._id,
                        // },
                    });
                    notification.save((err, res) => {
                        if (err) {
                            callback({
                                success: false,
                                message: "notificaton error",
                                err: err
                            });
                        }
                        else {
                            callback({
                                success: "true",
                                message: "You have successfully reported this user,HomeScouts will take necessary action based on our policy.",
                                conversation
                            });
                        }
                    });
                }
            });

        }
        catch (error) {

            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: error
            })
        }
    },

    //-------------------------------profile Section ----------------------------------------
    getprofile: async function (data, callback) {
        try {

            var result = await userschema.findOne({ _id: data.userId }, {
                name: 1, email: 1, mobilenumber: 1,
                user_type: 1, avatar: 1, rera_number: 1, rera_certificate: 1,
                rera_competency_certificate: 1
            });
            callback({
                success: true,
                message: "Sucessfully fetch!!!",
                result
            });
        }
        catch (err) {

            callback({
                success: false,
                message: "error!!!",
                err
            });
        }
    },
    otpsend: function (data, callback) {
        try {
            var otpcode = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
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
                        port: config.emailauth.port,
                        host: config.emailauth.smtp_host
                    });
                    var mailOptions = {
                        from: config.emailauth.email_from,
                        to: data.email,
                        subject: messages.emailSubjectOtpSentForChangePassword,
                        html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="' + 'assets/imgs/logo.png" alt="HomeScouts logo" title="HomeScouts logo" border=0;/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + data.name + ' ,<br><br> We have received your application for new password. <br><br> Your OTP is <strong>' + otpcode + '</strong> <br><br> Please Verify this OTP ASAP for security purpose. <br><br> Thank you<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2023 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
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
                                _id: data._id,
                            })
                        }
                    });
                }
                else {
                    callback({
                        success: true,
                        statuscode: 200,
                        message: messages.errorToSentOtp,
                        response: err
                    })
                }
            })
        }
        catch (err) {

            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    otpverify: function (data, callback) {
        try {
            userschema.findOne({ $and: [{ $or: [{ _id: data._id }, { email: data.email }] }, { is_verified: 1 }] }, { _id: 1, currentOtp: 1 },
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
                                message: messages.userNotFound,
                            })
                        }
                        else {
                            // Try multiple comparison methods to handle data type mismatches
                            const otpMatch = result.currentOtp === data.otp || 
                                           String(result.currentOtp) === String(data.otp) ||
                                           Number(result.currentOtp) === Number(data.otp);
                            
                            if (otpMatch) {
                                const hash = bcryptjs.hashSync(data.newpassword, saltRounds);
                                userschema.updateOne({ $or: [{ _id: data._id }, { email: data.email }] }, { $set: { password: hash, is_verified: 1 } }).exec();

                                const notification = new notificationSchema({
                                    touser: data.email,
                                    notificationtype: "otp verify for pasword change",
                                    notification: {
                                        notification_subject: notificationmessage.otpsubject,
                                        notification_body: notificationmessage.otpbody
                                    },
                                    // notificationinfo:{ 
                                    //     postproperty_id: data._id,
                                    // },
                                });
                                notification.save((err, res) => {
                                    if (err) {
                                        callback({
                                            success: false,
                                            message: "notificaton error",
                                            err: err
                                        });
                                    }
                                    else {
                                        callback({
                                            success: true,
                                            statuscode: 200,
                                            message: messages.otpVerified + " CHANGE PASSWORD!!",
                                            response: result
                                        })
                                    }
                                });




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
        catch (err) {
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    otpsendforemail: function (data, callback) {
        try {

            if (data.email != data.oldemail) {
                callback({
                    success: false,
                    statuscode: 500,
                    message: "Not authorised!!",
                    oldemail: data.oldemail,
                    yourmail: data.email
                })
            }
            var otpcode = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
            const hash = otpcode;
            userschema.updateOne(
                { email: data.oldemail },
                { $set: { currentOtp: hash } }
            ).exec(function (err, result) {
                if (!err) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: config.emailauth.user,
                            pass: config.emailauth.passKey
                        },
                        port: config.emailauth.port,
                        host: config.emailauth.smtp_host
                    });
                    var mailOptions = {
                        from: config.emailauth.email_from,
                        to: data.newemail,
                        subject: messages.emailSubjectOtpSentForChangeEmail,
                        html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="' + 'assets/imgs/logo.png" alt="HomeScouts logo" title="HomeScouts logo" border=0;/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + data.name + ' ,<br><br> We have received your application for new email. <br><br> Your OTP is <strong>' + otpcode + '</strong> <br><br> Please Verify this OTP ASAP for security purpose. <br><br> Thank you<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2023 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
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
                                message: "An OTP has been sent to your email; please proceed with the verification.",
                                _id: data._id,
                            })
                        }
                    });
                }
                else {
                    callback({
                        success: true,
                        statuscode: 200,
                        message: messages.errorToSentOtp,
                        response: err
                    })
                }
            })
        }
        catch (err) {

            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    otpverifyforemail: function (data, callback) {
        try {
            userschema.findOne({ $or: [{ _id: data._id }, { email: data.email }] }, { _id: 1, currentOtp: 1 },
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
                                message: messages.userNotFound,
                            })
                        }
                        else {
                            // Try multiple comparison methods to handle data type mismatches
                            const otpMatch = result.currentOtp === data.otp || 
                                           String(result.currentOtp) === String(data.otp) ||
                                           Number(result.currentOtp) === Number(data.otp);
                            
                            if (otpMatch) {
                                userschema.updateOne({ $or: [{ _id: data._id }, { email: data.email }] }, { $set: { email: data.newemail, is_verified: 1 } }).exec();
                                callback({
                                    success: true,
                                    statuscode: 200,
                                    message: messages.otpVerified + "Email id changed sucessfully!!",
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
        catch (err) {
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    updateprofile: async function (data, callback) {
        try {
            var result = await userschema.updateOne({ _id: data.userId }, { ...data });
            callback({
                success: true,
                message: "Sucessfully updated!!!",
                result
            });
        }
        catch (err) {
            callback({
                success: false,
                message: "error!!!",
                err
            });
        }
    },
    phonenumberotpsent: async function (data, callback) {

        try {
            // Create a request to Fast2SMS API

            const fast2smsReq = unirest("POST", config.fast2sms.url);

            // Set headers and form data
            fast2smsReq.headers({
                'authorization': config.fast2sms.authorization,
            });

            fast2smsReq.form({
                'variables_values': data.otp,
                'route': 'otp',
                'numbers': data.newnumber,
            });

            // Send the request to Fast2SMS API
            fast2smsReq.end(function (fast2smsRes) {
                if (fast2smsRes.error) {
                    console.error(fast2smsRes);
                    callback({
                        success: false,
                        message: "error",
                        error: fast2smsRes.error
                    });
                }
                callback({
                    success: true,
                    message: "SMS sent successfully!",

                });
            });

        } catch (error) {
            console.log(error);
            callback({
                success: false,
                message: "error!!!!!",
                error
            });
        }



    },
    phonenumberotpverify: function (data, callback) {
        try {
            userschema.findOne({ $or: [{ _id: data.userId }, { email: data.email }] }, { _id: 1, currentOtp: 1 },
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
                                message: messages.userNotFound,
                            })
                        }
                        else {
                            // Try multiple comparison methods to handle data type mismatches
                            const otpMatch = result.currentOtp === data.otp || 
                                           String(result.currentOtp) === String(data.otp) ||
                                           Number(result.currentOtp) === Number(data.otp);
                            
                            if (otpMatch) {

                                userschema.updateOne({ $or: [{ _id: data.userId }, { email: data.email }] }, { $set: { mobilenumber: data.newnumber, is_verified: 1 } }).exec();
                                callback({
                                    success: true,
                                    statuscode: 200,
                                    message: messages.otpVerified + "Phone Number Changed!!",
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
        catch (err) {
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    otpsentforrera: function (data, callback) {
        try {
            var otpcode = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
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
                        port: config.emailauth.port,
                        host: config.emailauth.smtp_host
                    });
                    var mailOptions = {
                        from: config.emailauth.email_from,
                        to: data.email,
                        subject: messages.emailSubjectOtpSentForRERA,
                        html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="' + 'assets/imgs/logo.png" alt="HomeScouts logo" title="HomeScouts logo" border=0;/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + data.name + ' ,<br><br> We have received your application for RERA. <br><br> Your OTP is <strong>' + otpcode + '</strong> <br><br> Please Verify this OTP ASAP for security purpose. <br><br> Thank you<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2023 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
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
                                _id: data._id,
                            })
                        }
                    });
                }
                else {
                    callback({
                        success: true,
                        statuscode: 200,
                        message: messages.errorToSentOtp,
                        response: err
                    })
                }
            })
        }
        catch (err) {

            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    otpverifyforrera: function (data, callback) {
        try {
            userschema.findOne({ $or: [{ _id: data._id }, { email: data.email }] }, { _id: 1, currentOtp: 1 },
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
                                message: messages.userNotFound,
                            })
                        }
                        else {
                            // Try multiple comparison methods to handle data type mismatches
                            const otpMatch = result.currentOtp === data.otp || 
                                           String(result.currentOtp) === String(data.otp) ||
                                           Number(result.currentOtp) === Number(data.otp);
                            
                            if (otpMatch) {
                                userschema.updateOne({ $or: [{ _id: data._id }, { email: data.email }] }, { $set: { rera_number: data.rera_number } }).exec();
                                callback({
                                    success: true,
                                    statuscode: 200,
                                    message: messages.otpVerified + "Rera number changed!!",
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
        catch (err) {
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },

    //====not used===
    otpsendforphonenumber: function (data, callback) {
        try {
            var otpcode = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
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
                        port: config.emailauth.port,
                        host: config.emailauth.smtp_host
                    });
                    var mailOptions = {
                        from: config.emailauth.email_from,
                        to: data.email,
                        subject: messages.emailSubjectOtpSentForChangephone,
                        html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body bgcolor="#ededed"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed" ><tr><td><table width="60%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF" align="center" style="border-radius:10px; border:1px solid #ededed; box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25); margin: auto;"><tr><td valign="top" align="center" style="padding: 15px"><img src="' + 'assets/imgs/logo.png" alt="HomeScouts logo" title="HomeScouts logo" border=0;/></td><tr><td valign="top" style="padding: 40px;" height="200">Hello ' + data.name + ' ,<br><br> We have received your application for new password. <br><br> Your OTP is <strong>' + otpcode + '</strong> <br><br> Please Verify this OTP ASAP for security purpose. <br><br> Thank you<br><br>Team HomeScouts</td></tr><tr><td style="padding: 15px" align="center" bgcolor="#FFF"><p style="font:normal 12px Arial, Helvetica, sans-serif;">Copyright @2023 HomeScouts, All rights reserved.</p></td></tr></table></td></tr></table></body></html>'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
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
                                _id: data._id,
                            })
                        }
                    });
                }
                else {
                    callback({
                        success: true,
                        statuscode: 200,
                        message: messages.errorToSentOtp,
                        response: err
                    })
                }
            })
        }
        catch (err) {

            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    otpverifyforphonenumber: function (data, callback) {
        try {
            userschema.findOne({ $or: [{ _id: data._id }, { email: data.email }] }, { _id: 1, currentOtp: 1 },
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
                                message: messages.userNotFound,
                            })
                        }
                        else {
                            // Try multiple comparison methods to handle data type mismatches
                            const otpMatch = result.currentOtp === data.otp || 
                                           String(result.currentOtp) === String(data.otp) ||
                                           Number(result.currentOtp) === Number(data.otp);
                            
                            if (otpMatch) {

                                userschema.updateOne({ $or: [{ _id: data._id }, { email: data.email }] }, { $set: { mobilenumber: data.newnumber, is_verified: 1 } }).exec();
                                callback({
                                    success: true,
                                    statuscode: 200,
                                    message: messages.otpVerified + "Phone Number changed!!",
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
        catch (err) {
            callback({
                success: false,
                statuscode: 500,
                message: messages.catchError,
                response: err
            })
        }
    },
    //===//


    //-------------------------------Notification Section ----------------------------------------
    getnotification: async function (data, callback) {
        try {
            var notification = await notificationSchema.find({ touser: { $in: data.email } });
            callback({
                success: true,
                message: "Sucessfully fetch notification!!!",
                notification
            });
        }
        catch (err) {
            callback({
                success: false,
                message: "error!!!",
                err
            });
        }
    },
    notificationcontroller: async function (data, callback) {
        try {
            var notificationdetails = await notificationSchema.findOne({ _id: data.id });
            if (notificationdetails.viewrs != data.email) {
                var notification = await notificationSchema.updateOne({ _id: data.id }, { $push: { viewrs: data.email }, viewsOrNot: true });
                callback({
                    success: true,
                    message: "Sucessfully read notification!!!",
                    notification
                });
            }
            else {
                callback({
                    success: true,
                    message: "Sucessfully read notification!!!",
                    notificationdetails
                });
            }
        }
        catch (err) {
            callback({
                success: false,
                message: "error!!!",
                err
            });
        }
    },

    //-------------------------------Dynamic Filter Option Section ----------------------------------------
    //     dynamicfilteroption: async function (data,callback) {
    //         try{
    //             const result = await propertypostschema.find({},{"basicdetails.typeOfProperty":1,"basicdetails.typeOfBusiness":1,"basicdetails.catagory":1,"basicdetails.subCatagory":1,"pricinganddetails.ownership":1,"aboutproperty.furnishingType":1
    //                                                              ,"aboutproperty.carpetArea":1,"aboutproperty.availableFor":1
    //                                                              ,"aboutproperty.availability.ageOfProperty":1,"aboutproperty.availableFor":1
    //                                                              ,"location.locality":1,"pricinganddetails.rentDetails":1,"pricinganddetails.securityDepositeAmmount":1,
    //                                                              "pricinganddetails.pricingDetails.expectedPrice":1,"pricinganddetails.pricingDetails.pricePerSqrft":1,
    //                                                             });

    //                                                             // const filteroption = result.map(item => {
    //                                                             //     const basicDetails = item.basicdetails;
    //                                                             //     const location = item.location;
    //                                                             //     const aboutProperty = item.aboutproperty;
    //                                                             //     const pricingDetails = item.pricinganddetails.pricingDetails;

    //                                                             //     return {
    //                                                             //       typeOfProperty: [basicDetails.typeOfProperty], // Storing as an array
    //                                                             //       locality: [location.locality], // Storing as an array
    //                                                             //       ageOfProperty: [aboutProperty.availability.ageOfProperty], // Storing as an array
    //                                                             //       carpetArea: [aboutProperty.carpetArea], // Storing as an array
    //                                                             //       furnishingType: [aboutProperty.furnishingType], // Storing as an array
    //                                                             //       expectedPrice: [pricingDetails.expectedPrice], // Storing as an array
    //                                                             //       pricePerSqrft: [pricingDetails.pricePerSqrft], // Storing as an array
    //                                                             //       ownership: [item.pricinganddetails.ownership], // Storing as an array
    //                                                             //       propertyId: [item._id] // Storing as an array
    //                                                             //     };
    //                                                             //   });
    //                        // Extracting information dynamically
    //                        const filteroption = {};

    //                        for (const item of result) {
    //                          const basicDetails = item.basicdetails;
    //                          const catagory=item.basicdetails.catagory;
    //                          const subCatagory=item.basicdetails.subCatagory;
    //                          const location = item.location;
    //                          const aboutProperty = item.aboutproperty;
    //                          const pricingDetails = item.pricinganddetails.pricingDetails;

    //                          if (!filteroption.typeOfProperty) {
    //                            filteroption.typeOfProperty = new Set();
    //                          }
    //                          filteroption.typeOfProperty.add(basicDetails.typeOfProperty);

    //                          if (!filteroption.catagory) {
    //                             filteroption.catagory = new Set();
    //                           }
    //                           filteroption.catagory.add(basicDetails.catagory);

    //                           if (!filteroption.subCatagory) {
    //                             filteroption.subCatagory = new Set();
    //                           }
    //                           filteroption.subCatagory.add(basicDetails.subCatagory);

    //                          if (!filteroption.locality) {
    //                            filteroption.locality = new Set();
    //                          }
    //                          filteroption.locality.add(location.locality);

    //                          if (!filteroption.ageOfProperty) {
    //                            filteroption.ageOfProperty = new Set();
    //                          }
    //                          filteroption.ageOfProperty.add(aboutProperty.availability.ageOfProperty);

    //                          if (!filteroption.carpetArea) {
    //                            filteroption.carpetArea = new Set();
    //                          }
    //                          filteroption.carpetArea.add(aboutProperty.carpetArea);

    //                          if (!filteroption.furnishingType) {
    //                            filteroption.furnishingType = new Set();
    //                          }
    //                          filteroption.furnishingType.add(aboutProperty.furnishingType);

    //                          if (!filteroption.expectedPrice) {
    //                            filteroption.expectedPrice = new Set();
    //                          }
    //                          filteroption.expectedPrice.add(pricingDetails.expectedPrice);

    //                          if (!filteroption.pricePerSqrft) {
    //                            filteroption.pricePerSqrft = new Set();
    //                          }
    //                          filteroption.pricePerSqrft.add(pricingDetails.pricePerSqrft);

    //                          if (!filteroption.ownership) {
    //                            filteroption.ownership = new Set();
    //                          }
    //                          filteroption.ownership.add(item.pricinganddetails.ownership);

    //                          if (!filteroption.propertyId) {
    //                            filteroption.propertyId = new Set();
    //                          }
    //                          filteroption.propertyId.add(item._id);
    //                        }

    //                        // Convert Sets to Arrays and remove duplicates
    //                        for (const key in filteroption) {
    //                          filteroption[key] = [...filteroption[key]].filter(value => value !== null && value !== "");
    //                        }

    // 
    //                          callback({
    //                                     success: true, 
    //                                     message: "fetch", 
    //                                     filteroption
    //                                   });
    //         }
    //         catch(err){
    //             
    //             callback({
    //                 success: false, 
    //                 message: "error!!!", 
    //                 err
    //             });
    //         }
    //     },
    dynamicfilteroption: async function (data, callback) {
        try {
            const dynamicoption = await propertyschema.find();
            console.log(dynamicoption);
            const result2 = await propertypostschema.find({}, {
                "pricinganddetails.ownership": 1,
                "aboutproperty.carpetArea": 1,
                "aboutproperty.furnishingType": 1,
                "aboutproperty.availableFor": 1,
                "location.locality": 1,
                "aboutproperty.availability.ageOfProperty": 1
            });

            const filteroption = {
                locality: new Set(),
                ageOfProperty: new Set(),
                carpetArea: new Set(),
                furnishingType: new Set(),
                availableFor: new Set(),
                ownership: new Set()
            };

            for (const item of result2) {
                const ageOfProperty = item.aboutproperty.availability.ageOfProperty;
                const availableFor = item.aboutproperty.availableFor;
                const locality = item.location.locality;
                const carpetArea = item.aboutproperty.carpetArea;
                const furnishingType = item.aboutproperty.furnishingType;
                const ownership = item.pricinganddetails?.ownership; // Use optional chaining to handle null values

                filteroption.locality.add(locality);
                filteroption.ageOfProperty.add(ageOfProperty);
                filteroption.carpetArea.add(carpetArea);
                filteroption.furnishingType.add(furnishingType);
                filteroption.availableFor.add(availableFor);

                if (ownership) { // Add to the set only if ownership exists
                    filteroption.ownership.add(ownership);
                }
            }

            // Convert sets to arrays and remove null values
            filteroption.locality = Array.from(filteroption.locality).filter(value => value != null);
            filteroption.ageOfProperty = Array.from(filteroption.ageOfProperty).filter(value => value != null);
            filteroption.carpetArea = Array.from(filteroption.carpetArea).filter(value => value != null);
            filteroption.furnishingType = Array.from(filteroption.furnishingType).filter(value => value != null);
            filteroption.availableFor = Array.from(filteroption.availableFor).filter(value => value != null);
            filteroption.ownership = Array.from(filteroption.ownership).filter(value => value != null);


            callback({
                success: true,
                message: "fetch",
                dynamicoption,
                filteroption
            });
        }
        catch (err) {

            callback({
                success: false,
                message: "error!!!",
                err
            });
        }
    },
    //-------------------------------Contact form Section ----------------------------------------
    contact: async function (data, callback) {
        try {
            const newmessage = new contactSchema({
                ...data,
            });
            newmessage.save((err, res) => {
                if (err) {
                    callback({
                        success: false,
                        message: messages.databaseSaveError,
                        err: err
                    })
                }
                else {
                    callback({
                        success: true,
                        res
                    })
                }
            });
        }
        catch (err) {
            callback({
                success: false,
                message: "error!!!",
                err
            });
        }
    },

    test: async function (data, aaa) {
        try {
            const newmessage = new contactSchema({
                ...data,
            });
            newmessage.save((err, res) => {
                if (err) {
                    callback({
                        success: false,
                        message: messages.databaseSaveError,
                        err: err
                    })
                }
                else {
                    callback({
                        success: true,
                        res
                    })
                }
            });
        }
        catch (err) {
            aaa({
                success: false,
                message: "error!!!",
                err
            });
        }
    },

}


module.exports = userService;  