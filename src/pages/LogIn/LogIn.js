import React, { Component } from 'react';
import emailSvg from '../../public/svg/email.svg';
import passwordSvg from '../../public/svg/password.svg';
import { Link } from 'react-router-dom';
import Logo from '../../public/images/logo.png';
import './Login.scss';
import '../../public/styles/authentication.scss';
import { request } from '../../constants/constants';
import Cookies from 'js-cookie';

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    
    handleSubmit = e => {
        e.preventDefault();
        this.setState({
            isLoading: true
        })
        const data = {
            username: this.state.username,
            password: this.state.password
        }
        request('POST', '/auth/login', data).then(res => {
            console.log(res)
            this.setState({
                isLoading: false
            })
            Cookies.set('user', res.data);
            window.location.href = "/"
        }).catch(err => {
            console.error(err);
        })
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <div className="authentication">
            <div className="login-container">
                <div className="login-wrap">
                    <p className="logo">
                        <img src={Logo} alt="logo" />
                    </p>

                    <form onSubmit={this.handleSubmit}>
                        <div className="signin">
                            <label className="label">Sign In</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <span className="icon icon-email"><img src={emailSvg} className="imgsvg" alt="email" /></span>
                                        </span>
                                    </div>
                                <input type="text" onChange={this.handleChange} name="username" value={this.state.username} className="form-control" placeholder="Username" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <span className="icon icon-pass">
                                                <img src={passwordSvg} className="imgsvg" alt="password" />
                                            </span>
                                        </span>
                                    </div>
                                    <input name="password" onChange={this.handleChange} value={this.state.password} type="password" className="form-control" placeholder="Password" />
                                </div>
                            </div>
                        </div>
                        <div className="forgot-keepme">
                            <div className="row no-gutters">
                                <div className="col-5">
                                    <div className="forgot-link">
                                        <Link to="/forgot-password">Forgot Password</Link>
                                    </div>
                                </div>
                                <div className="col-7">
                                    <div className="keep-me">
                                        <label htmlFor="signedin" className="check-box">
                                            <input type="checkbox" name="signedin" id="signedin" />
                                            <span className="text"><span>Keep Me Signed in</span></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="action">
                        <button type="submit" className="btn btn-orange btn-block" disabled={this.state.isLoading}>
                            {
                                this.state.isLoading ? (
                                    <React.Fragment>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                        Loading...
                                    </React.Fragment>
                                ) : 'Signin'
                            }
                        </button>

                        </div>
                    </form>

                </div>
            </div>
        </div>
        );
    }
}

export default LogIn;