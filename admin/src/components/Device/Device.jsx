import { PropTypes } from "prop-types";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../SocketContext";
import { useParams } from "react-router-dom";
// import data from "../../assets/data_struct.json";

import "./Device.scss";
import M from "materialize-css";

function Device() {
	const { id } = useParams();
	const socket = useContext(SocketContext);
	const [info, setInfo] = useState([]);
	const appList = ["Android Studio", "Firefox", "Gnome Terminal", "Media Player Info"];

	useEffect(() => {
		M.ScrollSpy.init(document.querySelectorAll(".scrollspy"), {});
	}, []);

	useEffect(() => {
		if (socket) {
			socket.emit("all-data", id, appList, (response) => {
				setInfo(response);
				console.log(response);
			});
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, id]);

	function isInstalled(name) {
		if (info.applications) {
			let installed = info.applications.reduce((acc, curr) => {
				return [...acc, curr.name];
			}, []);
			return installed.includes(name) ? (
				<i className="material-icons done">done</i>
			) : (
				<i className="material-icons clear">clear</i>
			);
		}
		return "Loading";
	}

	function onSendShutdown() {
		if (socket) {
			if (confirm("Are you sure you want to shutdown this device?")) {
				socket.emit("shutdown", id, (response) => {
					console.log(response);
				});
			}
		}
	}

	function onSendReboot() {
		if (socket) {
			if (confirm("Are you sure you want to reboot this device?")) {
				socket.emit("reboot", id, (response) => {
					console.log(response);
				});
			}
		}
	}

	function isConnected(name) {
		if (info.peripherals) {
			let icon = "clear";
			info.peripherals.forEach((peripheral) => {
				if (name === "Webcam" && peripheral.toLowerCase().match("camera")) {
					icon = "done";
				} else {
					if (peripheral.toLowerCase().match(name.toLowerCase())) {
						icon = "done";
					}
				}
			});
			return <i className={`material-icons ${icon}`}>{icon}</i>;
		}
	}

	function formatBytes(bytes, decimals = 2) {
		if (!+bytes) return "0 Bytes";

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}

	if (!info) {
		return <h1>Loading...</h1>;
	} else {
		return (
			<>
				<div className="row">
					<div className="col s12 m9 l10">
						<div id="device_info" className="section scrollspy">
							<h2>Device Info</h2>
							<span>Hostname: {info.info?.hostname}</span>
							<br />
							<span>Architecture: {info.info?.arch.join(" ")}</span>
							<br />
							<span>Platform: {info.info?.platform}</span>
							<br />
							<span>Release: {info.info?.release}</span>
							<br />
							<span>Type: {info.info?.type}</span>
							<br />
							<span>
								<br />
								IP:
								<ul>
									{info.info?.ip.map((ip) => {
										return <li key={ip}>{ip}</li>;
									})}
								</ul>
							</span>
							{/* <span>IP: {info.info?.ip}</span> */}
							<br />
							<span>
								Mac:{" "}
								<ul>
									{info.info?.mac &&
										Object.keys(info.info?.mac).map((key, index) => {
											return <li key={index}>{`${key}:\t\t${info.info?.mac[key]}`}</li>;
										})}
								</ul>
							</span>
							<br />
							<span>Version: {info.info?.version}</span>
							<br />
							Uptime Since Last Request:{" "}
							{info.info?.uptime && new Date(info.info?.uptime * 1000).toISOString().slice(11, 19)}
						</div>
						<div id="users" className="section scrollspy">
							<h3>Users:</h3>
							<ol>
								{info.info?.users.map((user, index) => {
									return <li key={index}>{user[index]} </li>;
								})}
							</ol>
						</div>
						<div id="memory" className="section scrollspy">
							<h3>Memory</h3>
							Memory:
							<ol>
								{[
									"total",
									"available",
									"percent",
									"used",
									"free",
									"active",
									"inactive",
									"buffers",
									"cached",
									"shared",
									"slab",
								].map((key, index) => {
									if (key === "percent") {
										return <li key={index}>{`${key}: ${info.info?.memory[index]}%`}</li>;
									}
									return <li key={index}>{`${key}: ${formatBytes(info.info?.memory[index])}`}</li>;
								})}
							</ol>
						</div>
						<div id="disk_usage" className="section scrollspy">
							<h3>Disk Usage:</h3>
							<ol>
								{["total", "used", "free", "percent"].map((key, index) => {
									if (key === "percent") {
										return <li key={index}>{`${key}: ${info.info?.disk[index]}%`}</li>;
									}
									return <li key={index}>{`${key}: ${formatBytes(info.info?.disk[index])}`}</li>;
								})}
							</ol>
						</div>
						<div id="applications" className="section scrollspy">
							<h3>Applications</h3>
							<table>
								<tbody>
									{appList.map((app, index) => {
										return (
											<tr key={index}>
												<td>{app}</td>
												<td>{info.applications && isInstalled(app)}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
						<div className="section scrollspy" id="peripherals">
							<div className="row">
								<div className="col s12 m6 l6 ">
									<h3>All Peripherals</h3>
									<div className="all_peripherals">
										<div>
											<table>
												<tbody>
													{info.peripherals &&
														info.peripherals.map((peripheral, index) => {
															return (
																<tr key={index}>
																	<td>{peripheral}</td>
																</tr>
															);
														})}
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<div className="col s12 m6 l6">
									<h3>Connected</h3>
									<table>
										<tbody>
											{["Keyboard", "Mouse", "Webcam"].map((peripheral, index) => {
												return (
													<tr key={index}>
														<td>{peripheral}</td>
														<td>{isConnected(peripheral)}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div className="col hide-on-small-only m3 l2">
						<div className="fix">
							<ul className="section table-of-contents">
								<h5>Info</h5>
								<li>
									<a href="#device_info">Device Info</a>
								</li>
								<li>
									<a href="#users">Users</a>
								</li>
								<li>
									<a href="#memory">Memory</a>
								</li>
								<li>
									<a href="#disk_usage">Disk Usage</a>
								</li>
								<li>
									<a href="#applications">Applications</a>
								</li>
								<li>
									<a href="#peripherals">Peripherals</a>
								</li>
								<div className="button-wrapper">
									<button
										className="waves-effect waves-light btn"
										type="submit"
										name="action"
										onClick={onSendShutdown}>
										Shutdown
									</button>
									<button
										className="waves-effect waves-light btn"
										type="submit"
										name="action"
										onClick={onSendReboot}>
										Reboot
									</button>
								</div>
							</ul>
						</div>
					</div>
				</div>
			</>
		);
	}
}

Device.propTypes = {
	Navigation: PropTypes.object,
};

export default Device;
