import "./Navbar.scss";

function Navbar() {
	return (
		<nav>
			<div className="nav-wrapper">
				<a href="#" className="brand-logo center">
					LabLink
				</a>
				<ul id="nav-mobile" className="left hide-on-med-and-down">
					<li data-target="slide-out" className="sidenav-trigger">
						<i className="material-icons menu-icon">menu</i>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Navbar;
