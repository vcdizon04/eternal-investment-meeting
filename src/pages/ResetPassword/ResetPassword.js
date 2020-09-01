import React, { Component } from 'react';
import emailSvg from '../../public/svg/email.svg';
import passwordSvg from '../../public/svg/password.svg';
import { Link } from 'react-router-dom';
import Logo from '../../public/images/logo.png';
import '../../public/styles/authentication.scss';
import { request } from '../../constants/constants';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            password_confirmation: ''
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({
            isLoading: true
        })
        const data = {
            password: this.state.password,
            password_confirmation: this.state.password_confirmation
        }
        request('POST', '/auth/reset', data, true).then(res => {
            console.log(res)
            
            this.setState({
                isLoading: false
            })

            Swal.fire(
                'Success',
                res.data.message,
                'success'
            ).then(() => {
                Cookies.remove('user');
                window.location.href = "/"
            })
            
        }).catch(err => {
            this.setState({
                isLoading: false
            })
            Swal.fire(
                'Error',
                'There was an error please check your password',
                'error'
            );
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
                            <label className="label">Reset your password</label>
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
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <span className="icon icon-pass">
                                                <img src={passwordSvg} className="imgsvg" alt="password" />
                                            </span>
                                        </span>
                                    </div>
                                    <input name="password_confirmation" onChange={this.handleChange} value={this.state.password_confirmation} type="password" className="form-control" placeholder="Confirm Password" />
                                </div>
                            </div>
                          
                        </div>
                        <div className="forgot-keepme">
                            <div className="row no-gutters">
                                {/* <div className="col-5">
                                    <div className="forgot-link">
                                        <Link to="/forgot-password">Forgot Password</Link>
                                    </div>
                                </div> */}
                                {/* <div className="col-7">
                                    <div className="keep-me">
                                        <label htmlFor="signedin" className="check-box">
                                            <input type="checkbox" name="signedin" id="signedin" />
                                            <span className="text"><span>Keep Me Signed in</span></span>
                                        </label>
                                    </div>
                                </div> */}
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
                                ) : 'Reset Password'
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

export default ResetPassword;