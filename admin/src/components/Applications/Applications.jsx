import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketContext";
import { useNavigate } from "react-router-dom";

function Applications() {
	const socket = useContext(SocketContext);
	const [applications, setApplications] = useState([]);
	const navigate = useNavigate();
	const applicationList = ["android-studio", "firefox", "terminal"];

	useEffect(() => {
		if (socket) {
			socket.emit("installed_from_list", applicationList, null, (response) => {
				setApplications(response);
				console.log(response);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	//TODO might need to change this to a regex
	function populateTable() {
		return applications.map((item) => {
			let installed = item.data.reduce((acc, curr) => {
				return [...acc, curr.name];
			}, []);
			return (
				<tr key={item.id} id={item.id} onClick={() => navigate(`/device/${item.id}`)}>
					<td>{item.id}</td>
					{applicationList.map((app) => {
						return <td key={app}>{installed.includes(app) ? "Installed" : "Not Installed"}</td>;
					})}
				</tr>
			);
		});
	}

	return (
		<table>
			<thead>
				<tr>
					<th>Id</th>
					{applicationList.map((item) => {
						return <th key={item}>{item}</th>;
					})}
				</tr>
			</thead>
			<tbody>{populateTable()}</tbody>
		</table>
	);
}

export default Applications;
