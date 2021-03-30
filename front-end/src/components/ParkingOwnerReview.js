import 'bootstrap/dist/css/bootstrap.css';
import './ParkingOwnerReview.css';
import NavBar2 from '../components/NavBar2';
import ParkingOwnerLinks from './ParkingOwnerLinks';
import { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

class ParkingOwnerReview extends Component {
    constructor() {
        super();

        this.state={
            station:null,
            lenght:null,
            render: null
        }
    }

    componentDidMount() {
        this.MyReview();
    }

    async MyReview() {
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;

        try {
            let res = await axios.get('https://localhost:8765/evcharge/api/queries/userStations/' + userID);
            // console.log(res);
            this.setState({
                station: res.data,
                length: res.data.length
            });

            var rows = [];
            for (let i = 0; i < this.state.length; i++) {
                rows.push(
                    <div className="container-fluid" key={i}>
                        <div className="row justify-content-around align-items-center">
                            <div className="parkingreviewstation">
                                <h4>{this.state.station[i].name}</h4>
                                <strong>Total reviews ({this.state.station[i].reviews.length}):</strong>
                                {
                                    this.state.station[i].reviews.map((j, key) => { return (
                                        <div className="container-fluid review" key={key}>
                                            <strong>Date:</strong><span> {j.date.slice(0, 10)}</span>
                                            <br/>
                                            <strong>Rating:</strong><span> {j.rating}/10</span>
                                            <br/>
                                            <span>{j.comment}</span>
                                        </div>
                                    );})
                                }
                            </div>
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

                <ParkingOwnerLinks/>

                <div className="container-fluid">
                    <div className="row justify-content-around align-items-center">
                        {this.state.render}
                    </div>
                </div>
            </div>
        );
    }
}

export default ParkingOwnerReview;
