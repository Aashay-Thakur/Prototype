import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SocketContextProvider } from "./components/SocketContext.jsx";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	// <React.StrictMode>
	<SocketContextProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</SocketContextProvider>
	// </React.StrictMode>,
);
