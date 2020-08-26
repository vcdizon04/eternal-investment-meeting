import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import LogIn from '../pages/LogIn/LogIn';
import Attendance from '../pages/Attendance/Attendance';
import ProtectedRoute from '../components/protected-route/protectedRoute';

function Routes() {
        return (
            <Switch>
                <ProtectedRoute path="/" exact component={Attendance} />
                <Route path="/login" component={LogIn} />
            </Switch>
        );
}

export default Routes;