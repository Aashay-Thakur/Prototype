import { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { SocketContext } from "./components/SocketContext.jsx";

import M from "materialize-css";

import "./App.scss";

import { Components } from "./components/Components";

function App() {
	//eslint-disable-next-line no-unused-vars
	const [isConnected, setIsConnected] = useState(false);
	const socket = useContext(SocketContext);
	M.Sidenav.init(document.querySelectorAll(".sidenav"), {});

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		if (socket) {
			socket.on("connect", onConnect);
			socket.on("disconnect", onDisconnect);
		}
		return () => {
			if (socket) {
				socket.off("connect_error", onConnect);
				socket.off("disconnect", onDisconnect);
			}
		};
	}, [socket]);

	return (
		<div>
			<Components.Navbar />
			<Components.Sidenav SocketContext={SocketContext} />
			<div className="container">
				<Routes>
					<Route path="/" element={<Components.Dash />} />
					<Route path="/applications" element={<Components.Applications />} />
					<Route path="/device/:id" element={<Components.Device />} />
					<Route path="*" element={<Components.Error code={404} />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
