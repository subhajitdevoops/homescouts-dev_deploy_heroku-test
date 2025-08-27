const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


var messageSchema = new mongoose.Schema({
    //chatId: {type: String},
	chat_user: [],
    chats:[{
        user_id:{type:String},
        name:{type:String},
        messagetype:{type:String,enum:['enquiry','chat']},
        message:{type:String},
        date_time:{type:Date},
        medialink:{type:String,allow:null},
        deletion_info:{
            is_deleted:{type:Boolean,default:false},
            delete_for:{userId:[{type:mongoose.Types.ObjectId}],deletion_time:{type:Date,default:Date.now()}},
        },
        viewedOrNot:{type: Boolean,default:false}
    }],
    block_info:{
        is_block:{type: Boolean,default:false},
        block_by:{userId:{type:mongoose.Types.ObjectId,allow:null,default:null},
        block_time:{type:Date,default:Date.now()}},
    },
   
    is_active:{type: Boolean,default:true},


    room_deletion_info:[
        {
        deleted_by:{type:mongoose.Types.ObjectId,allow:null,default:null},
        deleted_chat_length:{type:Number},
        deletion_time:{type:Date,default:Date.now()}
    }],
  

},{
    timestamps: true
});


module.exports = mongoose.model("messageSchema", messageSchema);

