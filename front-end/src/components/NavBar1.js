import { Link } from 'react-router-dom';
import './NavBar1.css';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './images/logo.png';

function NavBar1() {
    return (
        <div className="NavBar1">
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid size">
                    <Link to="/" className="link"><img src={logo} alt="logo" width="200px" height="25%"/></Link>
                </div>
            </nav>
        </div>
    );
}

export default NavBar1;
