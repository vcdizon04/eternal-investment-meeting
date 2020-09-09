import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/loader/loader';
import ReactTable from 'react-table';
import Pagination from '../../components/pagination/pagination';
import { request, socket } from '../../constants/constants';
import Swal from 'sweetalert2';
import UserContext from '../../contexts/user';
import $ from 'jquery';
import webNotification from 'simple-web-notification';


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
            isMeetingTriggered: false,
            origUsers: [],
            filters: []
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
            // Swal.fire(
            //     'Success',
            //     res.data.message,
            //     'success'
            // )
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
            // Swal.fire(
            //     'Success',
            //     res.data.message,
            //     'success'
            // )
        }).catch(err => {
            this.setState({
                meetingStopping: false
            })
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
            // this.init();
            // Swal.fire(
            //     'Success',
            //     res.data.message,
            //     'success'
            // )
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
            // Swal.fire(
            //     'Success',
            //     res.data.message,
            //     'success'
            // )
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
            // Swal.fire(
            //     'Success',
            //     res.data.message,
            //     'success'
            // )
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
            // Swal.fire(
            //     'Success',
            //     res.data.message,
            //     'success'
            // )
        })
    }

    handleFilterChange = e => {
        const filters = this.state.filters;
        console.log(e.target.name, e.target.value)
        let users = this.state.origUsers;
        if(!(filters.findIndex(filter => filter.name == e.target.name && filter.value == e.target.value) > -1)) {
            const index = filters.findIndex(filter => filter.name == e.target.name);
            if(index > -1) {
                filters.splice(index, 1)
            }
            filters.push({ name: e.target.name, value: e.target.value });
            this.setState({
                filters
            })
        }
        users = users.filter(user => {
            let isMatch = true;
            filters.forEach(filter => {
                if(filter.value == 'all') return;
                if(filter.name == 'isLate' || filter.name == 'rollCall') filter.value = JSON.parse(filter.value)
                if(!(user[filter.name] == filter.value)) {
                    isMatch = false;
                }
            })
            return isMatch
        })
        console.log(users)
        this.setState({
            users
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
                origUsers: [...res.data.data.users],
                meetingState: res.data.data.state,
                isMeetingTriggered: res.data.data.isMeetingTriggered,
                rollCallState: res.data.data.rollCallState
            }, () => {
                
            this.Socket.on(`meeting/state`, state => {
                console.log(state)
                this.setState({
                    meetingState: state,
                    isMeetingTriggered: true,
                }, () => {
                    if((this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team') && (this.state.meetingState == 'start' || this.state.meetingState == 'late-start') && this.state.users.findIndex(user => this.context.user.id == user.id) < 0) {
                        $('#stampModal').modal('show')
                        webNotification.showNotification('Meeting Attendance', {
                            body: 'Attendance is now open. You can now click "STAMP IN"',
                            icon: 'my-icon.ico',
                            onClick: function onNotificationClicked() {
                                console.log('Notification clicked.');
                            },
                            autoClose: undefined
                        }, function onShow(error, hide) {
                            if (error) {
                                window.alert('Unable to show notification: ' + error.message);
                            } else {
                                console.log('Notification Shown.');
                     
                                // setTimeout(function hideNotification() {
                                //     console.log('Hiding notification....');
                                //     hide(); //manually close the notification (you can skip this if you use the autoClose option)
                                // }, 5000);
                            }
                        })
                    }
                })
            });
    
            this.Socket.on(`meeting/users`, users => {
                console.log(users)
                this.setState({
                    users: users,
                    origUsers: [...users]
                })
            });

            const index = this.state.users.findIndex(user => user.id == this.context.user.id);
            console.log('index: ', index)
    
            this.Socket.on(`meeting/rollcall/state`, state => {
                const index = this.state.users.findIndex(user => user.id == this.context.user.id);
                console.log('index: ', index)
                console.log(state)
                if( state && index > -1 ) {
                   if(!this.state.users[index].rollCall) {
                    webNotification.showNotification('Meeting Roll Call', {
                        body: 'Roll Call is now running. You can now stamp in "PRESENT".',
                        icon: 'my-icon.ico',
                        onClick: function onNotificationClicked() {
                            console.log('Notification clicked.');
                        },
                        autoClose: undefined
                    }, function onShow(error, hide) {
                        if (error) {
                            window.alert('Unable to show notification: ' + error.message);
                        } else {
                            console.log('Notification Shown.');
                 
                            // setTimeout(function hideNotification() {
                            //     console.log('Hiding notification....');
                            //     hide(); //manually close the notification (you can skip this if you use the autoClose option)
                            // }, 5000);
                        }
                    })
                    Swal.fire({
                        title: "Roll Call",
                        text: 'Roll Call is now running. You can now stamp in "PRESENT".',
                        icon: "info",
                        confirmButtonText: "PRESENT"
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
                }
                this.setState({
                    rollCallState: state
                })

                if(!state) {
                    Swal.close();
                }
            });

            if(res.data.data.rollCallState && index > -1) {
                if( !this.state.users[index].rollCall ) {
                    webNotification.showNotification('Meeting Roll Call', {
                        body: 'Roll Call is now running. You can now stamp in "PRESENT".',
                        icon: 'my-icon.ico',
                        onClick: function onNotificationClicked() {
                            console.log('Notification clicked.');
                        },
                        autoClose: undefined
                    }, function onShow(error, hide) {
                        if (error) {
                            window.alert('Unable to show notification: ' + error.message);
                        } else {
                            console.log('Notification Shown.');
                 
                            // setTimeout(function hideNotification() {
                            //     console.log('Hiding notification....');
                            //     hide(); //manually close the notification (you can skip this if you use the autoClose option)
                            // }, 5000);
                        }
                    })
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
              
            }

            if((this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team') && (this.state.meetingState == 'start' || this.state.meetingState == 'late-start') && this.state.users.findIndex(user => this.context.user.id == user.id) < 0) {
                $('#stampModal').modal('show')
                webNotification.showNotification('Meeting Attendance', {
                    body: 'Attendance is now open. You can now click "STAMP IN"',
                    icon: 'my-icon.ico',
                    onClick: function onNotificationClicked() {
                        console.log('Notification clicked.');
                    },
                    autoClose: undefined
                }, function onShow(error, hide) {
                    if (error) {
                        window.alert('Unable to show notification: ' + error.message);
                    } else {
                        console.log('Notification Shown.');
             
                        // setTimeout(function hideNotification() {
                        //     console.log('Hiding notification....');
                        //     hide(); //manually close the notification (you can skip this if you use the autoClose option)
                        // }, 5000);
                    }
                })
            }
            

            })

        })
      
    }

    componentDidMount() {
        this.init()
    }
    
    render() {

        const teamOptions = [];
        const employeeLevelOptions = [];
        const transitionOptions = [];
        const scheduleOptions = [];
        const statusOptions = [];
        this.state.origUsers.forEach(user => {
            if( !(teamOptions.indexOf(user.team) > -1) ) {
                teamOptions.push(user.team)
            }
            if( !(employeeLevelOptions.indexOf(user.employee_level) > -1) ) {
                employeeLevelOptions.push(user.employee_level)
            }
            if( !(transitionOptions.indexOf(user.transition) > -1) ) {
                transitionOptions.push(user.transition)
            }
            if( !(scheduleOptions.indexOf(user.schedule) > -1) ) {
                scheduleOptions.push(user.schedule)
            }
            if( !(statusOptions.indexOf(user.status) > -1) ) {
                statusOptions.push(user.status)
            }
        });

        const columns = [
            {
                Header: (
                    <React.Fragment>
                        <p>Full Name</p>
                    </React.Fragment>
                ),
                Cell: row => {
                    return (
                        <span>
                            {row.original.username}
                        </span>
                    )
                }
            },
            {
                Header: (
                    <React.Fragment>
                        <p className="mb-2">Team</p>
                        <select name="team" onChange={this.handleFilterChange} className="custom-select">
                        <option value="all">All</option>
                        {
                            teamOptions.map(team => <option value={team}>{team}</option>)
                        }
                        </select>
                    </React.Fragment>
                ),
                Cell: row => {
                    return (
                        <span>
                            {row.original.team}
                        </span>
                    )
                }
            },
            {
                Header: (
                <React.Fragment>
                    <p className="mb-2">Employee Level</p>
                    <select name="employee_level" onChange={this.handleFilterChange} className="custom-select">
                    <option value="all">All</option>
                    {
                        employeeLevelOptions.map(employee_level => <option value={employee_level}>{employee_level}</option>)
                    }
                    </select>
                </React.Fragment>
                ),
                Cell: row => (
                    <span>{row.original.employee_level}</span>
                ),
            },
            {
                Header: (
                <React.Fragment>
                    <p className="mb-2">Transition</p>
                    <select name="transition" onChange={this.handleFilterChange} className="custom-select">
                    <option value="all">All</option>
                    {
                        transitionOptions.map(transiiton => <option value={transiiton}>{transiiton}</option>)
                    }
                    </select>
                </React.Fragment>
                ),
                Cell: row => (
                    <span>{row.original.transition }</span>
                ),
            },
            {
                Header: (
                <React.Fragment>
                    <p className="mb-2">Schedule</p>
                    <select name="schedule" onChange={this.handleFilterChange} className="custom-select">
                    <option value="all">All</option>
                    {
                        scheduleOptions.map(schedule => <option value={schedule}>{schedule}</option>)
                    }
                    </select>
                </React.Fragment>
                ),
                Cell: row => (
                    <span>{row.original.schedule }</span>
                ),
            },

            {
                Header: (
                <React.Fragment>
                    <p className="mb-2">Status</p>
                    <select name="status" onChange={this.handleFilterChange} className="custom-select">
                    <option value="all">All</option>
                    {
                        statusOptions.map(status => <option value={status}>{status}</option>)
                    }
                    </select>
                </React.Fragment>
                ),
                Cell: row => (
                    <span>{row.original.status }</span> 
                ),
            },

            {
                Header: (
                <React.Fragment>
                    <p className="mb-2">Late</p>
                    <select name="isLate" onChange={this.handleFilterChange} className="custom-select">
                        <option value="all">All</option>
                        <option value="true">Late</option>
                        <option value="false">Ontime</option>
                    </select>
                </React.Fragment>
                ),
                Cell: row => (
                    <span className={row.original.isLate ? 'text-warning' : 'text-success'}>{row.original.isLate ? 'Late' : 'On Time' }</span>
                ),
            },

            {
                Header: (
                <React.Fragment>
                    <p className="mb-2">Roll Call</p>
                    <select name="rollCall" onChange={this.handleFilterChange} className="custom-select">
                        <option value="all">All</option>
                        <option value="true">Active</option>
                        <option value="false">Not Active</option>
                    </select>
                </React.Fragment>
                ),
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
                <div className="modal fade" id="stampModal" tabIndex={-1} role="dialog" aria-labelledby="stampModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="stampModal">Attendance</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {
                                ((this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team') && this.state.meetingState !== 'end') && (
                                        this.state.users.findIndex(user => this.context.user.id == user.id) < 0  &&  (
                                            <div className="text-center">
                                                <p className="font-weight-bold mb-3"> Attendance is now open. You can now click "STAMP IN"</p>
                                            </div>  
                                        )
                                ) 
                            }
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.handleStamp} data-dismiss="modal" className="btn btn-orange">
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
                </div>

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
                         ((this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team')  && this.state.isMeetingTriggered && this.state.meetingState !== 'none') && (
                               <button disabled={this.state.meetingAdjourning} onClick={this.handleAdjourned} className="btn btn-info mb-4 mr-2">
                                     {
                                        this.state.meetingAdjourning ? (
                                            <React.Fragment>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                Loading...
                                            </React.Fragment>
                                        ) : 'Adjournded'
                                    }
                               </button>
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
                                                // PaginationComponent={Pagination}
                                                showPagination={false}
                                                data={this.state.users}
                                                minRows={5}
                                                columns={columns}
                                                noDataText={this.state.isLoading ? '' : "No data available right now."}
                                                // defaultPageSize={this.state.pageSize}
                                                // pageSizeOptions={[10, 25, 50, 100]}
                                                resizable={true}
                                                // onPageChange={(index) => this.handlePageChange(index)}
                                                // onPageSizeChange={(size) => this.handlePageSizeChange(size)}
                                                // getTheadThProps={(state, rowInfo, column, instance) => this.handleThProps(state, rowInfo, column, instance)}
                                            />
                                            <p className="mt-2">{this.state.users.length} entries</p>
                                        </React.Fragment>
                                    ) : (
                                        <p className="text-center font-weight-bold">Please wait the host to start the meeting</p>

                                    )
                               
                           ) :  this.state.meetingState == 'late'  ?  (
                                (this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team') ? (
                                    <React.Fragment>
                                    <button onClick={this.hanldeStartLateEntry} className="btn btn-warning mb-4">Late Entry</button>
                                    <ReactTable
                                        // PaginationComponent={Pagination}
                                        showPagination={false}
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
                                        <p className="mt-2">{this.state.users.length} entries</p>

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
                                                    <button disabled={this.state.meetingStopping} onClick={this.handleStop} className="btn btn-danger mb-4 mr-2">
                                                        {
                                                            this.state.meetingStopping ? (
                                                                <React.Fragment>
                                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                                    Loading...
                                                                </React.Fragment>
                                                            ) : this.state.meetingState == 'late-start' ? 'End' : 'Stop'

                                                        }
                                                    </button>
                                                    
                                                    {/* {
                                                        this.state.users.findIndex(user => this.context.user.id == user.id) < 0  &&  (
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
                                                        )
                                                       
                                                    } */}
                                                </React.Fragment>
                                            )
                                                
                                        }
                                         <ReactTable
                                            // PaginationComponent={Pagination}
                                            showPagination={false}
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
                                        <p className="mt-2">{this.state.users.length} entries</p>
                                       
                                    </React.Fragment>

                                ) : (
                                    <React.Fragment>
                                        <div className="text-center">
                                            {
                                            (  this.state.users.findIndex(user => this.context.user.id == user.id) < 0   ) ? (

                                                    this.state.meetingState !== 'end' && (
                                                    <React.Fragment>


                                                        <p className="font-weight-bold mb-3"> Attendance is now open. You can now click "STAMP IN"</p>
                                                        <button onClick={this.handleStamp} className="btn btn-orange">
                                                            {
                                                                this.state.stamping ? (
                                                                    <React.Fragment>
                                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                                        Loading...
                                                                    </React.Fragment>
                                                                ) : 'STAMP IN'
                                                            }
                                                        </button>me
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