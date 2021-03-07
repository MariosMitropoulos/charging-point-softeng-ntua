import 'bootstrap/dist/css/bootstrap.css';
import NavBar2 from '../components/NavBar2';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

class UserFullHistory extends Component {
    constructor() {
        super();

        this.state={
            session: null,
            length: null,
            render: null
        }
    }

    componentDidMount() {
        this.Session();
    }

    async Session() {
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;

        try {
            let res = await axios.get('http://localhost:8765/evcharge/api/queries/getAllSessions/' + userID);
            this.setState({
                session: res.data,
                length: res.data.length
            });
            console.log(this.state);

            var rows = [];
            for (var i = 0; i < this.state.length; i++) {
                rows.push(
                    <div className="row justify-content-around align-items-center" key={i}>
                        <div className="reviewstation">
                            <h4 className="state">Session completed</h4>
                            <p>Date: {this.state.session[i].start_date.slice(0, 10)}</p>
                            <p>Time: {this.state.session[i].start_date.slice(11, 16)}-{this.state.session[i].end_date.slice(11, 16)}</p>
                            <p>Car: {this.state.session[i].car}</p>
                            <p>Total kW: {this.state.session[i].energy_delivered}</p>
                            <span>Money: {this.state.session[i].session_cost}€</span>
                        </div>
                    </div>
                );
            }
            this.setState({
                render: rows
            })
        }
        catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div>
                <NavBar2/>

                <br/>

                <div className="container-fluid">
                    <div className="row justify-content-around align-items-center">
                        <Link to="/user/analytics"><button className="btn btn-primary">&#8592; Back to analytics</button></Link>
                    </div>

                    {this.state.render}
                </div>
            </div>
        );
    }
}

export default UserFullHistory;