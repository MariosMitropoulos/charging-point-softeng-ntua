import './SignIn.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state={
            username: null,
            password: null,
            login: false,
            token: null,
            message: ''
        }

        this.login = this.login.bind(this)
    }

    async login(event) {
        event.preventDefault()

        try {
            const params = new URLSearchParams()
            params.append('username', this.state.username)
            params.append('password', this.state.password)
            const res = await axios.post('https://localhost:8765/evcharge/api/login', params,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})

            localStorage.setItem('login', JSON.stringify({
                login: true,
                token: res.data.token
            }))
            this.setState({login: true})

            const res2 = jwt.decode(res.data.token)
            // console.log(res2)

            if (res2.account_type === 'vehicleOwner')
                window.location.href = "/user";
            else if (res2.account_type === 'stationOwner')
                window.location.href = "/parkingowner";
            else if (res2.account_type === 'electricalCompanyOperator')
                window.location.href = "/energyemployee";
            else if (res2.account_type === 'admin')
                window.location.href = "/admin";
        }
        catch (err) {
            this.setState({message: 'Invalid combination!'});
            console.log(err);
        }
    }

    render() {
        return (
            <div className="container-fluid bg">
                <div className="row justify-content-around align-items-center no-gutters">
                    <div className="col-md-5 letters">
                        <div className="form-container">
                            <h2 className="title">Welcome to Charging Point!</h2>
                            <p className="paragraph">Charging Point lays the foundations for a future of smarter, reliable, and emission-free mobility, accessible by everyone, everywhere. Charging Point offers a total ev charging solution from compact, high quality AC wallboxes, reliable DC fast charging stations with robust connectivity, to innovative on-demand electric bus charging systems, we deploy infrastructure that meet the needs of the next generation of smarter mobility.</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <form className="form-container">
                            <h4>Sign In</h4>
                            <br/>
                            <div className="form-group">
                                <label htmlFor="username">Username:</label><br/>
                                <input type="text" className="form-control" id="username" name="username" onChange={(e) => {this.setState({username: e.target.value})}} required/><br/>
                                <label htmlFor="password">Password:</label><br/>
                                <input type="password" className="form-control" id="password" name="password" onChange={(e) => {this.setState({password: e.target.value})}} required/><br/>
                                <div className="message">
                                    {this.state.message}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block" onClick={this.login}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignIn;
