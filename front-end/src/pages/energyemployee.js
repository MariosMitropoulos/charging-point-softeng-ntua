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
//EnergyEmployeePages
import EnergyEmployeeAnalytics from '../components/EnergyEmployeeAnalytics';
import EnergyEmployeeFullHistory from '../components/EnergyEmployeeFullHistory';

const EnergyEmployeePage = () => {
  if (JSON.parse(localStorage.getItem('login')) != null)
    return(
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={MainPage}/>
            <Route exact path="/energyemployee/analytics" component={EnergyEmployeeAnalytics}/>
            <Route exact path="/energyemployee/analytics/history" component={EnergyEmployeeFullHistory}/>
            <Redirect to="/energyemployee/analytics"/>
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

export default EnergyEmployeePage;
