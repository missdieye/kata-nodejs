const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_USERNAME, MONGO_DBNAME, MONGO_PASSWORD, MONGO_HOSTNAME, MONGO_PORT, MONGO_SRV } = process.env;
if (MONGO_SRV === "true") {
	uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/${MONGO_DBNAME}?retryWrites=true&w=majority`;
} else {
	uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DBNAME}?authSource=admin`;
}

async function run() {
	try {
		await mongoose.connect(uri, { useNewUrlParser: true });
		console.log("Connected successfully to mongoDB");
	} catch (error) {
		console.log("Error connecting to mongoDB");
	}
}
run().catch(console.dir);
