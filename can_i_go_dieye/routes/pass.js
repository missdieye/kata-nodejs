const express = require("express");
const passController = require("../controllers/pass");
const app = express();
const bodyParser = require("body-parser");
const Services = require("../services/services");

//  middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// get all passes
app.get("/passes", Services.checkTokenValidity, Services.checkUserAccessRole, passController.getAllPasses);

// get a pass by id
app.get("/passes/:id", Services.checkTokenValidity, Services.checkUserAccessRole, passController.getPassById);

// create a pass
app.post("/pass", Services.checkTokenValidity, Services.checkUserAccessRole, urlencodedParser, passController.createPass);

// update a pass
app.put("/passes/:id", Services.checkTokenValidity, Services.checkUserAccessRole, urlencodedParser, passController.updatePass);

// delete a pass
app.delete("/passes/:id", Services.checkTokenValidity, Services.checkUserAccessRole, passController.deletePass);

module.exports = app;
