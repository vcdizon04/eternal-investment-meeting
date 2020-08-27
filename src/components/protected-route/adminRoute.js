import React, { Component } from 'react';
import UserContext from '.././../contexts/user';
import history from '../../history';
import { Route, Redirect } from 'react-router-dom';
import NotFound from '../../pages/NotFound/NotFound';

class AdminRoute extends Component {
    static contextType = UserContext;
    componentDidMount() {
        console.log(this.context.user)
    }
    render() {
        if (!this.context.user) return <NotFound />
        if(!(this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team')) return   <NotFound />
        return <Route {...this.props}></Route>
        
    }
}

export default AdminRoute;