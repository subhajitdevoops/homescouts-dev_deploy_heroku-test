const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { boolean } = require('joi');

var propertyschema = new mongoose.Schema({
    
    // typeOfBusiness: [{
    //     name:{type:String},            
        typeOfProperty: [{
                           name:{type:String},  
                           catagory:[{
                                name:{type:String},  
                                subCatagory:[{
                                    name:{type:String},  
                                }]
                            }]
              }],
            // }],

    furnishingDetails: [{
        type:{type:String}, //full semi
        amenities:[{
            name:{type:String},
            count:{type:Number,allow:null},
            isAvilable:{type:Boolean,allow:null}
        }]
        }],

},{
    timestamps: true
});

module.exports = mongoose.model("propertyoptionpost", propertyschema);

