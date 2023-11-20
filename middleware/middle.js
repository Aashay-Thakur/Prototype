const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const urls = [
	"http://test.loca.lt",
	// 	"https://nervous-insect-18.loca.lt",
	// 	"https://angry-frog-22.loca.lt",
	// 	"https://smart-husky-91.loca.lt",
];

// const urls = ["http://localhost:3001"];

app.get("/info", async (req, res) => {
	let requests = urls.map((url) => axios.get(url + "/info"));

	let results = await Promise.allSettled(requests);
	let returnData = [];
	results.forEach((res) => {
		if (res.status === "fulfilled") {
			returnData.push(res.value.data);
		} else {
			returnData.push({ status: "failed", reason: res.reason.code, url: res.reason.config.url });
		}
	});
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify(returnData));
});

app.get("/shutdown", async (req, res) => {
	let requests = urls.map((url) => axios.get(url + "/shutdown"));
	let results = await Promise.allSettled(requests);
	let returnData = [];
	results.forEach((res) => {
		if (res.status === "fulfilled") {
			returnData.push(res.value.data);
		} else {
			returnData.push({ status: "failed", reason: res.reason.code, url: res.reason.config.url });
		}
	});
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify(returnData));
});

app.get("/applications", async (req, res) => {
	let requests = urls.map((url) => axios.get(url + "/applications"));
	let results = await Promise.allSettled(requests);
	let returnData = [];
	results.forEach((res) => {
		if (res.status === "fulfilled") {
			returnData.push(res.value.data);
		} else {
			returnData.push({ status: "failed", reason: res.reason.code, url: res.reason.config.url });
		}
	});
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify(returnData));
});

app.get("/search-app", async (req, res) => {
	let requests = urls.map((url) =>
		axios.get({
			method: "get",
			url: url + "/search-app",
			params: {
				appName: req.data.appName,
			},
		})
	);
	let results = await Promise.allSettled(requests);
	let returnData = [];
	results.forEach((res) => {
		returnData.push(res.value.data);
	});
	res.setHeader("Content-Type", "application/json");
	res.send(JSON.stringify(returnData));
});

app.listen(3000, () => {
	console.log("Listening on port 3000...");
});
