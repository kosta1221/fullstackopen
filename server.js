require("dotenv").config({ path: __dirname + "/uri.env" });
const express = require("express");
const morgan = require("morgan");
const Entry = require("./models/Entry");
const PORT = process.env.PORT || 3001;
const app = express();

morgan.token("person", (req) => {
	return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :person"));

app.use(express.static("./client/build"));

app.use(express.json());

// returns a hardcoded list of phonebook entries from /api/persons
app.get("/api/persons", (req, res) => {
	Entry.find({}).then((entries) => {
		res.status(200).json(entries);
	});
});

// GET route to /info returns info about the phonebook
app.get("/info", (req, res) => {
	const responseString = `<strong style="color:blue;">Phonebook has info for ${
		phonebookEntries.length
	} people.<br /> ${new Date()}</strong>`;

	res.status(200).send(responseString);
});

// GET route to /api/persons/:id returns info about the person with that id
app.get("/api/persons/:id", (req, res) => {
	const { id } = req.params;

	Entry.findById(id).then((note) => {
		res.json(note);
	});

	/* if (foundEntry) {
		res.status(200).json(foundEntry);
	} else {
		res.status(404).end();
	} */
});

// POST route to /api/persons adds a new entry
app.post("/api/persons", (req, res) => {
	if (!req.body.name) {
		console.log("error: Entry must have a name!");
		return res.json({ error: "Entry must have a name!" });
	}

	if (!req.body.number) {
		console.log("error: Entry must have a phone number!");
		return res.json({ error: "Entry must have a phone number!" });
	}

	/* if (phonebookEntries.map((entry) => entry.name).includes(req.body.name)) {
		console.log("error: That name already exists!");
		return res.json({ error: "That name already exists!" });
	} */

	const newEntry = new Entry({ name: req.body.name, number: req.body.number });
	newEntry.save().then((savedEntry) => {
		res.json(savedEntry);
	});
});

// DELETE route to /api/persons/:id deletes an entry by id
app.delete("/api/persons/:id", (req, res) => {
	const { id } = req.params;
	console.log(typeof id);
	const lengthBeforeAttemptedDeletion = phonebookEntries.length;

	phonebookEntries = phonebookEntries.filter((entry) => entry.id !== +id);

	if (lengthBeforeAttemptedDeletion === phonebookEntries.length + 1) {
		res.status(204).end();
	} else {
		res.status(404).end();
	}
});

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.listen(() => {
	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
});
