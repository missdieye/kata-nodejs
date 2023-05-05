const mongoose = require("mongoose");
const { Schema } = mongoose;
const Level = new Schema({
	level: { type: String, enum: ["not vaccinated", "recent case of covid", "vaccinated"], required: true }
});

module.exports = mongoose.model("Level", Level);
