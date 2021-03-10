const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
	name: {
		type: String,
		minLength: 2,
		unique: true,
		required: true,
	},
	number: {
		type: String,
		required: true,
	},
});

entrySchema.plugin(uniqueValidator);

entrySchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Entry", entrySchema);
