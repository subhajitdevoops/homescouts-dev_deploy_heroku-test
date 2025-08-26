const mongoose = require('mongoose');


var report = new mongoose.Schema({
        userId:{type:mongoose.Types.ObjectId,required:true},
        personId:{type:mongoose.Types.ObjectId,required:true},
        chatId:{type:mongoose.Types.ObjectId,required:true},
        message:{
            _id:{type:String},
            text:{type:String}
        },
        conversation : [{
            user_id:{type:String},
            name:{type:String},
            _id:{type:String},
            message:{type:String},
            date_time:{type:String},
            medialink:{type:String},
        }],
        adminAction:{type:String,default:"pending",enum:["pending",'resolved','reject']},
        adminComment:{type:String},
        userComment:{type:String}
},{
    timestamps: true
});

module.exports = mongoose.model("report", report);
