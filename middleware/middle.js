const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = "https://empty-eagle-15.loca.lt";

app.get("/info", async (req, res) => {
	let result = await axios({
		method: "get",
		// url: "http://localhost:3001/info",
		// url: "http://test.loca.lt/info",
		url: url + "/info",
	});
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify(result.data));
});

app.get("/shutdown", async (req, res) => {
	let result = await axios({
		method: "get",
		// url: "http://localhost:3001/shutdown",
		// url: "http://test.loca.lt/shutdown",
		url: url + "/shutdown",
	});
	res.setHeader("Content-Type", "text/plain");
	res.send(result.data);
});

app.get("/applications", async (req, res) => {
	let result = await axios({
		method: "get",
		// url: "http://localhost:3001/applications",
		// url: "http://test.loca.lt/applications",
		url: url + "/applications",
	});
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify(result.data));
});

app.listen(3000, () => {
	console.log("Listening on port 3000...");
});
