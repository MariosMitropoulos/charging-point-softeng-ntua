import './AddPaymentMethod.css';
import 'bootstrap/dist/css/bootstrap.css';
import NavBar2 from '../components/NavBar2';
import { Link } from 'react-router-dom';
import creditcard from './images/credit-card.png'

function AddPaymentMethod() {
    return (
        <div>
            <NavBar2/>

            <br/>

            <div className="container-fluid">
                <div className="row justify-content-around align-items-center">
                    <div className="card">
                        <div className="card-header">
                            <h4>Enter your card details</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input className="form-control" id="name" type="text" placeholder="Enter your name"/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="ccnumber">Credit Card Number</label>
                                        <div className="input-group">
                                            <input className="form-control" type="text" placeholder="0000 0000 0000 0000"/>
                                            <div className="input-group-append">
                                                <span className="input-group-text">
                                                    <img src={creditcard} alt="creditcard" width="23px" height="100%"/>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-sm-4">
                                    <label htmlFor="ccmonth">Month</label>
                                    <select className="form-control" id="ccmonth">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                        <option>11</option>
                                        <option>12</option>
                                    </select>
                                </div>
                                <div className="form-group col-sm-4">
                                    <label htmlFor="ccyear">Year</label>
                                    <select className="form-control" id="ccyear">
                                        <option>2021</option>
                                        <option>2022</option>
                                        <option>2023</option>
                                        <option>2024</option>
                                        <option>2025</option>
                                    </select>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="cvv">CVV/CVC</label>
                                        <input className="form-control" id="cvv" type="text" placeholder="123"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="container-fluid">
                                <div className="row justify-content-around align-items-center">
                                    <button className="btn btn-sm btn-success" type="submit">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="row justify-content-around align-items-center">
                    <Link to="/user/paymentmethods"><button className="btn btn-primary">&#8592; Back to payment methods</button></Link>
                </div>
            </div>

            <br/>
        </div>
    );
}

export default AddPaymentMethod;