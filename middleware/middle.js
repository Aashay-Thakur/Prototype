const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const urls = [
	// "http://localhost:3001",
	// "http://192.168.56.102:3001", // VM
	"http://test.loca.lt", // localtunnel
];

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

app.get("/peripherals", async (req, res) => {
	let requests = urls.map((url) => axios.get(url + "/peripherals"));
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

app.get("/search", async (req, res) => {
	let requests = urls.map((url) => axios.get(url + "/search", { params: { name: req.query.name } }));
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

//? Should be used when testing with VM
// app.listen(3000, "192.168.56.101", () => {
// 	console.log("Listening on port 3000...");
// });

app.listen(3000, () => {
	console.log("Listening on port 3000...");
});
