import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    // Link,
    Redirect,
    // NavLink
} from "react-router-dom";
import './user.css';

import MainPage from './mainpage';
import NotFoundPage from './404';
//UserPages
import UserAnalytics from '../components/UserAnalytics';
import UserFullHistory from '../components/UserFullHistory';
import PaymentMethods from '../components/PaymentMethods';
import AddPaymentMethod from '../components/AddPaymentMethod';
import UserReview from '../components/UserReview';
import UserCharge from '../components/UserCharge';

const UserPage = () => {
  if (JSON.parse(localStorage.getItem('login')) != null)
    return(
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={MainPage}/>
            <Route exact path="/user/analytics" component={UserAnalytics}/>
            <Route exact path="/user/analytics/history" component={UserFullHistory}/>
            <Route exact path="/user/paymentmethods" component={PaymentMethods}/>
            <Route exact path="/user/paymentmethods/add" component={AddPaymentMethod}/>
            <Route exact path="/user/review" component={UserReview}/>
            <Route exact path="/user/charge" component={UserCharge}/>
            <Redirect to="/user/analytics"/>
          </Switch>
        </Router>
      </div>
    )
  else
    return(
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={MainPage}/>
            <Route exact path="/404" component={NotFoundPage}/>
            <Redirect to="/404"/>
          </Switch>
        </Router>
      </div>
    )
};

export default UserPage;
