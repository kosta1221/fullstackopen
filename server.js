const express = require("express");
const morgan = require("morgan");

const PORT = process.env.PORT || 3001;
const app = express();

let phonebookEntries = [
	{ id: 1, name: "Arto Hellas", number: "040-123456" },
	{ id: 2, name: "Ada Lovelace", number: "349-1234-1564" },
	{ id: 3, name: "Izhak Dadashev", number: "050-1235851" },
	{ id: 4, name: "Bojack Horseman", number: "054-6594300" },
];

morgan.token("person", (req) => {
	return JSON.stringify({ name: req.body.name, number: req.body.number });
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :person"));
app.use(express.json());

// returns a hardcoded list of phonebook entries from /api/persons
app.get("/api/persons", (req, res) => {
	res.status(200).json(phonebookEntries);
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

	const foundEntry = phonebookEntries.find((entry) => entry.id === +id);

	if (foundEntry) {
		res.status(200).json(foundEntry);
	} else {
		res.status(404).end();
	}
});

// POST route to /api/persons adds a new entry
app.post("/api/persons", (req, res) => {
	const randomNewId = getRandomInt(10, 1000000);

	if (!req.body.name) {
		console.log("error: Entry must have a name!");
		return res.json({ error: "Entry must have a name!" });
	}

	if (!req.body.number) {
		console.log("error: Entry must have a phone number!");
		return res.json({ error: "Entry must have a phone number!" });
	}

	if (phonebookEntries.map((entry) => entry.name).includes(req.body.name)) {
		console.log("error: That name already exists!");
		return res.json({ error: "That name already exists!" });
	}

	const newEntry = { id: randomNewId, name: req.body.name, number: req.body.number };
	phonebookEntries.push(newEntry);
	console.log(`Created new entry with id ${newEntry.id}`);
	res.json(newEntry);
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
