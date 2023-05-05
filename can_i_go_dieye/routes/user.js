const express = require("express");
const userController = require("../controllers/user");
const app = express();
const bodyParser = require("body-parser");

//  middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// get all users
app.get("/users", userController.getAllUsers);

// get a user by id
app.get("/users/:id", userController.getUserById);

// create a user
app.post("/user", urlencodedParser, userController.createUser);

// update a user
app.put("/users/:id", urlencodedParser, userController.updateUser);

// delete a user
app.delete("/users/:id", userController.deleteUser);

module.exports = app;
