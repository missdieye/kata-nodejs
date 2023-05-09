const userModel = require("../models/user");
const passModel = require("../models/pass");
const levelModel = require("../models/level");
const placeModel = require("../models/place");
const Services = require("../services/services");

// get all users
exports.getAllUsers = async (req, res) => {
	try {
		const users = await userModel.find();
		if (!users) return res.status(404).send("No users found");
		res.status(200).send(users);
	} catch (err) {
		res.status(500).send(err);
	}
};

// get a user by id
exports.getUserById = async (req, res) => {
	try {
		const user = await userModel.findById(req.params.id);
		if (!user) return res.status(404).send("No user found");
		res.status(200).send(user);
	} catch (err) {
		res.status(500).send(err);
	}
};

// create a user
exports.createUser = async (req, res) => {
	try {
		// get level id
		console.log("req.body", req.body);
		const level = await levelModel.findOne({ level: req.body.statut });
		if (!level) return res.status(404).send("No level found! 3 levels are possible: not vaccinated, recent case of covid, vaccinated ");
		// create a new pass
		const pass = await passModel.create({
			level: level._id
		});
		pass.save();
		// create a new user
		const user = new userModel({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phoneNumber: req.body.phoneNumber,
			passId: pass._id,
			address: req.body.address,
			age: req.body.age
		});
		await user.save();
		res.status(201).send(user);
	} catch (err) {
		res.status(500).send(err);
	}
};

// update a user
exports.updateUser = async (req, res) => {
	try {
		if (req.body.passId) {
			res.status(400).send("You can't update passId");
		}
		// delete if null value is passed
		for (let key in req.body) {
			if (req.body[key] === "") {
				delete req.body[key];
			}
		}
		const user = await userModel.updateOne({ _id: req.params.id }, req.body);
		if (!user) return res.status(404).send("No user found");
		// get the updated user
		const updatedUser = await userModel.findById(req.params.id);
		console.log("user", user);
		res.status(200).send(updatedUser);
	} catch (err) {
		res.status(500).send(err);
	}
};

// delete a user
exports.deleteUser = async (req, res) => {
	try {
		const user = await userModel.deleteOne({ _id: req.params.id });
		if (!user) return res.status(404).send("No user found");
		res.status(204).send(user);
	} catch (err) {
		res.status(500).send(err);
	}
};

// check if a user can go to a place
exports.canIGo = async (req, res) => {
	try {
		const user = await userModel.findById(req.body.userId).populate("passId");
		if (!user) return res.status(404).send("No user found");
		let place;
		// search place if swagger is used
		if (req.body.place) {
			let placeName = req.body.place.split(" - ")[0];
			let placeAddress = req.body.place.split(" - address: ")[1];
			place = await placeModel.findOne({ name: placeName, address: placeAddress });
		} else {
			place = await placeModel.findById(req.body.placeId);
		}
		if (!place) return res.status(404).send("No place found");
		// search level of the user pass and the level of the place
		const levelPassUser = await levelModel.findById(user.passId.level);
		if (!levelPassUser) return res.status(404).send("No level found for this user");
		const levelPlace = await levelModel.findById(place.minPassLevel);
		if (!levelPlace) return res.status(404).send("No level found FOR this place");
		// console.log("place", place, levelPassUser);
		// compare levels
		if (place.minAge <= user.age) {
			let canGoRecentCase = true;
			if (levelPassUser.level == "recent case of covid") {
				canGoRecentCase = await Services.checkIfUserHaveTemporaryPass(user.passId.dateOfCovid);
			}
			if (
				levelPlace.level == "not vaccinated" ||
				levelPassUser.level == levelPlace.level ||
				(levelPlace.level == "vaccinated" && canGoRecentCase)
			) {
				res.status(200).send(
					"You can go to this place. The level of your pass is " +
						levelPassUser.level +
						" and the minimal level of this place is " +
						levelPlace.level +
						"."
				);
			} else if (!canGoRecentCase) {
				res.status(200).send(
					"You can't go to this place. The level of your pass is " +
						levelPassUser.level +
						". Your covid is recent, you have to wait 14 days or your covid is older than 4 months, you have to get vaccinated."
				);
			} else {
				res.status(200).send(
					"You can't go to this place. You are not vaccinated. The level of your pass is " +
						levelPassUser.level +
						" and the minimal level of this place is " +
						levelPlace.level +
						"."
				);
			}
		} else {
			res.status(200).send("You can't go to this place. You are too young");
		}
	} catch (err) {
		res.status(500).send(err);
	}
};
