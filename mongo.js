const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("Please provide the password as an argument: node mongo.js <password>");
	process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://kosta1221:${password}@cluster0.2znao.mongodb.net/phonebook-app?retryWrites=true&w=majority&ssl=true`;

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

const entrySchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Entry = mongoose.model("Entry", entrySchema);

if (process.argv.length === 3) {
	console.log("phonebook:");
	Entry.find({}).then((result) => {
		result.forEach((entry) => {
			console.log(entry);
		});
		mongoose.connection.close();
	});
} else if (process.argv.length === 5) {
	const entry = new Entry({
		name: name,
		number: phoneNumber,
	});

	entry.save().then(() => {
		console.log(`added ${name} number ${phoneNumber} to phonebook`);
		mongoose.connection.close();
	});
}
