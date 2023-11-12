const getInfoButton = document.querySelector(".getInfoButton");
const output = document.querySelector(".output");
getInfoButton.addEventListener("click", async () => {
	const result = await axios({
		method: "get",
		url: "http://localhost:3000/info",
	});
	displayInfo(result.data);
});

const shutdownButton = document.querySelector(".shutDownButton");
shutdownButton.addEventListener("click", async () => {
	const result = await axios({
		method: "get",
		url: "http://localhost:3000/shutdown",
	});
	displayInfo({ reply: result.data });
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
