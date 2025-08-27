const { messages } = require("./helper/constant-messages");
const multer  = require('multer');
const path  = require('path');
var crypto = require('crypto');


process.on('message', (message) => {
 async (req,res,next)=>{
      
            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                  if(req.query.step=="dynamichomepage"){
                           var location ='./upload/dynamichomepage';
                           cb(null, location);
                         }
                         else if(req.query.step=="applyforservice"){
                           var location ='./upload/applyforservice';
                           cb(null, location);
                         }
                         else if(req.query.step=="logo"){
                           var location ='./upload/logo';
                           cb(null, location);
                         }
                         else if(req.query.step=="postproperty"){
                           var location ='./upload/postproperty';
                           cb(null, location);
                         }
                         else if(req.query.step=="serviceSettings"){
                           var location ='./upload/serviceSettings';
                           cb(null, location);
                         }
                         else if(req.query.step=="status"){
                          var location ='./upload/status';
                          cb(null, location);
                        }
                        else if(req.query.step=="avatar"){
                          var location ='./upload/avatar';
                          cb(null, location);
                        }
                         else{
                           var location ='./upload';
                           cb(null, location);
                         }
                },
                filename: function (req, file, cb) {
                      
                       crypto.pseudoRandomBytes(16, function (err, raw) {
                       if (err) return cb(err)
                       var files= raw.toString('hex') + path.extname(file.originalname);
                         cb(null, files);
                       })
                },
            });
             
            const maxSize = 1 * 1000000000000000 * 1000000000000;

            var upload = multer({ 
                storage: storage,
                limits: { fileSize: maxSize },
                fileFilter: function (req, file, cb){
                    // Set the filetypes, it is optional
                    var filetypes = /jpeg|jpg|png|pdf/;
                    var mimetype = filetypes.test(file.mimetype);
                    var extname = filetypes.test(path.extname(
                                file.originalname).toLowerCase());
                    if (mimetype && extname) {
                        return cb(null, true);
                    }
                    cb("Error: File upload only supports the "
                            + "following filetypes - " + filetypes);
                  }
            }).array('files', 12);

            upload(req,res,function(err) {
                if(err) {
                  //
                  res.send(err)
                }
                else {
                 // 
                 process.send(res)
                }
                
            });
}
process.send(message);
});



// const fileUpload=async (req,res,next)=>{
      
//             var storage = multer.diskStorage({
//                 destination: function (req, file, cb) {
//                   if(req.query.step=="dynamichomepage"){
//                            var location ='./upload/dynamichomepage';
//                            cb(null, location);
//                          }
//                          else if(req.query.step=="applyforservice"){
//                            var location ='./upload/applyforservice';
//                            cb(null, location);
//                          }
//                          else if(req.query.step=="logo"){
//                            var location ='./upload/logo';
//                            cb(null, location);
//                          }
//                          else if(req.query.step=="postproperty"){
//                            var location ='./upload/postproperty';
//                            cb(null, location);
//                          }
//                          else if(req.query.step=="serviceSettings"){
//                            var location ='./upload/serviceSettings';
//                            cb(null, location);
//                          }
//                          else if(req.query.step=="status"){
//                           var location ='./upload/status';
//                           cb(null, location);
//                         }
//                         else if(req.query.step=="avatar"){
//                           var location ='./upload/avatar';
//                           cb(null, location);
//                         }
//                          else{
//                            var location ='./upload';
//                            cb(null, location);
//                          }
//                 },
//                 filename: function (req, file, cb) {
//                       
//                        crypto.pseudoRandomBytes(16, function (err, raw) {
//                        if (err) return cb(err)
//                        var files= raw.toString('hex') + path.extname(file.originalname);
//                          cb(null, files);
//                        })
//                 },
//             });
           
//             const maxSize = 1 * 1000000000000000 * 1000000000000;

//             var upload = multer({ 
//                 storage: storage,
//                 limits: { fileSize: maxSize },
//                 fileFilter: function (req, file, cb){
//                     // Set the filetypes, it is optional
//                     var filetypes = /jpeg|jpg|png|pdf/;
//                     var mimetype = filetypes.test(file.mimetype);
//                     var extname = filetypes.test(path.extname(
//                                 file.originalname).toLowerCase());
//                     if (mimetype && extname) {
//                         return cb(null, true);
//                     }
//                     cb("Error: File upload only supports the "
//                             + "following filetypes - " + filetypes);
//                   }
//             }).array('files', 12);

//              upload(req,res,function(err) {
//                 if(err) {
//                   //
//                   res.send(err)
//                 }
//                 else {
//                  // 
//                   next();
//                 }
                
//               });

// }



//module.exports = {fileUpload};