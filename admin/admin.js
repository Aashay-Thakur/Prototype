const getInfoButton = document.querySelector(".getInfoButton");
const shutdownButton = document.querySelector(".shutDownButton");
const applicationsButton = document.querySelector(".showApplications");
const checkFlatpackButton = document.querySelector(".checkFlatpack");

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

checkFlatpackButton.addEventListener("click", async () => {
	const result = await axios({
		method: "get",
		url: "http://localhost:3000/check-flatpack",
	});

	output.innerHTML = "";
	output.innerHTML = `<pre>${JSON.stringify(result.data, null, 2)}</pre>`;
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
