const mongoose = require('mongoose');
var applyForServices = new mongoose.Schema({

    
        userId:{type:mongoose.Types.ObjectId,required:true},
        service_offering_title : {type: String,required:true},
        select_your_offering :{type: String,required:true},
        documents_details:[{
            name:{type:String},
            documents:{type:String}
        }],
        add_offering_location:[{type:String}],
        snapsort_offering:[{type:String}],
        admin_approval:{type:String,enum:['pending','approved','rejected'],default:"pending"},
        sortlist:[{type:mongoose.Types.ObjectId}],
        is_active:{type:Boolean,default:false},
        service_view:{
            count:{type:Number,default:0},
            viewers:[],
        },
    
},{
    timestamps: true
});

module.exports = mongoose.model("applyForServices", applyForServices);
