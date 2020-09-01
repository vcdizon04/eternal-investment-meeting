import React, { Component } from 'react';
import UserContext from '.././../contexts/user';
import history from '../../history';
import { Route, Redirect } from 'react-router-dom';

class ProtectedRoute extends Component {
    static contextType = UserContext;
    componentDidMount() {
        console.log(this.context.user)
    }
    render() {
        if (!this.context.user) 
        {
            return <Redirect to={'/login' + (this.props.path ? `?redirectPath=${this.props.path}` : '')} />
        } 
        if(this.context.user.change_passwod) return <Redirect to={'/reset-password' + (this.props.path ? `?redirectPath=${this.props.path}` : '')} />
        return <Route {...this.props}></Route>
        
    }
}

export default ProtectedRoute;