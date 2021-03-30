import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    // Link,
    Redirect,
    // NavLink
} from "react-router-dom";

import MainPage from './mainpage';
import NotFoundPage from './404';
//ParkingOwnerPages
import ParkingOwnerAnalytics from '../components/ParkingOwnerAnalytics';
import ParkingOwnerFullHistory from '../components/ParkingOwnerFullHistory';
import ParkingOwnerManage from '../components/ParkingOwnerManage';
import AddStation from '../components/AddStation';
import EditStation from '../components/EditStation';
import ParkingOwnerReview from '../components/ParkingOwnerReview';

const ParkingOwnerPage = () => {
  if (JSON.parse(localStorage.getItem('login')) != null)
    return(
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={MainPage}/>
            <Route exact path="/parkingowner/analytics" component={ParkingOwnerAnalytics}/>
            <Route exact path="/parkingowner/analytics/history" component={ParkingOwnerFullHistory}/>
            <Route exact path="/parkingowner/manage" component={ParkingOwnerManage}/>
            <Route exact path="/parkingowner/manage/add" component={AddStation}/>
            <Route exact path="/parkingowner/manage/edit" component={EditStation}/>
            <Route exact path="/parkingowner/review" component={ParkingOwnerReview}/>
            <Redirect to="/parkingowner/analytics"/>
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

export default ParkingOwnerPage;
