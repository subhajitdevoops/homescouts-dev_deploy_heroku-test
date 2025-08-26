const mongoose = require('mongoose');
var contactSchema = new mongoose.Schema({

        name:{type:String,required:true},
        email:{type:String,required:true},
        subject:{type:String},
        company:{type:String},
        service:{type:String},
        message:{type:String,required:true},
},{
    timestamps: true
});

module.exports = mongoose.model("contactSchema", contactSchema);
