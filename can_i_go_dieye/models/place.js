const mongoose = require("mongoose");
const { Schema } = mongoose;
const Place = new Schema({
	name: { type: String, required: true },
	address: { type: String, required: true },
	phoneNumber: { type: Number, required: true },
	minPassLevel: { type: Schema.Types.ObjectId, ref: "Level" },
	minAge: { type: Number, required: true }
});
module.exports = mongoose.model("Place", Place);
