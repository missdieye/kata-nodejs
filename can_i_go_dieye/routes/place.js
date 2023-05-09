const express = require("express");
const placeController = require("../controllers/place");
const app = express();
const bodyParser = require("body-parser");

//  middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// get all places
app.get("/places", placeController.getAllPlaces);

// get a place by id
app.get("/places/:id", placeController.getPlaceById);

// create a place
app.post("/place", urlencodedParser, placeController.createPlace);

// update a place
app.put("/places/:id", urlencodedParser, placeController.updatePlace);

// delete a place
app.delete("/places/:id", placeController.deletePlace);

// places i can go
app.post("/placesicanigo", urlencodedParser, placeController.placesICanGo);

module.exports = app;
