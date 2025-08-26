const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { boolean } = require('joi');
const cron = require('node-cron');


var propertypostschema = new mongoose.Schema({

      userId:{type:mongoose.Types.ObjectId,required:true},
      is_verified:{type:Boolean,default:false},  
      is_feacher:{type:Boolean,default:false},  
      feacher_validity:{type:String,default:null},
      feacherValidOrNot:{type:Boolean,default:false},
      is_active:{type:Boolean},            
      is_completed:{type:Boolean},  
      step:{type:String},
      admin_approval:{type:String,enum:['pending','approved','rejected']},
      sortlist:[{type:mongoose.Types.ObjectId}],

            // BasicDetails
            basicdetails:{  
                    typeOfBusiness:{type:String,enum:['sell', 'rent/lease','pg']},        //sell/rent
                    typeOfProperty: {type:String},     //com,residential
                    catagory: {type:String},                                              //office,retail                                  
                    subCatagory:{type:String},                                            //factory                            
            },
            
            // location
            location:{
                apartmentAndSocity:{type:String}, 
                houseNumber:{type:String},
                locality:{type:String},
                subLocality:{type:String},
                city:{type:String},
            },
            
            //AboutProperty
            aboutproperty : {
                    roomDetails:{ 
                            noOfBedRooms:{type:Number},
                            noOfBathRooms:{type:Number},
                            noOfBalconies:{type:Number},
                            roomTypes:{type:String},
                            howManyPeople:{type:Number}
                    },
                    capacityAndAvailability:{
                        noOfBed:{type:Number},
                        noOfBedsAvailable:{type:Number},
                    },
                    attachedBathroom:{type:Boolean},
                    attachedBalcony:{type:Boolean},

                    carpetArea:{type:Number},
                    areaMessurementUnit:{type:String},
                    othersRoom:[{type:String}],
                    furnishingType :{type:String,enum:['furnished','semifurnished','unfurnished']},

                    option:[{
                        name:{type:String},
                        count:{type:Number,allow:null},
                        isAvilable:{type:Boolean,allow:null},
                    }],
                    reservedParking:{
                        CoveredParking:{
                            noOfParking:{type:Number}
                        },
                        OpenParking:{
                            noOfParking:{type:Number}
                        },
                    },

                    FloorDetails:{
                        totalNoOfFloor:{type:Number},
                        whichFloor:{type:String},
                    },
                    availableFor:{type:String},//girls,boys
                    suitablefor:[{type:String}],
                    availability:{
                        status:{type:String},
                        ageOfProperty:{type:String},
                        possessionBy:{type:String},
                    },  
            },

            uploadImages:[{
                name:{type: String},
                propertyImage:{type: String},
                isCoverImage:{type: Boolean}
            }],

            //Pricing & Others
            pricinganddetails:{
                    rera_number:{type:String,default:null},
                    rentDetails:{type:Number},
                    securityDepositeScheme:{type:String},
                    securityDepositeAmmount:{type:Number},
                    noOfMonths:{type:Number},
                    foodDetails:{type:String},
                    mealTypes:{type:String},
                    availabilityOfMealOnWeekdays:[{type:String}],
                    availabilityOfMealOnWeekends:[{type:String}],
                    someHouseRules:{
                      petsAllowed:{ type:Boolean},
                      visitorsAllowed:{ type:Boolean},
                      smokingAllowed:{ type:Boolean},
                      alcoholAllowed:{ type:Boolean},
                      partyAllowed:{ type:Boolean},
                    },
                    idealFor:[{type:String}],
                    lastEntry:{type:String},
                    haveAnyOtherRule:{type:String},
                    ownership:{type:String},
                    pricingDetails:{
                        expectedPrice:{type:Number},
                        pricePerSqrft:{type:Number},
                        advanceDeposit:{type:Number},
                    },
                    allInclusivePrice:{type: String,enum:['yes', 'no']},
                    taxandGovtChargesExcluded:{ type:String,enum: ['yes', 'no']},
                    priceNegotiable:{type: String,enum:['yes', 'no']},
                    additionalPricingDetails:{
                        Maintenance:{type:String},
                        duration:{type:String},
                        BookingPrice:{type:Number},
                        AnnualDuesPayable:{type:Number},
                    },
                    uniqueDescription:{type:String},
                    firesaleOrNot:{type:Boolean,default:false}       
                },
            property_view:{
                    count:{type:Number,default:0},
                    viewers:[],
            },    
},
{
    timestamps: true
});




module.exports = mongoose.model("PropertyPost", propertypostschema);





