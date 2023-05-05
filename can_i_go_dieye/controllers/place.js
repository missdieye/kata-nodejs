const levelModel = require("../models/level");
const placeModel = require("../models/place");

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
