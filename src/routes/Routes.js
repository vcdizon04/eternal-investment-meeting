import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import LogIn from '../pages/LogIn/LogIn';
import Attendance from '../pages/Attendance/Attendance';
import ProtectedRoute from '../components/protected-route/protectedRoute';
import AdminRoute from '../components/protected-route/adminRoute';
import Absents from '../pages/Absents/Absents';
import ResetPassword from '../pages/ResetPassword/ResetPassword';
import DailyAttendance from '../pages/DailyAttendance/DailyAttendance';

function Routes() {
        return (
            <Switch>
                <ProtectedRoute path="/meeting" exact component={Attendance} />
                <ProtectedRoute path="/" exact component={DailyAttendance} />
                <Route path="/reset-password" exact component={ResetPassword} />
                <AdminRoute path="/absents" exact component={Absents} />
                <Route path="/login" component={LogIn} />
            </Switch>
        );
}

export default Routes;