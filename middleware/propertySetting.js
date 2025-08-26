const propertyschema = require('../schema/propertyschema');


const propertySetting=async function(req,res,next){
    console.log("propertySetting");
    if(req.body._id){
        var foundData=await propertyschema.findOne({_id:req.body.id}).exec();
        if(foundData){
            
            req.body.foundData=foundData;
            
        }
        next();
    }
    next(); 
   

}

module.exports = propertySetting