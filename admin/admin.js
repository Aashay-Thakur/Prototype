const getInfoButton = document.querySelector(".getInfoButton");
const shutdownButton = document.querySelector(".shutDownButton");
const applicationsButton = document.querySelector(".showApplications");

const output = document.querySelector(".output");

getInfoButton.addEventListener("click", async () => {
	const result = await axios({
		method: "get",
		url: "http://localhost:3000/info",
	});
	console.log(result);
	displayInfo(result.data);
});

shutdownButton.addEventListener("click", async () => {
	const result = await axios({
		method: "get",
		url: "http://localhost:3000/shutdown",
	});
	displayInfo({ reply: result.data });
});

applicationsButton.addEventListener("click", async () => {
	const result = await axios({
		method: "get",
		url: "http://localhost:3000/applications",
	});
	displayInfo({ data: result.data });
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
