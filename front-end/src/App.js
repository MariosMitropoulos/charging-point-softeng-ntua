import React, { Component } from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    // Link,
    Redirect
} from "react-router-dom";

//Pages
import MainPage from './pages/mainpage';
import NotFoundPage from './pages/404';
import UserPage from './pages/user';
import ParkingOwnerPage from './pages/parkingowner';
import EnergyEmployeePage from './pages/energyemployee';
import AdminPage from './pages/adminuser';

class App extends Component {
    render () {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={MainPage}/>

                    <Route exact path="/user" component={UserPage}/>
                    <Route exact path="/user/analytics" component={UserPage}/>
                    <Route exact path="/user/analytics/history" component={UserPage}/>
                    <Route exact path="/user/paymentmethods" component={UserPage}/>
                    <Route exact path="/user/paymentmethods/add" component={UserPage}/>
                    <Route exact path="/user/review" component={UserPage}/>
                    <Route exact path="/user/charge" component={UserPage}/>

                    <Route exact path="/parkingowner" component={ParkingOwnerPage}/>
                    <Route exact path="/parkingowner/analytics" component={ParkingOwnerPage}/>
                    <Route exact path="/parkingowner/analytics/history" component={ParkingOwnerPage}/>
                    <Route exact path="/parkingowner/manage" component={ParkingOwnerPage}/>
                    <Route exact path="/parkingowner/manage/add" component={ParkingOwnerPage}/>
                    <Route exact path="/parkingowner/manage/edit" component={ParkingOwnerPage}/>
                    <Route exact path="/parkingowner/review" component={ParkingOwnerPage}/>

                    <Route exact path="/energyemployee" component={EnergyEmployeePage}/>
                    <Route exact path="/energyemployee/analytics" component={EnergyEmployeePage}/>
                    <Route exact path="/energyemployee/analytics/history" component={EnergyEmployeePage}/>

                    <Route exact path="/admin" component={AdminPage}/>

                    <Route exact path="/404" component={NotFoundPage}/>
                    <Redirect to="/404"/>
                </Switch>
            </Router>
        )
    }
}

export default App;
