    const express= require('express');
    const mongoose = require('mongoose');
    const config = require("./config.json");
    const app = express();
    const producationString = config.producationString; //local system database
    var options = { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true};

    const connection = () => {
        mongoose.connect(producationString, options)
        .then(() => console.log("DataBase Connection Successful !!"))
        .catch(err => console.log(err + " Connection failed"));
    
        mongoose.connection.on('error', err => console.log("Alert!!! DataBase Error: ", err));
    
        mongoose.connection.on('disconnected', () => console.log("Alert!!!! Database disconnected and trying to reconnect"));
    };
  
    const portListing=()=>{
        var url = config.baseurl;
                    var port = config.port;
                    app.listen(port, function (err) {
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log("Server is running at Port" + port);
                                console.log("BaseUrl:",url);
                            }
                    });
    }
    
module.exports={connection,portListing};
