import 'bootstrap/dist/css/bootstrap.css';
import './ParkingOwnerManage.css';
import NavBar2 from '../components/NavBar2';
import ParkingOwnerLinks from './ParkingOwnerLinks';
import { Link } from 'react-router-dom'
import { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import qs from 'qs';

class ParkingOwnerManage extends Component {
    constructor() {
        super();

        this.state={
            stations: ['test'],
            points: ['test'],
            contact_info: ['test']
        }
    }

    componentDidMount() {
        this.Station();
    }

    async Station() {
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;

        try {
            let res = await axios.get('https://localhost:8765/evcharge/api/queries/userStations/' + userID);
            // console.log(res);

            let temp = [];
            let temp2 = [];
            for (var i = 0; i < res.data.length; i++) {
                temp.push(res.data[i].points);
                temp2.push(res.data[i].contact_info);
            }

            this.setState({
                stations: res.data,
                points: temp,
                contact_info: temp2
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    editHandler(i) {
        localStorage.setItem('station', JSON.stringify({
            station: this.state.stations[i]
        }))
        window.location.href = "/parkingowner/manage/edit";
    }

    deleteHandler(i) {
        let userToken = JSON.parse(localStorage.getItem('login')).token;
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;

        var data = qs.stringify({});
        var config = {
            method: 'post',
            url: 'https://localhost:8765/evcharge/api/stationmod/delete/' + userID + '/' + this.state.stations[i]._id,
            headers: {
                'X-OBSERVATORY-AUTH': userToken
            },
            data: data
        };

        axios(config)
        .then(function (response) {
            window.location.reload(false);
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <div>
                <NavBar2/>

                <ParkingOwnerLinks/>

                <div className="container-fluid">
                    {
                        this.state.stations.map((station, key) => {return (
                            <div className="row justify-content-around align-items-center" key={key}>
                                <div className="parkingreviewstation">
                                    <h4>{station.name}</h4>
                                    <p>Address: {station.address}</p>
                                    <p>Phone: {this.state.contact_info[key].phone}</p>
                                    <p>Email: {this.state.contact_info[key].email}</p>
                                    <p>Operator: {station.operator}</p>
                                    <p>Total points: {this.state.points[key].length}</p>
                                    <div className="container-fluid">
                                        <div className="row justify-content-around align-items-center">
                                            <div className="button"><button type="submit" className="btn btn-primary btn-block" onClick={() => this.editHandler(key)}>Edit</button></div>
                                            <div className="button"><button type="submit" className="btn btn-danger btn-block" onClick={() => this.deleteHandler(key)}>Delete</button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})
                    }
                </div>

                <div className="container-fluid">
                    <div className="row justify-content-around align-items-center">
                        <Link to="/parkingowner/manage/add"><button className="btn btn-primary">+ Add a new station</button></Link>
                    </div>
                </div>

                <br/>
            </div>
        );
    }
}

export default ParkingOwnerManage;
