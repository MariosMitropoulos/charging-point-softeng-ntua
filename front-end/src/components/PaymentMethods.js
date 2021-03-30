import 'bootstrap/dist/css/bootstrap.css';
import './PaymentMethods.css';
import NavBar2 from '../components/NavBar2';
import UserLinks from './UserLinks';
import { Link } from 'react-router-dom';
import { Component } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

class PaymentMethods extends Component {
    constructor() {
        super();

        this.state={
            payment_card: null,
            length: null,
            render: null
        }
    }

    componentDidMount() {
        this.PaymentMethod();
    }

    replaceChar = (str, arr, char = '*') => {
        const replacedString = str.split("").map(word => {
           return arr.includes(word) ? word : char;
        }).join("");
        return replacedString;
    };

    async PaymentMethod() {
        let userID = jwt.decode(JSON.parse(localStorage.getItem('login')).token)._id;

        try {
            let res = await axios.get('https://localhost:8765/evcharge/api/queries/userCards/' + userID);
            // console.log(res);
            this.setState({
                payment_card: res.data[0].payment_card,
                length: res.data[0].payment_card.length
            });

            var rows = [];
            for (var i = 0; i < this.state.length; i++) {
                for (var j = this.state.payment_card[i].number.length; j > 0; j--) {
                    if (this.state.payment_card[i].number.charAt(j) === '-')
                        break;
                }
                let stars = null;
                if (j === 0) {
                    stars = this.state.payment_card[i].number.slice(0, this.state.payment_card[i].number.length - 4);
                    stars = this.replaceChar(stars, ['-']);
                    stars = stars + this.state.payment_card[i].number.slice(this.state.payment_card[i].number.length - 4, this.state.payment_card[i].number.length);
                }
                else {
                    stars = this.state.payment_card[i].number.slice(0, j);
                    stars = this.replaceChar(stars, ['-']);
                    stars = stars + this.state.payment_card[i].number.slice(j, this.state.payment_card[i].number.length);
                }

                rows.push(
                    <div className="row justify-content-around align-items-center" key={i}>
                        <div className="payment">
                            <h3>Credit Card</h3>
                            <p>Card Number: {stars}</p>
                            <p>Valid Through: {this.state.payment_card[i].exp_date.slice(0, 2)}/20{this.state.payment_card[i].exp_date.slice(3)}</p>
                            <span>Owner: {this.state.payment_card[i].owner}</span>
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
                    {this.state.render}

                    <div className="row justify-content-around align-items-center">
                        <Link to="/user/paymentmethods/add"><button className="btn btn-primary">+ Add a new payment method</button></Link>
                    </div>
                </div>

                <br/>
            </div>
        );
    }
}

export default PaymentMethods;
