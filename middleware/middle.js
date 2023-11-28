import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";

// Socket.io imports
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

const urls = [
	"http://localhost:3001",
	// "http://192.168.56.102:3001", // VM
	// "http://test.loca.lt", // localtunnel
];

async function sendRequests(urls, config) {
	let returnData = [];
	let requests = urls.map((url) =>
		axios({
			...config,
			url: url + config.type,
		})
	);
	let results = await Promise.allSettled(requests);
	results.forEach((res, index) => {
		if (res.status === "fulfilled") {
			returnData.push({ id: index, data: res.value.data });
		} else {
			returnData.push({ id: index, status: "failed", reason: res.reason.code, url: res.reason.config.url });
		}
	});
	return returnData;
}

const adminIo = io.of("/admin");

adminIo.on("connection", (socket) => {
	console.log("Admin Connected =>", socket.id);
	socket.on("shutdown", async (id, callback) => {
		const data = await sendRequests(id ? [urls[id]] : urls, { method: "get", type: "/shutdown" });
		callback(data);
	});

	socket.on("search", async (applicationName, id, callback) => {
		const data = await sendRequests(id ? [urls[id]] : urls, {
			method: "get",
			type: "/search",
			params: { name: applicationName },
		});
		callback(data);
	});

	socket.on("info", async (id, callback) => {
		const data = await sendRequests(id ? [urls[id]] : urls, { method: "get", type: "/info" });
		callback(data);
	});

	socket.on("applications", async (id, callback) => {
		const data = await sendRequests(id ? [urls[id]] : urls, { method: "get", type: "/applications" });
		callback(data);
	});

	socket.on("peripherals", async (id, callback) => {
		const data = await sendRequests(id ? [urls[id]] : urls, { method: "get", type: "/peripherals" });
		callback(data);
	});

	socket.on("installed_from_list", async (applications, id, callback) => {
		const data = await sendRequests(id ? [urls[id]] : urls, {
			method: "get",
			type: "/installed_from_list",
			data: applications.join(","),
		});
		callback(data);
	});

	socket.on("all_data", async (id, callback) => {
		const info = await sendRequests([urls[id]], { method: "get", type: "/info" });
		const applications = await sendRequests([urls[id]], { method: "get", type: "/applications" });
		const peripherals = await sendRequests([urls[id]], { method: "get", type: "/peripherals" });
		const data = { info: info[0].data, applications: applications[0].data, peripherals: peripherals[0].data };
		callback(data);
	});
});

//? Should be used when testing with VM
// app.listen(3000, "192.168.56.101", () => {
// 	console.log("Listening on port 3000...");
// });

server.listen(3000, () => {
	console.log("Listening on port 3000...");
});
