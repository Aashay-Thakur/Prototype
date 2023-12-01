import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";

import "./Sidenav.scss";

function Sidenav({ SocketContext }) {
	const location = useLocation();
	const socket = useContext(SocketContext);

	function sendShutdownSignal() {
		if (confirm("Are you sure you want to shutdown all devices?")) {
			socket.emit("shutdown", null, (response) => console.log(response));
		}
	}

	return (
		<ul id="slide-out" className="sidenav">
			<li className={location.pathname === "/" ? "active" : ""}>
				<Link className="link" to="/">
					Dashboard
				</Link>
			</li>
			<li className={location.pathname === "/applications" ? "active" : ""}>
				<Link className="link" to="/applications">
					Applications
				</Link>
			</li>
			<li onClick={sendShutdownSignal}>
				<Link className="link">Shutdown</Link>
			</li>
		</ul>
	);
}

Sidenav.propTypes = {
	SocketContext: PropTypes.object.isRequired,
};

export default Sidenav;
