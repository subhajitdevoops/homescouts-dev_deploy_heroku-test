const userschema = require('../schema/userschema');

const userExistOrNot = async (req, res, next) => {
    try{
              const data = req.body;
              var userdata=  await userschema.findOne({_id: data.receiverId}).exec();
              if(userdata ==null || userdata ==undefined || userdata ==[]){
                return(res.send({
                    success: false,
                    statuscode: 400,
                    message:"Seller not exist!!",
                }))
              }
              else{
                next();
              }
    }catch(err){
        console.log(err);
        return(res.send({
            success: false,
            statuscode: 500,
            error: err
        }))
    }   
}

module.exports = {userExistOrNot};