const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	age: { type: Number, required: true },
	phoneNumber: { type: String, required: true },
	address: { type: String, required: true },
	passId: { type: Schema.Types.ObjectId, ref: "Pass" }
});

module.exports = mongoose.model("User", User);
