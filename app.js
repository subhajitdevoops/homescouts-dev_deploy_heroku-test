const express = require("express");
const app = express();
const dbConnection = require("./config/dbConnection");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const setupSocket = require("./config/socketConnection");
const config = require("./config/config.json");
var ImageKit = require("imagekit");
const imagekit = new ImageKit(config.ImageKit);
const PropertyPost = require('./schema/propertypostschema'); 
const { preSaveMiddleware, startCronJob } = require('./helper/propertyMiddleware.js'); 

//==============Use CORS===============//
    app.use(cors());

//==============For Media Access or Serve static files===============//
    app.use("/media", express.static(path.join(__dirname, "/upload")));

    app.use("/",express.static(path.join(__dirname, "/public/build")));

//==============Enable CORS===============//
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,x-client-key,x-client-token,x-client-secret,Authorization"
      );
      next();
    });

//==============Parse JSON and URL-encoded bodies which are needed for REST API's===============//
    app.use(
      bodyParser.json({
        limit: "200000kb",
        extended: true,
        parameterLimit: 200000 * 100,
      })
    );
    app.use(
      bodyParser.urlencoded({
        limit: "200000kb",
        extended: true,
        parameterLimit: 200000 * 100,
      })
    );

//============================Port Listening================================//
    const server = app.listen(config.port, () => {
      console.log("Server is running at port "+config.port);
    });
   
//============================== Socket ====================================//
    setupSocket(server,config.socketPort);

//============================Connected to MongoDb==========================//
    dbConnection.connection();
     
//============================Port Listening================================//
   //dbConnection.portListing();

//================Corn job for Property deactive or deletion================//
    PropertyPost.schema.pre('save', preSaveMiddleware);
    startCronJob.start();

//====================== Load the ImageKit Auth Route =======================//
    app.use("/auth",  (req, res) => {
      try{
        var authenticationParameters = imagekit.getAuthenticationParameters();
        console.log("=================="+authenticationParameters);
        res.send(authenticationParameters);
      }catch(err){
        console.log("error in auth imagekit!!!!!!!!!!!!!!!");
      }
    
    });
    
//=========================== Load the routes ==============================//
     var indexRoute = require("./routes/indexRoute.js");
     app.use("/api", indexRoute);