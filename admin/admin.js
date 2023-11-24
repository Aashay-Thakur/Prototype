const getInfoButton = document.querySelector(".getInfoButton");
const shutdownButton = document.querySelector(".shutDownButton");
const applicationsButton = document.querySelector(".showApplications");
const showPeripherals = document.querySelector(".showPeripherals");

const applicationName = document.getElementById("applicationName");
const applicationSearch = document.querySelector(".searchApplication");

const output = document.querySelector(".output");
const url = "http://localhost:3000"; // Local
// const url = "http://192.168.56.101:3000"; // VM

getInfoButton.addEventListener("click", async () => {
	const result = await axios({
		method: "get",
		url: url + "/info",
	});
	console.log(result);
	displayInfo(result.data);
});

shutdownButton.addEventListener("click", async () => {
	if (confirm("Are you sure you want to shut down all pcs?")) {
		const result = await axios({
			method: "get",
			url: url + "/shutdown",
		});
		displayInfo({ reply: result.data });
	}
});

applicationsButton.addEventListener("click", async () => {
	const result = await axios({
		method: "get",
		url: url + "/applications",
	});
	displayInfo({ data: result.data });
});

showPeripherals.addEventListener("click", async () => {
	const result = await axios({
		method: "get",
		url: url + "/peripherals",
	});
	displayInfo({ data: result.data });
});

applicationSearch.addEventListener("click", async () => {
	const result = await axios({
		method: "get",
		url: url + "/search",
		data: { name: applicationName.value },
	});
});

function displayInfo(data) {
	output.innerHTML = "";
	Object.keys(data).forEach((key) => {
		const p = document.createElement("p");
		if (typeof data[key] === "string") {
			p.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
		} else {
			p.innerHTML = `<strong>${key}:</strong> <pre>${JSON.stringify(data[key], null, 2)}</pre>`;
		}
		output.appendChild(p);
	});
}
