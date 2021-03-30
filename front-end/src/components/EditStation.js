import 'bootstrap/dist/css/bootstrap.css';
import NavBar2 from './NavBar2';
import './AddStation.css';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import qs from 'qs';

class EditStation extends Component {
    constructor() {
        super();

        let station = JSON.parse(localStorage.getItem('station')).station

        this.state={
            id: station._id,
            name: station.name,
            address: station.address,
            provider: station.energy_provider,
            operator: station.operator,
            phone: station.contact_info.phone[0],
            email: station.contact_info.email
        }

        this.editHandler = this.editHandler.bind(this)
    }

    editHandler() {
        let userToken = JSON.parse(localStorage.getItem('login')).token;
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;
        // console.log(this.state)

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
            url: 'https://localhost:8765/evcharge/api/stationmod/edit/' + userID +'/'+ this.state.id,
            headers: {
                'X-OBSERVATORY-AUTH': userToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
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
                                <h4>Edit station details</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="name">Name (required)</label>
                                            <input className="form-control" id="name" type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="ccnumber">Address</label>
                                            <div className="input-group">
                                                <input className="form-control" type="text" value={this.state.address} onChange={(e) => this.setState({address: e.target.value})}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="ccnumber">Energy Provider ID (required)</label>
                                            <div className="input-group">
                                                <input className="form-control" type="text" value={this.state.provider} onChange={(e) => this.setState({provider: e.target.value})} required/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="ccnumber">Phone</label>
                                            <div className="input-group">
                                                <input className="form-control" type="text" value={this.state.phone} onChange={(e) => this.setState({phone: e.target.value})}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="ccnumber">Email</label>
                                            <div className="input-group">
                                                <input className="form-control" type="text" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="ccnumber">Operator</label>
                                            <div className="input-group">
                                                <input className="form-control" type="text" value={this.state.operator} onChange={(e) => this.setState({operator: e.target.value})}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="container-fluid">
                                    <div className="row justify-content-around align-items-center">
                                        <button className="btn btn-sm btn-success" type="submit" onClick={this.editHandler}>Submit</button>
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

export default EditStation;
