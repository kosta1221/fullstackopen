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

// GET route to /api/persons returns a list of phonebook entries from MongoDB database
app.get("/api/persons", (req, res) => {
	Entry.find({}).then((entries) => {
		res.status(200).json(entries);
	});
});

// GET route to /info returns info about the phonebook
app.get("/info", (req, res) => {
	Entry.estimatedDocumentCount().then((result) => {
		const responseString = `<strong style="color:blue;">Phonebook has info for ${result} people.<br /> ${new Date()}</strong>`;

		res.status(200).send(responseString);
	});
});

// GET route to /api/persons/:id returns info about the person with that id
app.get("/api/persons/:id", (req, res, next) => {
	const { id } = req.params;

	Entry.findById(id)
		.then((entry) => {
			if (entry) {
				res.json(entry);
			} else {
				res.status(404).end();
			}
		})
		.catch((error) => next(error));
});

// POST route to /api/persons adds a new entry
app.post("/api/persons", (req, res, next) => {
	const newEntry = new Entry({ name: req.body.name, number: req.body.number });
	newEntry
		.save()
		.then((savedEntry) => {
			res.json(savedEntry.toJSON());
		})
		.catch((error) => next(error));
});

// PUT route to /api/persons/:id updates an existing entry's number
app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;

	const entry = { number: body.number };

	Entry.findByIdAndUpdate(request.params.id, entry, { new: true })
		.then((updatedEntry) => {
			response.json(updatedEntry);
		})
		.catch((error) => next(error));
});

// DELETE route to /api/persons/:id deletes an entry by id
app.delete("/api/persons/:id", (req, res, next) => {
	const { id } = req.params;

	Entry.findByIdAndRemove(id)
		.then(() => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
	return response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "invalid id format!" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

app.listen(() => {
	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
});
