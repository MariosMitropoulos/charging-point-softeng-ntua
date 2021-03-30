import { Link } from 'react-router-dom';
import './NavBar2.css';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './images/logo.png';
import personicon from './images/personicon.png';
import settings from './images/settings.jpg';
import exit from './images/exit.png';
import jwt from 'jsonwebtoken';

// let memo=localStorage.getItem('login');
// let token=JSON.parse(memo).token;
// let decode=jwt.decode(token);
// let name=decode.username;
// let name=jwt.decode(JSON.parse(localStorage.getItem('login')).token).username;
let page="/user";

function clickHandler(event) {
    event.preventDefault();
    localStorage.clear();
    window.location.href = "/";
}

function NavBar2() {
    return (
        <div>
            <div className="NavBar2">
                <nav className="navbar navbar-light bg-light">
                    <div className="container-fluid">
                        <Link to={page}><img src={logo} alt="logo" width="200px" height="25%"/></Link>
                        <img className="person" src={personicon} alt="personicon" width="18px" height="1%"/>
                        <h6 className="navbar-text username">{jwt.decode(JSON.parse(localStorage.getItem('login')).token).username}</h6>
                        <input type="image" className="gear" alt="gear" src={settings} name="gear" width="18px" height="1.5%"/>
                        {/* <Link to="/"><img src={exit} className="exit" alt="exit" width="20px" height="27%"/></Link> */}
                        <button className="btn" onClick={clickHandler}><img src={exit} className="exit" alt="exit" width="20px" height="27%"/></button>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default NavBar2;
