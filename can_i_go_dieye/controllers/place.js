const levelModel = require("../models/level");
const placeModel = require("../models/place");
const userModel = require("../models/user");
const Services = require("../services/services");

// get all places
exports.getAllPlaces = async (req, res) => {
	try {
		const places = await placeModel.find();
		if (!places) return res.status(404).send("No places found");
		res.status(200).send(places);
	} catch (err) {
		res.status(500).send(err);
	}
};

// get a place by id
exports.getPlaceById = async (req, res) => {
	try {
		const place = await placeModel.findById(req.params.id);
		if (!place) return res.status(404).send("No place found");
		res.status(200).send(place);
	} catch (err) {
		res.status(500).send(err);
	}
};

// create a place
exports.createPlace = async (req, res) => {
	try {
		// get level id
		const level = await levelModel.findOne({ level: req.body.minPassLevel });
		if (!level) return res.status(404).send("No level found! 3 levels are possible: not vaccinated, recent case of covid, vaccinated ");
		req.body.minPassLevel = level._id;
		console.log("req.body.minPassLevel", req.body.minPassLevel);
		const place = new placeModel(req.body);
		await place.save();
		res.status(201).send(place);
	} catch (err) {
		res.status(500).send(err);
	}
};

// update a place
exports.updatePlace = async (req, res) => {
	try {
		// delete if null value is passed
		for (let key in req.body) {
			if (req.body[key] === "") {
				delete req.body[key];
			}
		}
		if (req.body.minPassLevel) {
			const level = await levelModel.findOne({ level: req.body.minPassLevel });
			if (!level) return res.status(404).send("No level found! 3 levels are possible: not vaccinated, recent case of covid, vaccinated ");
			req.body.minPassLevel = level._id;
		}
		const place = await placeModel.updateOne({ _id: req.params.id }, req.body);
		if (!place) return res.status(404).send("No place found");
		// get updated place
		const updatedPlace = await placeModel.findById(req.params.id);
		res.status(200).send(updatedPlace);
	} catch (err) {
		res.status(500).send(err);
	}
};

// delete a place
exports.deletePlace = async (req, res) => {
	try {
		const place = await placeModel.deleteOne({ _id: req.params.id });
		if (!place) return res.status(404).send("No place found");
		res.status(204).send(place);
	} catch (err) {
		res.status(500).send(err);
	}
};

// which places can I go ?
exports.placesICanGo = async (req, res) => {
	try {
		// console.log("req.body", req.body);
		const user = await userModel.findById(req.body.userId).populate("passId");
		if (!user) return res.status(404).send("No user found");
		const levelPassUser = await levelModel.findById(user.passId.level);
		if (!levelPassUser) return res.status(404).send("No level found");
		let canGoRecentCase = true;
		if (levelPassUser.level == "recent case of covid") {
			canGoRecentCase = await Services.checkIfUserHaveTemporaryPass(user.passId.dateOfCovid);
		}
		let placesNameAndAddressAndLevel;
		let places = [];
		if (levelPassUser.level === "not vaccinated") {
			places = await placeModel.find({ minPassLevel: levelPassUser._id, minAge: { $lte: user.age } });
		} else if (canGoRecentCase) {
			places = await placeModel.find({ minAge: { $lte: user.age } }).populate("minPassLevel");
		}
		console.log("places", places);
		if (places.length === 0) return res.status(200).send("You can't go anywhere!");
		placesNameAndAddressAndLevel = places.map(
			(place) =>
				"- " +
				place.name +
				"; address: " +
				place.address +
				"; minimal level: " +
				place.minPassLevel.level +
				"; minimal age: " +
				place.minAge +
				"\n"
		);
		placesNameAndAddressAndLevel = placesNameAndAddressAndLevel.join("");
		res.status(200).send("Places you can go:\n" + placesNameAndAddressAndLevel);
	} catch (err) {
		res.status(500).send(err);
	}
};
