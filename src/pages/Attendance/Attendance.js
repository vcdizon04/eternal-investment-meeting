import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/loader/loader';
import ReactTable from 'react-table';
import Pagination from '../../components/pagination/pagination';
import { request, socket } from '../../constants/constants';
import Swal from 'sweetalert2';
import UserContext from '../../contexts/user';

class Attendance extends Component {
    Socket;
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.Socket = socket();
        this.state = {
            selected: {},
			pageSize: 10,
			currentPage: 1,
			selectedAll: {},
			indeterminateSign: false,
			users: [],
            isLoading: false,
            meetingState: 'none',
            rollCallState: null,
            isMeetingTriggered: false
        }
    }

    handleThProps(state, rowInfo, column, instance) {
		return {
			onClick: (e) => {
				if (column.sortable !== false) {
					if (column.className !== 'header-checkbox-toggle') {
						instance.sortColumn(column)
					}
				}
			}
		}
	}

	handlePageChange(data) {
		this.setState({ currentPage: data + 1 });
	}

	handlePageSizeChange(data) {
		if (this.state.pageSize < data) {
			this.setState({ pageSize: data }, () => {
				if (this.state.selectedAll[this.state.currentPage] === true) {
					this.setState({
						indeterminateSign: true
					})
				}
			});
		} else {
			this.setState({ pageSize: data }, () => {
				const start = (this.state.currentPage - 1) * this.state.pageSize;
				const end = start + this.state.pageSize;
				let newSelected = {};
				let newSelectPage;
				if (this.state.selectedAll[this.state.currentPage] === true) {
					newSelectPage = Object.assign(this.state.selectedAll, { [this.state.currentPage]: true });
					this.state.users.forEach(data => {
						newSelected[data.id] = false;
					});
					this.state.users.slice(start, end).forEach(data => {
						newSelected[data.id] = true;
					});
					let newObj = Object.assign(this.state.selected, newSelected);
					const selectedList = Object.keys(newObj).filter(obj => {
						return newObj[obj] === true;
					});
					// this.props.selectedList(selectedList);
					this.setState({
						selected: newObj,
						selectedAll: newSelectPage,
						indeterminateSign: false
					});
				}
			});
        }
    }

    handleStart = e => {
        this.setState({
            meetingStarting: true
        })
        request('POST', '/meeting/start', {}, true)
        .then(res => {
            console.log(res);
            this.setState({
                meetingStarting: false
            })
            Swal.fire(
                'Success',
                res.data.message,
                'success'
            )
        })
    }

    handleStop = e => {
        this.setState({
            meetingStopping: true
        })
        request('POST', `/meeting/${this.state.meetingState == 'late-start' ? 'end' : 'stop'}`, {}, true)
        .then(res => {
            console.log(res);
            this.setState({
                meetingStopping: false
            })
            Swal.fire(
                'Success',
                res.data.message,
                'success'
            )
        })
    }

    handleAdjourned = e => {
        this.setState({
            meetingAdjourning: true
        })
        request('POST', '/meeting/adjourned', {}, true)
        .then(res => {
            console.log(res);
            this.setState({
                meetingAdjourning: false
            })
            Swal.fire(
                'Success',
                res.data.message,
                'success'
            )
        })
    }

    handleStamp = e => {
        this.setState({
            stamping: true
        })
        request('POST', '/meeting/users', {
            ...this.context.user,
            isLate: this.state.meetingState == 'start' ? false : true
        }, true)
        .then(res => {
            console.log(res);
            this.setState({
                stamping: false
            })
            Swal.fire(
                'Success',
                res.data.message,
                'success'
            );
        })
    }

    hanldeStartLateEntry = e => {
        this.setState({
            lateEntryStarting: true
        })
        request('POST', '/meeting/late', {}, true)
        .then(res => {
            console.log(res);
            this.setState({
                lateEntryStarting: false
            })
            Swal.fire(
                'Success',
                res.data.message,
                'success'
            )
        })
    }

    handleRollCall = e => {
        this.setState({
            rollCalling: true
        })
        request('POST', '/meeting/roll-call/start', {}, true)
        .then(res => {
            console.log(res);
            this.setState({
                rollCalling: false
            })
            Swal.fire(
                'Success',
                res.data.message,
                'success'
            )
        })
    }

    handleStopRollcall = e => {
        this.setState({
            rollCalling: true
        })
        request('POST', '/meeting/roll-call/stop', {}, true)
        .then(res => {
            console.log(res);
            this.setState({
                rollCalling: false
            })
            Swal.fire(
                'Success',
                res.data.message,
                'success'
            )
        })
    }

    async init() {
        this.setState({
            isLoading: true
        })
        request('GET', '/meeting', {}, true)
        .then(res => {
            console.log(res);
            this.setState({
                isLoading: false,
                users: res.data.data.users,
                meetingState: res.data.data.state,
                isMeetingTriggered: res.data.data.isMeetingTriggered
            })
        })
        this.Socket.on(`meeting/state`, state => {
            console.log(state)
            this.setState({
                meetingState: state,
                isMeetingTriggered: true
            })
        });

        this.Socket.on(`meeting/users`, users => {
            console.log(users)
            this.setState({
                users: users
            })
        });

        this.Socket.on(`meeting/rollcall/state`, state => {
            console.log(state)
            if(!(this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team') && state) {
                Swal.fire({
                    title: "Roll Call",
                    text: "Are you still there?",
                    icon: "info",
                    confirmButtonText: "Yes"
                }).then((data) => {
                    console.log(data);
                    if(data.value) {
                        request('PUT', `/meeting/roll-call/users/${this.context.user.id}`, {}, true)
                        .then(res => {
                            console.log(res);
                            this.setState({
                                rollCalling: false
                            })
                            Swal.fire(
                                'Success',
                                res.data.message,
                                'success'
                            )
                        })
                    }
                })
            }
            this.setState({
                rollCallState: state
            })
        });
    }

    componentDidMount() {
        this.init()
    }
    
    render() {

        const columns = [
            {
                Header: 'Full Name',
                Cell: row => {
                    return (
                        <span>
                            {row.original.username}
                        </span>
                    )
                }
            },
            {
                Header: 'Team',
                Cell: row => {
                    return (
                        <span>
                            {row.original.team}
                        </span>
                    )
                }
            },
            {
                Header: 'Employee Level',
                Cell: row => (
                    <span>{row.original.employee_level}</span>
                ),
            },
            {
                Header: 'Transition',
                Cell: row => (
                    <span>{row.original.transition }</span>
                ),
            },
            {
                Header: 'Schedule',
                Cell: row => (
                    <span>{row.original.schedule }</span>
                ),
            },

            {
                Header: 'Status',
                Cell: row => (
                    <span>{row.original.status }</span> 
                ),
            },

            {
                Header: 'Late',
                Cell: row => (
                    <span className={row.original.isLate ? 'text-warning' : 'text-success'}>{row.original.isLate ? 'Late' : 'On Time' }</span>
                ),
            },

            {
                Header: 'Roll Call',
                Cell: row => (
                    <span>{row.original.rollCall && <span className="text-success"> Active </span> }</span>
                ),
            },
            // {
            //     Header: 'Remarks',
            //     Cell: row => (
            //         <span>{row.original.gender }</span>
            //     ),
            // },
            
            
        ]
        return (
            <div>
                <div className="page-head mb_30">
                    <div className="head">
                        <h1 className="page-title">Meeting Attendance</h1>
                        <nav>
                            <ol className="breadcrumb page-title">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item current">Attendance</li>
                            </ol>
                        </nav>
                    </div>
                </div>		

                <div className="table-area">
                    <div className="actions">
                        {
                         ((this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team')  && this.state.isMeetingTriggered) && (
                               <button onClick={this.handleAdjourned} className="btn btn-info mb-4 mr-2">Adjourned</button>
                           )
                        }
                       {
                           (this.state.meetingState == 'none') ? (

                                    (this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team') ? (
                                        <React.Fragment>
                                            <button onClick={this.handleStart} className="btn btn-orange mb-4">
                                                {
                                                    this.state.meetingStarting ? (
                                                        <React.Fragment>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                            Loading...
                                                        </React.Fragment>
                                                    ) : 'Start'
                                                }
                                            </button>
                                            {(this.state.isLoading) && <Loader />}
                                            <ReactTable
                                                PaginationComponent={Pagination}
                                                data={this.state.users}
                                                minRows={5}
                                                columns={columns}
                                                noDataText={this.state.isLoading ? '' : "No data available right now."}
                                                // defaultPageSize={this.state.pageSize}
                                                pageSizeOptions={[10, 25, 50, 100]}
                                                resizable={true}
                                                // onPageChange={(index) => this.handlePageChange(index)}
                                                // onPageSizeChange={(size) => this.handlePageSizeChange(size)}
                                                // getTheadThProps={(state, rowInfo, column, instance) => this.handleThProps(state, rowInfo, column, instance)}
                                            />
                                        </React.Fragment>
                                    ) : (
                                        <p className="text-center font-weight-bold">Please wait the host to start the meeting</p>

                                    )
                               
                           ) :  this.state.meetingState == 'late'  ?  (
                                (this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team') ? (
                                    <React.Fragment>
                                    <button onClick={this.hanldeStartLateEntry} className="btn btn-warning mb-4">Late Entry</button>
                                    <ReactTable
                                        PaginationComponent={Pagination}
                                        data={this.state.users}
                                        minRows={5}
                                        columns={columns}
                                        noDataText={this.state.isLoading ? '' : "No data available right now."}
                                        // defaultPageSize={this.state.pageSize}
                                        pageSizeOptions={[10, 25, 50, 100]}
                                        resizable={true}
                                        // onPageChange={(index) => this.handlePageChange(index)}
                                        // onPageSizeChange={(size) => this.handlePageSizeChange(size)}
                                        // getTheadThProps={(state, rowInfo, column, instance) => this.handleThProps(state, rowInfo, column, instance)}
                                    />
                                    </React.Fragment>
                                ) : (
                                    <p className="text-center font-weight-bold">Please wait the host to start the meeting</p>
                                )
                           ) : (
                                ((this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team')) ? (
                                    <React.Fragment>

                                        {
                                            !this.state.rollCallState ? (
                                                <button onClick={this.handleRollCall} className="btn btn-orange mr-2 mb-4">Roll Call</button>
                                            ) : <button onClick={this.handleStopRollcall} className="btn btn-danger mr-2 mb-4">Stop Roll Call</button>
                                        }
                                  

                                        {
                                                
                                            this.state.meetingState !== 'end' && (
                                                <React.Fragment>
                                                    <button onClick={this.handleStop} className="btn btn-danger mb-4">Stop</button>
                                                </React.Fragment>
                                            )
                                                
                                        }
                                         <ReactTable
                                            PaginationComponent={Pagination}
                                            data={this.state.users}
                                            minRows={5}
                                            columns={columns}
                                            noDataText={this.state.isLoading ? '' : "No data available right now."}
                                            // defaultPageSize={this.state.pageSize}
                                            pageSizeOptions={[10, 25, 50, 100]}
                                            resizable={true}
                                            // onPageChange={(index) => this.handlePageChange(index)}
                                            // onPageSizeChange={(size) => this.handlePageSizeChange(size)}
                                            // getTheadThProps={(state, rowInfo, column, instance) => this.handleThProps(state, rowInfo, column, instance)}
                                        />

                                       
                                    </React.Fragment>

                                ) : (
                                    <React.Fragment>
                                        <div className="text-center">
                                            {
                                            (  this.state.users.findIndex(user => this.context.user.id == user.id) < 0   ) ? (

                                                    this.state.meetingState !== 'end' && (
                                                    <React.Fragment>
                                                        <p className="font-weight-bold mb-3">Meeting is starting now, please stamp</p>
                                                        <button onClick={this.handleStamp} className="btn btn-orange">
                                                            {
                                                                this.state.stamping ? (
                                                                    <React.Fragment>
                                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                                        Loading...
                                                                    </React.Fragment>
                                                                ) : 'Stamp'
                                                            }
                                                        </button>
                                                    </React.Fragment>
                                                    )
                                                
                                                ) : (
                                                <h3 className="font-weight-bold mb-3">You are {this.state.users[this.state.users.findIndex(user => this.context.user.id == user.id)].isLate ? <span className="text-danger">Late</span> : <span className="text-success">On Time</span>}</h3>
                                                )
                                            }

                                        </div>
                                    </React.Fragment>
                                )
                           )

                       }

                     

                    </div>
                   
                </div>
            </div>
        );
    }
}

export default Attendance;