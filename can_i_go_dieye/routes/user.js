const express = require("express");
const userController = require("../controllers/user");
const app = express();
const bodyParser = require("body-parser");
const Services = require("../services/services");

//  middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// authentification
app.post("/authentification/:id", userController.authentification);
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// get all users
app.get("/users", Services.checkTokenValidity, Services.checkUserAccessRole, userController.getAllUsers);

// get a user by id
app.get("/users/:id", Services.checkTokenValidity, Services.checkUserAccessRole, userController.getUserById);

// create a user
app.post("/user", Services.checkTokenValidity, Services.checkUserAccessRole, urlencodedParser, userController.createUser);

// update a user
app.put("/users/:id", Services.checkTokenValidity, Services.checkUserAccessRole, urlencodedParser, userController.updateUser);

// delete a user
app.delete("/users/:id", Services.checkTokenValidity, Services.checkUserAccessRole, userController.deleteUser);

// can i go
app.post("/canigo", Services.checkTokenValidity, Services.checkUserAccessRole, urlencodedParser, userController.canIGo);

module.exports = app;
