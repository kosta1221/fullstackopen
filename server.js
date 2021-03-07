const express = require("express");

const PORT = 3001;
const app = express();

let phonebookEntries = [
	{ id: 1, name: "Arto Hellas", number: "040-123456" },
	{ id: 2, name: "Ada Lovelace", number: "349-1234-1564" },
	{ id: 3, name: "Izhak Dadashev", number: "050-1235851" },
	{ id: 4, name: "Bojack Horseman", number: "054-6594300" },
];

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

app.listen(() => {
	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
});
