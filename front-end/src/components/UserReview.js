import 'bootstrap/dist/css/bootstrap.css';
import './UserReview.css';
import NavBar2 from '../components/NavBar2';
import UserLinks from './UserLinks';
import { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import qs from 'qs';

class UserReview extends Component {
    constructor() {
        super();

        this.state={
            station: null,
            length: null,
            render: null,
            rating: ['0', '0', '0', '0', '0'],
            comment: ['', '', '', '', '']
        }

        this.clickHandler = this.clickHandler.bind(this)
    }

    componentDidMount() {
        this.ReviewStation();
    }

    async clickHandler(i) {
        let userToken = JSON.parse(localStorage.getItem('login')).token;
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;
        let rating = this.state.rating[i];
        let comments = this.state.comment[i];

        var data = qs.stringify({
            date: Date.now(),
            by: userID,
            rating: rating,
            comment: comments
        });
        var config = {
            method: 'post',
            url: 'https://localhost:8765/evcharge/api/stationmod/addreview/' + userID + '/' + this.state.station[i].stationId,
            headers: {
                'X-OBSERVATORY-AUTH': userToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async ReviewStation() {
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;

        try {
            let res = await axios.get('https://localhost:8765/evcharge/api/queries/stationsVisited/' + userID);
            this.setState({
                station: res.data,
                length: res.data.length
            });
            // console.log(res);

            var rows = [];
            for (let i = 0; i < this.state.length; i++) {
                rows.push(
                    <div className="row justify-content-around align-items-center" key={i}>
                        <div className="reviewstation">
                            <h3>{this.state.station[i].name}</h3>
                            <span>Address: {this.state.station[i].address}</span>
                            <div className="container-fluid">
                                <div className="row justify-content-around align-items-center">
                                    <fieldset>
                                        <span>1 - </span>
                                        <input type="radio" id="1" name={i} value="1" onChange={() => {
                                            let temp = this.state.rating;
                                            temp[i] = 1;
                                            }}/>
                                        <small> </small>
                                        <input type="radio" id="2" name={i} value="2" onChange={() => {
                                            let temp = this.state.rating;
                                            temp[i] = 2;
                                            }}/>
                                        <small> </small>
                                        <input type="radio" id="3" name={i} value="3" onChange={() => {
                                            let temp = this.state.rating;
                                            temp[i] = 3;
                                            }}/>
                                        <small> </small>
                                        <input type="radio" id="4" name={i} value="4" onChange={() => {
                                            let temp = this.state.rating;
                                            temp[i] = 4;
                                            }}/>
                                        <small> </small>
                                        <input type="radio" id="5" name={i} value="5" onChange={() => {
                                            let temp = this.state.rating;
                                            temp[i] = 5;
                                            }}/>
                                        <small> </small>
                                        <input type="radio" id="6" name={i} value="6" onChange={() => {
                                            let temp = this.state.rating;
                                            temp[i] = 6;
                                            }}/>
                                        <small> </small>
                                        <input type="radio" id="7" name={i} value="7" onChange={() => {
                                            let temp = this.state.rating;
                                            temp[i] = 7;
                                            }}/>
                                        <small> </small>
                                        <input type="radio" id="8" name={i} value="8" onChange={() => {
                                            let temp = this.state.rating;
                                            temp[i] = 8;
                                            }}/>
                                        <small> </small>
                                        <input type="radio" id="9" name={i} value="9" onChange={() => {
                                            let temp = this.state.rating;
                                            temp[i] = 9;
                                            }}/>
                                        <small> </small>
                                        <input type="radio" id="10" name={i} value="10" onChange={() => {
                                            let temp = this.state.rating;
                                            temp[i] = 10;
                                            }}/>
                                        <span> - 10</span>
                                    </fieldset>
                                </div>
                            </div>
                            <p>Comments (optional):</p>
                            <div className="input-group">
                                <textarea className="form-control" name={i} onChange={(e) => {
                                    let temp = this.state.comment;
                                    temp[i] = e.target.value;
                                    }}></textarea>
                            </div>
                            <br/>
                            <button type="submit" className="btn btn-primary btn-block" onClick={() => {this.clickHandler(i)}}>Submit</button>
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

                <UserLinks/>

                <div className="container-fluid">
                    <div className="row justify-content-around align-items-center">
                        <h4>Last 5 stations you visited</h4>
                    </div>

                    {this.state.render}
                </div>

                <br/>
            </div>
        );
    }
}

export default UserReview;
