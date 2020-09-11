import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../../constants/constants';
import UserContext from '../../contexts/user';
import Loader from '../../components/loader/loader';
import Swal from 'sweetalert2';

class DailyAttendance extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    handleStamp = e => {
        this.setState({
            stampLoading: true
        });
        request("POST", `/users/${this.context.user.id}/attendance`, {}, true)
        .then(res => {
            console.log(res);
            this.setState({
                stampLoading: false
            })
            this.init();
            Swal.fire(
                'Success',
                res.data.message,
                'success'
            )
        }).catch(err => {
            this.setState({
                stampLoading: false
            })
        })
    }

    getAttendanceToday() {
        console.log(this.context.user)
        return request('GET', `/users/${this.context.user.id}/attendance`, {}, true)
    }

    init() {
        this.setState({
            isLoading: true
        })
        this.getAttendanceToday().then(res => {
            this.setState({
                isLoading: false,
                attendance: res.data.data
            })
            console.log(res);
        }).catch(err => {
            console.error(err);
            this.setState({
                isLoading: false
            })
        })
    }

    componentDidMount() {
        this.init();
    }
    
    render() {
        return (
            <div>
                 <div className="page-head mb_30">
                    <div className="head">
                        <h1 className="page-title">Daily Attendance</h1>
                        <nav>
                            <ol className="breadcrumb page-title">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item current">Daily Attendance</li>
                            </ol>
                        </nav>
                    </div>

                </div>	


                    <div className="text-center" style={{position: 'relative'}}>
                    {
                        this.state.isLoading && <Loader />
                    }
                    </div>
                    {
                        !this.state.attendance ? (
                            <div className="text-center mt-5">
                                <p className="mb-3">You are not stamped for the day yet</p>
                                <button onClick={this.handleStamp} className="btn btn-orange mb-4 mr-2">
                                    {
                                        this.state.stampLoading ? (
                                            <React.Fragment>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                Loding...
                                            </React.Fragment>
                                        ) : 'STAMP IN'
                                    }
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-3">
                                    You already stammped in for today
                                </p>
                                <p>
                                    <span className="mr-2">Date: </span>
                                    <span>
                                        {this.state.attendance.date}
                                    </span>
                                </p>
                                <p>
                                    <span className="mr-2">Time: </span>
                                    <span>
                                        {this.state.attendance.time}
                                    </span>
                                </p>
                                <p>
                                    <span className="mr-2">Remarks: </span>
                                    <span>
                                        {this.state.attendance.remarks}
                                    </span>
                                </p>
                            </div>
                        )
                    }
            </div>
        );
    }
}

export default DailyAttendance;