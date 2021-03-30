import 'bootstrap/dist/css/bootstrap.css';
import NavBar2 from './NavBar2';
import './AddStation.css';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import qs from 'qs';

class AddStation extends Component {
    constructor() {
        super();

        this.state={
            name: null,
            address: null,
            provider: null,
            operator: null,
            phone: null,
            email: null
        }

        this.addHandler = this.addHandler.bind(this)
    }

    addHandler() {
        let userToken = JSON.parse(localStorage.getItem('login')).token;
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;

        var data = qs.stringify({
            name: this.state.name,
            address: this.state.address,
            energy_provider: this.state.provider,
            contact_info: {
                email: this.state.email,
                phone: [this.state.phone]
            },
            operator: this.state.operator
        });
        var config = {
            method: 'post',
            url: 'https://localhost:8765/evcharge/api/stationmod/add/' + userID,
            headers: {
                'X-OBSERVATORY-AUTH': userToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            window.location.href = "/parkingowner/manage";
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                <NavBar2/>

                <br/>

                <div className="container-fluid">
                    <div className="row justify-content-around align-items-center">
                        <div className="card">
                            <div className="card-header">
                                <h4>Enter station details</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="name">Name (required)</label>
                                            <input className="form-control" id="name" type="text" placeholder="Enter station's name" onChange={(e) => this.setState({name: e.target.value})} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="ccnumber">Address</label>
                                            <div className="input-group">
                                                <input className="form-control" type="text" placeholder="Example 19" onChange={(e) => this.setState({address: e.target.value})}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="ccnumber">Energy Provider ID (required)</label>
                                            <div className="input-group">
                                                <input className="form-control" type="text" placeholder="Enter station's energy provider ID" onChange={(e) => this.setState({provider: e.target.value})} required/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="ccnumber">Phone</label>
                                            <div className="input-group">
                                                <input className="form-control" type="text" placeholder="Enter station's phone number" onChange={(e) => this.setState({phone: e.target.value})}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="ccnumber">Email</label>
                                            <div className="input-group">
                                                <input className="form-control" type="text" placeholder="email@example.com" onChange={(e) => this.setState({email: e.target.value})}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="ccnumber">Operator</label>
                                            <div className="input-group">
                                                <input className="form-control" type="text" placeholder="John Smith" onChange={(e) => this.setState({operator: e.target.value})}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="container-fluid">
                                    <div className="row justify-content-around align-items-center">
                                        <button className="btn btn-sm btn-success" type="submit" onClick={this.addHandler}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row justify-content-around align-items-center">
                        <Link to="/parkingowner/manage"><button className="btn btn-primary">&#8592; Back to station management</button></Link>
                    </div>
                </div>

                <br/>
            </div>
        );
    }
}

export default AddStation;
