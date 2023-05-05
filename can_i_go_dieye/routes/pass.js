const express = require("express");
const passController = require("../controllers/pass");
const app = express();
const bodyParser = require("body-parser");

//  middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// get all passes
app.get("/passes", passController.getAllPasses);

// get a pass by id
app.get("/passes/:id", passController.getPassById);

// create a pass
app.post("/pass", urlencodedParser, passController.createPass);

// update a pass
app.put("/passes/:id", urlencodedParser, passController.updatePass);

// delete a pass
app.delete("/passes/:id", passController.deletePass);

module.exports = app;
