import { useState, useEffect, createContext } from "react";
import { PropTypes } from "prop-types";
import { io } from "socket.io-client";

const SocketContext = createContext();

function SocketContextProvider({ children }) {
	const [socket, setSocket] = useState(null);
	useEffect(() => {
		setSocket(io("http://172.18.36.201:3000/admin"));
		// setSocket(io("http://localhost:3000/admin"));
	}, []);
	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

SocketContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export { SocketContextProvider, SocketContext };
