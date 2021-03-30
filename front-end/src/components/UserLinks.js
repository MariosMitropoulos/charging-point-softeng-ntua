import 'bootstrap/dist/css/bootstrap.css';
import { NavLink } from "react-router-dom";

function UserLinks() {
    return (
        <ul className="navbar navbar-light bg-white">
            <li className="nav-item item">
                <h5><NavLink exact activeClassName="active" to="/user/analytics">Analytics</NavLink></h5>
            </li>
            <li className="nav-item item">
                <h5><NavLink exact activeClassName="active" to="/user/paymentmethods">Payment Methods</NavLink></h5>
            </li>
            <li className="nav-item item">
                <h5><NavLink exact activeClassName="active" to="/user/review">Review a Station</NavLink></h5>
            </li>
            <li className="nav-item item">
                <h5><NavLink exact activeClassName="active" to="/user/charge">Charge</NavLink></h5>
            </li>
        </ul>
    )
}

export default UserLinks;
