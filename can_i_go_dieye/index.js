const cors = require("cors");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");
const db = require("./config/db");
const app = express();
// routes
const userRoutes = require("./routes/user");
const passRoutes = require("./routes/pass");
const placeRoutes = require("./routes/place");
// models
const userModel = require("./models/user");
const passModel = require("./models/pass");
const placeModel = require("./models/place");
const levelModel = require("./models/level");
// data
let levels = require("./data/levels.json");
let places = require("./data/places.json");
let users = require("./data/users.json");

app.use(express.json());

app.use(cors());

// call routers
app.use(userRoutes);
app.use(passRoutes);
app.use(placeRoutes);

// add data to db if not exist

// create levels
for (let i = 0; i < levels.length; i++) {
	levelModel.findOne({ level: levels[i].level }).then((result) => {
		if (!result) {
			levelModel.create(levels[i]);
			console.log(levels[i].level + " created");
		}
	});
}

// create places
for (let i = 0; i < places.length; i++) {
	placeModel.findOne({ name: places[i].name }).then((result) => {
		if (!result) {
			levelModel.findOne({ level: places[i].minPassLevel }).then((level) => {
				places[i].minPassLevel = level._id;
				placeModel.create(places[i]);
			});
			console.log(places[i].name + " created");
		}
	});
}

// create users
for (let i = 0; i < users.length; i++) {
	try {
		userModel.findOne({ phoneNumber: users[i].phoneNumber }).then((result) => {
			if (!result) {
				// search level
				levelModel.findOne({ level: users[i].level }).then((level) => {
					console.log("level", level);
					// create pass
					passModel
						.create({
							level: level._id
						})
						.then((pass) => {
							users[i].passId = pass._id;
							userModel.create(users[i]);
						});
				});
				console.log(users[i].firstName + " " + users[i].lastName + " created");
			}
		});
	} catch (e) {
		console.log(e);
	}
}

// update places in swagger
const updateSwaggerEnumPlace = async () => {
	try {
		const places = await placeModel.find();
		const enumValues = places.map((place) => place.name + " - address: " + place.address);
		// update swagger enum places in swagger.json
		try {
			swaggerDocument.components.schemas.Canigo.properties.place.enum = enumValues;
		} catch (error) {
			console.error(error);
		}

		console.log("Swagger enum places updated successfully!");
	} catch (error) {
		console.error(error);
	}
};

// call updateSwaggerEnumPlace() and wait for it to finish
updateSwaggerEnumPlace().then(() => {
	// call swagger
	app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	app.listen(8000, () => {
		console.log(`App server now listening on port ${8000}`);
	});
});
