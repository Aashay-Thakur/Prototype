import { PropTypes } from "prop-types";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../SocketContext";
import { useParams } from "react-router-dom";

function Device() {
	const { id } = useParams();
	const socket = useContext(SocketContext);
	const [info, setInfo] = useState([]);

	useEffect(() => {
		if (socket) {
			socket.emit("all_data", id, (response) => {
				setInfo(response);
				console.log(response);
			});
		}
	}, [socket, id]);
	if (!info) {
		return <h1>Loading...</h1>;
	}
	//TODO Need to add more info to this page
	return (
		<>
			<h2>Device {info.info.hostname}</h2>
		</>
	);
}

Device.propTypes = {
	Navigation: PropTypes.object,
};

export default Device;
