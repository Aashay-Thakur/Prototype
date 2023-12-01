import { PropTypes } from "prop-types";
import "./Error.scss";

function Error({ code }) {
	return <div className="error-container">{code}</div>;
}

// props validation
Error.propTypes = {
	code: PropTypes.number.isRequired,
};

export default Error;
