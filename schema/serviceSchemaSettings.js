const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var serviceSchemaSettings = new mongoose.Schema({

        
        is_active:{type:Boolean,default:true},
        name: {type: String,required:true},
        serviceIcon:{type: String},
        is_documents_needed:{type:Boolean,default:false},
        documents_details:[{
            help_text:{type:String},
            Guidline:{type:String}
            
        }],
        admin_approval:{type:Boolean,default:false}
    
    
},{
    timestamps: true
});

module.exports = mongoose.model("serviceSchemaSettings", serviceSchemaSettings);
