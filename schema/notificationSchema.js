const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Create notificationSchema

var notificationSchema = new mongoose.Schema({
    touser:[{type:String}],
    viewrs:[{type:String}],
    viewsOrNot:{type:Boolean,default:false},
    notificationtype:{type: String},
    notification:{ 
        notification_subject: {type: String},
        notification_body: {type: String}
    },
    notificationinfo:{ 
        services_id: {type: String},
        postproperty_id: {type: String},
        usrer_id: {type: String}
    },
  
},{
    timestamps: true
});


module.exports = mongoose.model("notificationSchema", notificationSchema);

