const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

console.log("connecting to", uri);

mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then((result) => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB", error.message);
	});

const entrySchema = new mongoose.Schema({
	name: String,
	number: String,
});

module.exports = mongoose.model("Entry", entrySchema);
