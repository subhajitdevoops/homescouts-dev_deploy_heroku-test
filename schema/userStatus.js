const mongoose = require('mongoose');

var userStatus = new mongoose.Schema({
        userId:{type:mongoose.Types.ObjectId,required:true},
        viewers:[],
        media : [{
            name:{type:String},
            link:{type:String},
        }],
        location:{type:String},
        is_active:{type:Boolean,default:true}
    
    
},{
    timestamps: true
});

module.exports = mongoose.model("userStatus", userStatus);
