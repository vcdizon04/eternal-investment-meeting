import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../../constants/constants';
import Swal from 'sweetalert2';

class EditPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirm_password: ''
        }
    }

    handleSave = e => {
        this.setState({
            isLoading: true
        });
        const data = {
            password: this.state.password,
            password_confirmation: this.state.confirm_password
        }
        request('POST', '/auth/reset', data, true).then(res => {
            console.log(res);
            this.setState({
                isLoading: false
            })
            Swal.fire(
                'Success',
                res.data.message,
                'success'
            )
        }).catch(err => {
            this.setState({
                isLoading: false
            })
            Swal.fire(
                'Error',
                'Check password and password confirmation',
                'error'
            )
        })
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    

    render() {
        return (
            <div>
                <div className="page-head mb_30">
                    <div className="head">
                        <h1 className="page-title">Edit Password</h1>
                        <nav>
                            <ol className="breadcrumb page-title">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item current">Edit Passwords</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirm_password" value={this.state.confirm_password} onChange={this.handleChange} className="form-control" />
                        </div>
                    </div>
                </div>
                <button disabled={this.state.isLoading} onClick={this.handleSave} className="btn btn-orange">
                    {
                        this.state.isLoading ? (
                            <React.Fragment>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                Loading...
                            </React.Fragment>
                        ) : 'Save'
                    }
                </button>
            </div>
        );
    }
}

export default EditPassword;