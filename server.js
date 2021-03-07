const express = require("express");

const PORT = 3001;
const app = express();

app.use(express.json());

app.listen(() => {
	app.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
});
