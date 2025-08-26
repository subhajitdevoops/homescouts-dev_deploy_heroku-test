const express = require("express");
const app = express();
const swaggerSetup = require('../swagger/swaggerConfig');


//==============Generate Swagger documentation===============//
app.use(swaggerSetup);

//================User Routing=================//

const userAuthRoute = require("./userAuthRoute");
app.use("/user", userAuthRoute);

const userServiceRoute = require("./userServiceRoute");

app.use("/userService", userServiceRoute);

//================Admin Routing=================//

const adminAuthRoute = require("./adminAuthRoute");
app.use("/admin", adminAuthRoute);

const adminServiceRoute = require("./adminServiceRoute");
app.use("/adminservice", adminServiceRoute);

//================Common Routing=================//

const commonServiceRoute = require("./commonServiceRoute");
app.use("/commonService", commonServiceRoute);


module.exports=app;