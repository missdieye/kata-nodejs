const express = require("express");
const placeController = require("../controllers/place");
const app = express();
const bodyParser = require("body-parser");
const Services = require("../services/services");

//  middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// get all places
app.get("/places", Services.checkTokenValidity, placeController.getAllPlaces);

// get a place by id
app.get("/places/:id", Services.checkTokenValidity, placeController.getPlaceById);

// create a place
app.post("/place", Services.checkTokenValidity, urlencodedParser, placeController.createPlace);

// update a place
app.put("/places/:id", Services.checkTokenValidity, urlencodedParser, placeController.updatePlace);

// delete a place
app.delete("/places/:id", Services.checkTokenValidity, placeController.deletePlace);

// places i can go
app.post("/placesicanigo", Services.checkTokenValidity, Services.checkUserAccessRole, urlencodedParser, placeController.placesICanGo);

module.exports = app;
