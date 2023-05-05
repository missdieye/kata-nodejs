const passModel = require("../models/pass");
const levelModel = require("../models/level");

// get all passes
exports.getAllPasses = async (req, res) => {
	try {
		const passes = await passModel.find();
		if (!passes) return res.status(404).send("No passes found");
		res.status(200).send(passes);
	} catch (err) {
		res.status(500).send(err);
	}
};

// get a pass by id
exports.getPassById = async (req, res) => {
	try {
		const pass = await passModel.findById(req.params.id);
		if (!pass) return res.status(404).send("No pass found");
		res.status(200).send(pass);
	} catch (err) {
		res.status(500).send(err);
	}
};

// create a pass
exports.createPass = async (req, res) => {
	try {
		// get level id
		const level = await levelModel.findOne({ level: req.body.level });
		if (!level) return res.status(404).send("No level found! 3 levels are possible: not vaccinated, recent case of covid, vaccinated ");
		req.body.level = level._id;
		const pass = new passModel(req.body);
		await pass.save();
		res.status(201).send(pass);
	} catch (err) {
		res.status(500).send(err);
	}
};

// update a pass
exports.updatePass = async (req, res) => {
	try {
		// search pass
		const passToFind = await passModel.findById(req.params.id);
		if (!passToFind) return res.status(404).send("No pass found");
		// req.body.level is required
		if (!req.body.level) return res.status(400).send("You must give a level");
		// get level id
		const level = await levelModel.findOne({ level: req.body.level });
		if (!level) return res.status(404).send("No level found! 3 levels are possible: not vaccinated, recent case of covid, vaccinated ");
		req.body.level = level._id;
		const pass = await passModel.updateOne({ _id: req.params.id }, { $set: req.body });
		if (!pass) return res.status(404).send("No pass found");
		// return the updated pass
		const passUpdated = await passModel.findById(req.params.id);
		console.log("passUpdated", req.params.id, passUpdated);
		res.status(200).send(passUpdated);
	} catch (err) {
		res.status(500).send(err);
	}
};

// delete a pass
exports.deletePass = async (req, res) => {
	try {
		const pass = await passModel.deleteOne({ _id: req.params.id });
		if (!pass) return res.status(404).send("No pass found");
		res.status(200).send(pass);
	} catch (err) {
		res.status(500).send(err);
	}
};
