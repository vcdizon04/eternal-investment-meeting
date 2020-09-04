import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../../constants/constants';
import UserContext from '../../contexts/user';
import Loader from '../../components/loader/loader';

class DailyAttendance extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    handleStamp = e => {

    }

    getAttendanceToday() {
        return request('GET', '/attendance', {username: this.context.user.id}, true)
    }

    init() {
        this.setState({
            isLoading: true
        })
        this.getAttendanceToday().then(res => {
            this.setState({
                isLoading: false
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

                    {
                        this.state.isLoading && <Loader />
                    }
                    <div className="text-center mt-5">
                        <p className="mb-3">You are not stamped for the day yet</p>
                        <button onClick={this.handleStamp} className="btn btn-orange mb-4 mr-2">
                            {
                                this.state.stamping ? (
                                    <React.Fragment>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                        Loading...
                                    </React.Fragment>
                                ) : 'STAMP IN'
                            }
                        </button>
                    </div>
                </div>	
            </div>
        );
    }
}

export default DailyAttendance;