const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Create userSchema

var userschema = new mongoose.Schema({
    avatar: {type: String},
    name: {type: String},
	email: {type: String},
    mobilenumber: {type: Number},
    user_type :{type:String, enum: ['individual', 'business','admin']},
    rera_number:{type:String,default:null},
    password: {type: String},
    currentOtp:{type: String},
    is_active:{type: Boolean,default:true},
    block_by_admin:{type:{type:String,default:null,enum:['temporary','permanent',null]},block_time:{type:Date,default:null}},
    is_verified:{type: Number,default:0},
    termandcondition:{type:Boolean},
    rera_certificate:{type: String},
    rera_competency_certificate:{type: String},
    currentOtp:{type: String},
},{
    timestamps: true
});


module.exports = mongoose.model("user", userschema);

