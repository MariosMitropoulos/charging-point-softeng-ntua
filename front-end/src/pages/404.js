import React from 'react';
import { Link } from 'react-router-dom';
import './404.css';

const NotFoundPage = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="error-template">
                        <h1>Oops!</h1>
                        <h2>404 Not Found</h2>
                        <div className="error-details">
                            Sorry, an error has occured, requested page not found or permission not granted to access it!
                        </div>
                        <div className="error-actions">
                            <Link to="/" className="btn btn-primary btn-lg"><span className="glyphicon glyphicon-home"></span>Take Me Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
