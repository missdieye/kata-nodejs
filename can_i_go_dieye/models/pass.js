const mongoose = require("mongoose");
const { Schema } = mongoose;
const Pass = new Schema({
	level: { type: Schema.Types.ObjectId, ref: "Level" },
	created_at: { type: Date, required: true, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Pass", Pass);
