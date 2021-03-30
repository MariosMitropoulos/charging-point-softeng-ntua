import 'bootstrap/dist/css/bootstrap.css';
import './UserAnalytics.css';
import NavBar2 from '../components/NavBar2';
import { Line } from 'react-chartjs-2';
import UserLinks from './UserLinks';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dayjs from 'dayjs';

class UserAnalytics extends Component {
    constructor(props) {
        super(props)

        this.state = {
            carNames: ['All Cars'],
            carIDs: ['all'],
            carValue: '0',
            timeValue: 'lastmonth',
            km: [],
            kW: [],
            money: [],
            xaxis: [],
            months: []
        }

        this.carHandler = this.carHandler.bind(this)
        this.timeHandler = this.timeHandler.bind(this)
        this.clickHandler = this.clickHandler.bind(this)
    }

    componentDidMount() {
        this.Loader();
    }

    async Loader() {
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;

        try {
            let res = await axios.get('https://localhost:8765/evcharge/api/queries/userCars/' + userID);
            // console.log(res);

            let temp = ['All Cars'];
            for (let i = 0; i < res.data.length; i++) {
                temp.push(res.data[i].brand + ' ' + res.data[i].model);
            }
            this.setState({carNames: temp});
            temp = ['all'];
            for (let i = 0; i < res.data.length; i++) {
                temp.push(res.data[i].info);
            }
            this.setState({carIDs: temp});

            this.clickHandler();
        }
        catch (err) {
            console.log(err);
        }
    }

    getMonth(intEndMonth, monthstime) {
        let startMonth = intEndMonth - monthstime;

        if (startMonth === 1 || startMonth === -11)
            return '01';
        else if (startMonth === 2 || startMonth === -10)
            return '02';
        else if (startMonth === 3 || startMonth === -9)
            return '03';
        else if (startMonth === 4 || startMonth === -8)
            return '04';
        else if (startMonth === 5 || startMonth === -7)
            return '05';
        else if (startMonth === 6 || startMonth === -6)
            return '06';
        else if (startMonth === 7 || startMonth === -5)
            return '07';
        else if (startMonth === 8 || startMonth === -4)
            return '08';
        else if (startMonth === 9 || startMonth === -3)
            return '09';
        else if (startMonth === 10 || startMonth === -2)
            return '10';
        else if (startMonth === 11 || startMonth === -1)
            return '11';
        else if (startMonth === 12 || startMonth === 0)
            return '12';
    }

    getStartDate(endDate, monthstime) {
        let endMonth = parseInt(endDate.slice(4, 6));
        let startMonth = endMonth - monthstime;
        let result = '01';

        if (startMonth === 1 || startMonth === -11)
            result = '01' + result;
        else if (startMonth === 2 || startMonth === -10)
            result = '02' + result;
        else if (startMonth === 3 || startMonth === -9)
            result = '03' + result;
        else if (startMonth === 4 || startMonth === -8)
            result = '04' + result;
        else if (startMonth === 5 || startMonth === -7)
            result = '05' + result;
        else if (startMonth === 6 || startMonth === -6)
            result = '06' + result;
        else if (startMonth === 7 || startMonth === -5)
            result = '07' + result;
        else if (startMonth === 8 || startMonth === -4)
            result = '08' + result;
        else if (startMonth === 9 || startMonth === -3)
            result = '09' + result;
        else if (startMonth === 10 || startMonth === -2)
            result = '10' + result;
        else if (startMonth === 11 || startMonth === -1)
            result = '11' + result;
        else if (startMonth === 12 || startMonth === 0)
            result = '12' + result;

        let endYear = endDate.slice(0, 4);
        if (startMonth <= 0)
            result = JSON.stringify(parseInt(endYear)-1) + result;
        else
            result = endYear + result;

        return result;
    }

