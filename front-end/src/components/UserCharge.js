import 'bootstrap/dist/css/bootstrap.css';
import { Component } from 'react';
import NavBar2 from '../components/NavBar2';
import UserLinks from './UserLinks';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import qs from 'qs';

class UserCharge extends Component {
    constructor() {
        super();

        this.state={
            cars: ['test'],
            selection: null,
            cost: ['test'],
            time: ['test'],
            length: null
        }
    }

    componentDidMount() {
        this.Charge();
    }

    async changeHandler(i, mode) {
        let userToken = JSON.parse(localStorage.getItem('login')).token;
        let temp = this.state.selection;
        temp[i] = mode;

        var data = qs.stringify({});
        var config = {
            method: 'get',
            url: 'https://localhost:8765/evcharge/api/EstimatedTimeAndCost/' + this.state.cars[i].info + '/4.217/' + mode,
            headers: {
                'X-OBSERVATORY-AUTH': userToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios(config)
        .then((response) => {
            temp = this.state.cost;
            temp[i] = response.data.cost + '€';
            temp = this.state.time;
            temp[i] = response.data.time;
            this.forceUpdate();
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async Charge() {
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;

        try {
            let res = await axios.get('https://localhost:8765/evcharge/api/queries/userCars/' + userID);
            // console.log(res);

            this.setState({
                cars: res.data,
                length: res.data.length
            });

            let temp = [];
            let temp2 = [];
            let temp3 = [];
            for (let i = 0; i < this.state.length; i++) {
                temp.push('normal');
                temp2.push('')
            }
            this.setState({
                selection: temp,
                cost: temp2,
                time: temp3
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
                    {
                        this.state.cars.map((car, key) => {return (
                            <div className="row justify-content-around align-items-center" key={key}>
                                <div className="reviewstation">
                                    <h3>{car.brand + ' ' + car.model}</h3>
                                    <p>Total battery capacity: {car.usable_battery_size}</p>
                                    <p>Current battery capacity: 4.217</p>
                                    <fieldset>
                                        <span>Normal </span>
                                        <input type="radio" id="normal" name={key} value="normal" onChange={() => this.changeHandler(key, 'normal')}/>
                                        <span> Fast </span>
                                        <input type="radio" id="fast" name={key} value="fast" onChange={() => this.changeHandler(key, 'fast')}/>
                                    </fieldset>
                                    <br/>
                                    <p>{this.state.cost[key]}</p>
                                    <p>{this.state.time[key]}</p>
                                    <button className="btn btn-sm btn-success" type="submit">Begin charge</button>
                                </div>
                            </div>
                        )})
                    }
                </div>

                <br/>
            </div>
        );
    }
}

export default UserCharge;
