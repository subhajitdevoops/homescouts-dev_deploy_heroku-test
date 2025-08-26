const propertypostschema = require('../schema/propertypostschema');

const postPropertyPendingOrnot = async (req, res, next) => {
    try{
        const data = req.body;
        
              var pendingData=  await propertypostschema.find({ userId: data.userId , is_active:0 }).exec();
              if(pendingData){
                res.send({
                    success: true,
                    statuscode: 200,
                    message:"Alreday exist!!",
                    pendingData
                })
              }
              else{
                next();
              }
    }
    catch(err){
        res.send({
            success: false,
            statuscode: 500,
            error: err
        })
    }   
}

module.exports = {postPropertyPendingOrnot};