    async clickHandler() {
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;
        let carID = this.state.carIDs[this.state.carValue];

        let startDate = null;
        let endDate = dayjs(new Date()).format('YYYYMMDD');
        endDate = endDate.slice(0, 6) + '01';

        if (this.state.timeValue === 'lastmonth') {
            let current = new Date();
            current.setMonth(current.getMonth() - 1);
            let previousMonth = current.toLocaleString('default', { month: 'long' });

            let endMonth = endDate.slice(4, 6);
            let month = this.getMonth(parseInt(endMonth), 1);

            this.setState({
                xaxis: ['1st week of ' + previousMonth, '2nd week of ' + previousMonth, '3rd week of ' + previousMonth, '4th week of ' + previousMonth]
            });

            startDate = this.getStartDate(endDate, 1);

            try {
                let res = await axios.get('https://localhost:8765/evcharge/api/queries/userCars/analytics/' + userID + '/' + carID + '/' + startDate + '/' + endDate);
                // console.log(res);

                let kmtemp = [0, 0, 0, 0];
                let kWtemp = [0, 0, 0, 0];
                let moneytemp = [0, 0, 0, 0];
                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < res.data[i].sessions.length; j++) {
                        if (res.data[i].sessions[j].StartedOn.slice(5, 7) === month) {
                            let day = res.data[i].sessions[j].StartedOn.slice(8, 10);
                            if (day >= '01' && day < '08') {
                                kmtemp[0] += res.data[i].sessions[j].KmCompleted/1000;
                                kWtemp[0] += res.data[i].sessions[j].EnergyDelivered;
                                moneytemp[0] += res.data[i].sessions[j].SessionCost;
                            }
                            else if (day >= '08' && day < '15') {
                                kmtemp[1] += res.data[i].sessions[j].KmCompleted/1000;
                                kWtemp[1] += res.data[i].sessions[j].EnergyDelivered;
                                moneytemp[1] += res.data[i].sessions[j].SessionCost;
                            }
                            else if (day >= '15' && day < '22') {
                                kmtemp[2] += res.data[i].sessions[j].KmCompleted/1000;
                                kWtemp[2] += res.data[i].sessions[j].EnergyDelivered;
                                moneytemp[2] += res.data[i].sessions[j].SessionCost;
                            }
                            else if (day >= '22') {
                                kmtemp[3] += res.data[i].sessions[j].KmCompleted/1000;
                                kWtemp[3] += res.data[i].sessions[j].EnergyDelivered;
                                moneytemp[3] += res.data[i].sessions[j].SessionCost;
                            }
                        }
                    }
                }
                this.setState({
                    km: kmtemp,
                    kW: kWtemp,
                    money: moneytemp
                });
            }
            catch (err) {
                console.log(err);
            }
        }
        else if (this.state.timeValue === 'last3months') {
            let current = new Date();
            current.setMonth(current.getMonth() - 1);
            let previousMonth3 = current.toLocaleString('default', { month: 'short' });
            current.setMonth(current.getMonth() - 1);
            let previousMonth2 = current.toLocaleString('default', { month: 'short' });
            current.setMonth(current.getMonth() - 1);
            let previousMonth1 = current.toLocaleString('default', { month: 'short' });

            let endMonth = endDate.slice(4, 6);
            let month1 = this.getMonth(parseInt(endMonth), 3);
            let month2 = this.getMonth(parseInt(endMonth), 2);
            let month3 = this.getMonth(parseInt(endMonth), 1);

            this.setState({
                xaxis: [
                    '1st week of ' + previousMonth1, '2nd week of ' + previousMonth1, '3rd week of ' + previousMonth1, '4th week of ' + previousMonth1,
                    '1st week of ' + previousMonth2, '2nd week of ' + previousMonth2, '3rd week of ' + previousMonth2, '4th week of ' + previousMonth2,
                    '1st week of ' + previousMonth3, '2nd week of ' + previousMonth3, '3rd week of ' + previousMonth3, '4th week of ' + previousMonth3
                ],
                months: [month1, month2, month3]
            });

            startDate = this.getStartDate(endDate, 3);

            try {
                let res = await axios.get('https://localhost:8765/evcharge/api/queries/userCars/analytics/' + userID + '/' + carID + '/' + startDate + '/' + endDate);
                // console.log(res);

                let kmtemp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let kWtemp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let moneytemp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < res.data[i].sessions.length; j++) {
                        for (let k = 0; k < this.state.months.length; k++) {
                            if (res.data[i].sessions[j].StartedOn.slice(5, 7) === this.state.months[k]) {
                                let day = res.data[i].sessions[j].StartedOn.slice(8, 10);
                                if (day >= '01' && day < '08') {
                                    kmtemp[4*k] += res.data[i].sessions[j].KmCompleted/1000;
                                    kWtemp[4*k] += res.data[i].sessions[j].EnergyDelivered;
                                    moneytemp[4*k] += res.data[i].sessions[j].SessionCost;
                                }
                                else if (day >= '08' && day < '15') {
                                    kmtemp[4*k+1] += res.data[i].sessions[j].KmCompleted/1000;
                                    kWtemp[4*k+1] += res.data[i].sessions[j].EnergyDelivered;
                                    moneytemp[4*k+1] += res.data[i].sessions[j].SessionCost;
                                }
                                else if (day >= '15' && day < '22') {
                                    kmtemp[4*k+2] += res.data[i].sessions[j].KmCompleted/1000;
                                    kWtemp[4*k+2] += res.data[i].sessions[j].EnergyDelivered;
                                    moneytemp[4*k+2] += res.data[i].sessions[j].SessionCost;
                                }
                                else if (day >= '22') {
                                    kmtemp[4*k+3] += res.data[i].sessions[j].KmCompleted/1000;
                                    kWtemp[4*k+3] += res.data[i].sessions[j].EnergyDelivered;
                                    moneytemp[4*k+3] += res.data[i].sessions[j].SessionCost;
                                }
                            }
                        }
                    }
                }
                this.setState({
                    km: kmtemp,
                    kW: kWtemp,
                    money: moneytemp
                });
            }
            catch (err) {
                console.log(err);
            }
        }
        else if (this.state.timeValue === 'last6months') {
            let current = new Date();
            let previousMonth = null;
            let temp = [];
            let temp2 = [];
            let endMonth = endDate.slice(4, 6);
            for (let i = 0; i < 6; i++) {
                current.setMonth(current.getMonth() - 1);
                previousMonth = current.toLocaleString('default', { month: 'long' });
                temp.unshift(previousMonth);
                temp2.unshift(this.getMonth(parseInt(endMonth), i+1));
            }
            this.setState({
                xaxis: temp,
                months: temp2
            });

            startDate = this.getStartDate(endDate, 6);

            try {
                let res = await axios.get('https://localhost:8765/evcharge/api/queries/userCars/analytics/' + userID + '/' + carID + '/' + startDate + '/' + endDate);
                // console.log(res);

                let kmtemp = [0, 0, 0, 0, 0, 0];
                let kWtemp = [0, 0, 0, 0, 0, 0];
                let moneytemp = [0, 0, 0, 0, 0, 0];
                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < res.data[i].sessions.length; j++) {
                        for (let k = 0; k < this.state.months.length; k++) {
                            if (res.data[i].sessions[j].StartedOn.slice(5, 7) === this.state.months[k]) {
                                kmtemp[k] += res.data[i].sessions[j].KmCompleted/1000;
                                kWtemp[k] += res.data[i].sessions[j].EnergyDelivered;
                                moneytemp[k] += res.data[i].sessions[j].SessionCost;
                            }
                        }
                    }
                }
                this.setState({
                    km: kmtemp,
                    kW: kWtemp,
                    money: moneytemp
                });
            }
            catch (err) {
                console.log(err);
            }
        }
        else if (this.state.timeValue === 'lastyear') {
            let current = new Date();
            let previousMonth = null;
            let temp = [];
            let temp2 = [];
            let endMonth = endDate.slice(4, 6);
            for (let i = 0; i < 12; i++) {
                current.setMonth(current.getMonth() - 1);
                previousMonth = current.toLocaleString('default', { month: 'long' });
                temp.unshift(previousMonth);
                temp2.unshift(this.getMonth(parseInt(endMonth), i+1));
            }
            this.setState({
                xaxis: temp,
                months: temp2
            });

            startDate = this.getStartDate(endDate, 12);

            try {
                let res = await axios.get('https://localhost:8765/evcharge/api/queries/userCars/analytics/' + userID + '/' + carID + '/' + startDate + '/' + endDate);
                // console.log(res);

                let kmtemp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let kWtemp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                let moneytemp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < res.data[i].sessions.length; j++) {
                        for (let k = 0; k < this.state.months.length; k++) {
                            if (res.data[i].sessions[j].StartedOn.slice(5, 7) === this.state.months[k]) {
                                kmtemp[k] += res.data[i].sessions[j].KmCompleted/1000;
                                kWtemp[k] += res.data[i].sessions[j].EnergyDelivered;
                                moneytemp[k] += res.data[i].sessions[j].SessionCost;
                            }
                        }
                    }
                }
                this.setState({
                    km: kmtemp,
                    kW: kWtemp,
                    money: moneytemp
                });
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    LineChart() {
        return (
            <Line data={
                {labels: this.state.xaxis,
                datasets: [
                    {
                        label: 'Kilometers between sessions',
                        data: this.state.km,
                        backgroundColor: 'rgba(230, 0, 0, 0.4)',
                        borderColor: 'rgba(0, 0, 140)',
                        pointBackgroundColor: 'rgba(0, 0, 140)'
                    },
                    {
                        label: 'kWatts consumed',
                        data: this.state.kW,
                        backgroundColor: 'rgba(255, 70, 0, 0.4)',
                        borderColor: 'rgba(0, 0, 140)',
                        pointBackgroundColor: 'rgba(0, 0, 140)'
                    },
                    {
                        label: 'Money spent',
                        data: this.state.money,
                        backgroundColor: 'rgba(60, 150, 60, 0.4)',
                        borderColor: 'rgba(0, 0, 140)',
                        pointBackgroundColor: 'rgba(0, 0, 140)'
                    }
                ]}
            }/>
        )
    }

    carHandler(e) {
        this.setState({
            carValue: e.target.value
        });
    }

    timeHandler(e) {
        this.setState({
            timeValue: e.target.value
        });
    }

    render() {
        return (
            <div>
                <NavBar2/>

                <UserLinks/>

                <div className="container-fluid">
                    <div className="row justify-content-around align-items-center no-gutters">
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span> {/* what if we used 100% of our brains */}

                        <select id="cars" name="cars" onChange={this.carHandler}>
                            {this.state.carNames.map((i, key) => {return <option key={key} value={key}>{i}</option>;})}
                        </select>

                        <select id="timeperiod" name="timeperiod" onChange={this.timeHandler}>
                            <option value="lastmonth">Last Month</option>
                            <option value="last3months">Last 3 Months</option>
                            <option value="last6months">Last 6 Months</option>
                            <option value="lastyear">Last Year</option>
                        </select>

                        <button className="btn btn-primary" onClick={this.clickHandler}>Apply</button>

                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span> {/* what if we used 100% of our brains */}
                    </div>
                </div>
                <br/>
                <div className="container-fluid chart">
                    {this.LineChart()}
                </div>
                <br/>
                <div className="container-fluid">
                    <div className="row justify-content-around align-items-center">
                        <Link to="/user/analytics/history"><button className="btn btn-primary">See full charge history</button></Link>
                    </div>
                </div>

                <br/>
            </div>
        )
    }
}

export default UserAnalytics;
