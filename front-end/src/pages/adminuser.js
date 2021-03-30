import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { Link } from 'react-router-dom';
import nickie from '../components/images/42.jpeg'

const AdminPage = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="error-template">
                        <h2>Hello admin!</h2>
                        <div className="error-details">
                            <p>Unfortunately, there are no pages for you on the website.</p>
                            <span>Please use our cli-client to access your priviliges.</span>
                            <br/>
                            <br/>
                        </div>
                        <img  src={nickie} alt="42" width="25%"/>
                        <div className="error-actions">
                            <Link to="/" className="btn btn-primary btn-lg"><span className="glyphicon glyphicon-home"></span>Take Me Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
