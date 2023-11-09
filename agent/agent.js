const os = require("os");
const express = require("express");
const cors = require("cors");

const { exec } = require("child_process");

const app = express();
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/info", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(
		JSON.stringify({
			platform: os.platform(),
			release: os.release(),
			type: os.type(),
			version: os.version(),
			hostname: os.hostname(),
			arch: os.arch(),
			cpus: os.cpus(),
			memory: {
				free: os.freemem(),
				total: os.totalmem(),
			},
			networkInterfaces: os.networkInterfaces(),
		})
	);
});

app.post("/shutdown", (req, res) => {
	exec("shutdown -h now", (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	});
});

app.listen(3001, () => {
	console.log("Listening on port 3001...");
});
