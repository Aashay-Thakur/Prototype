const wol = require("wake_on_lan");

async function sendWolPacket() {
	try {
		const targetMacAddress = await getDynamicMacAddress();
		wol.wake(targetMacAddress, function (error) {
			if (error) {
				console.error("Error sending Wake-on-LAN magic packet:", error);
			} else {
				console.log("Wake-on-LAN magic packet sent successfully!");
			}
		});
	} catch (err) {
		console.error("Error retrieving dynamic MAC address:", err);
	}
}

sendWolPacket();
