const serviceSchemaSettings = require('../schema/serviceSchemaSettings');
const existornot=async (req,res,next)=>{
    try{
        const data = req.body;
            const foundData = await serviceSchemaSettings.findOne({ _id: data._id}).exec();
            if (foundData) {
                next();
            }
            else{
                res.send({
                        success: false,
                        statuscode: 500,
                        message: "no such data found!!!",
                        response: {}
                    });
            }
    }
    catch(err){
        res.send({
            success: false,
            statuscode: 500,
            message: "error!!!",
            response: err
        });
    }
}

module.exports = existornot