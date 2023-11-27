import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";

function Sidenav({ SocketContext }) {
	const location = useLocation();
	const socket = useContext(SocketContext);

	function sendShutdownSignal() {
		socket.emit("shutdown", null, (response) => console.log(response));
	}

	return (
		<ul id="slide-out" className="sidenav">
			<li className={location.pathname === "/" ? "active" : ""}>
				<Link to="/">Dashboard</Link>
			</li>
			<li className={location.pathname === "/applications" ? "active" : ""}>
				<Link to="/applications">Applications</Link>
			</li>
			<li onClick={sendShutdownSignal}>
				<Link>Shutdown</Link>
			</li>
		</ul>
	);
}

Sidenav.propTypes = {
	SocketContext: PropTypes.object.isRequired,
};

export default Sidenav;
