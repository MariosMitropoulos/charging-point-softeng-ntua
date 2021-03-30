import 'bootstrap/dist/css/bootstrap.css';
import { NavLink } from "react-router-dom";

function ParkingOwnerLinks() {
    return (
        <ul className="navbar navbar-light bg-white">
            <li className="nav-item item">
                <h5><NavLink exact activeClassName="active" to="/parkingowner/analytics">Analytics</NavLink></h5>
            </li>
            <li className="nav-item item">
                <h5><NavLink exact activeClassName="active" to="/parkingowner/manage">Station Management</NavLink></h5>
            </li>
            <li className="nav-item item">
                <h5><NavLink exact activeClassName="active" to="/parkingowner/review">My Reviews</NavLink></h5>
            </li>
        </ul>
    )
}

export default ParkingOwnerLinks;