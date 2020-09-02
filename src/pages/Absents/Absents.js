import React, { Component } from 'react';
import { request } from '../../constants/constants';
import Loader from '../../components/loader/loader';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import Pagination from '../../components/pagination/pagination';
import Swal from 'sweetalert2';

class Absents extends Component {
    remarks = '';
    currentUsername = '';
    constructor(props) {
        super(props);
        this.remarksRef = React.createRef();
        this.state = {
            selected: {},
			pageSize: 10,
			currentPage: 1,
			selectedAll: {},
			indeterminateSign: false,
            users: [],
            origUsers: [],
            isLoading: false,
            filters: [],
            remarks: '',
            teamOptions: [],
            employeeLevelOptions: [],
            transitionOptions: [],
            scheduleOptions: [],
            statusOptions: []
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
        }, () => {
            const teamOptions = this.state.teamOptions;
            const employeeLevelOptions = this.state.employeeLevelOptions;
            const transitionOptions = this.state.transitionOptions;
            const scheduleOptions = this.state.scheduleOptions;
            const statusOptions = this.state.statusOptions;

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

            this.setState({
                teamOptions,
                employeeLevelOptions,
                transitionOptions,
                scheduleOptions,
                statusOptions
            })
        })
    }

    init() {
        this.setState({
            isLoading: true
        })
        request('GET', '/meeting', {}, true)
        .then(res => {
            console.log(res);
            this.setState({
                // isLoading: false,
                isMeetingTriggered: res.data.data.isMeetingTriggered
            })
        })
        request('GET', '/meeting/absents', {}, true).then(res => {
            console.log(res);
            this.setState({
                isLoading: false,
                users: res.data.data,
                origUsers: [...res.data.data]
            }, () => {
                const teamOptions = this.state.teamOptions;
            const employeeLevelOptions = this.state.employeeLevelOptions;
            const transitionOptions = this.state.transitionOptions;
            const scheduleOptions = this.state.scheduleOptions;
            const statusOptions = this.state.statusOptions;

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

            this.setState({
                teamOptions,
                employeeLevelOptions,
                transitionOptions,
                scheduleOptions,
                statusOptions
            })
            })
        })
    }

    handleChange = e => {
        // this.setState({
        //     [e.target.name]: e.target.value
        // })
        this[e.target.name] = e.target.value;
    
    }

    handleAddRemarks = e => {
        this.setState({
            addRemarkLoading: true
        });
        const data = {
            username: this.currentUsername,
            remarks: this.remarks
        }
        console.log(data);
        request('POST', '/meeting/absents/remarks', data, true)
        .then(res => {
            console.log(res);
            this.init();
            this.setState({
                addRemarkLoading: false,
            })
            this.remarks = "";
            this.currentUsername = "";
            Swal.fire(
                'Success',
                res.data.message,
                'success'
            );
        })
    }

    addRemark = (username, remarks) => e => {
        this.currentUsername = username;
        this.remarks = remarks ? remarks : '';
        this.remarksRef.current.value =  this.remarks;
        console.log('usename:', username)
        console.log('remarks:', remarks)
        console.log(this.remarksRef.current)
    }

    handleExportCsv = e => {
        let csv = "Full Name,Team,Employee Level,Transition,Schedule,Status,Late,Remarks\n";
        this.state.users.forEach(user => {
            csv += `${user.username},${user.team},${user.employee_level},${user.transition || ''},${user.schedule},${user.status},${user.isLate ? 'Yes' : 'No'},${user.remarks || ''}\n`
        });
        console.log(csv);
        const filename = "abbsent.csv"
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    componentDidMount() {
        this.init()
    }
    
    render() {

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
                            this.state.teamOptions.map((team) => <option key={team} value={team}>{team}</option>)
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
                        this.state.employeeLevelOptions.map(employee_level => <option value={employee_level}>{employee_level}</option>)
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
                        this.state.transitionOptions.map(transiiton => <option value={transiiton}>{transiiton}</option>)
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
                        this.state.scheduleOptions.map(schedule => <option value={schedule}>{schedule}</option>)
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
                        this.state.statusOptions.map(status => <option value={status}>{status}</option>)
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
                    <p className="mb-2">Remarks</p>
                    <select name="remarks" onChange={this.handleFilterChange} className="custom-select">
                        <option value="all">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </React.Fragment>
                ),
                Cell: row => (
                row.original.remarks ? <button  disabled={this.state.addRemarkLoading} data-toggle="modal" data-target="#remarkModal"  onClick={this.addRemark(row.original.username, row.original.remarks)} className="btn btn-link text-dark" title="Edit remarks">{  row.original.remarks }</button> : <button data-toggle="modal" data-target="#remarkModal"  onClick={this.addRemark(row.original.username)} className="btn btn-orange">
                     {
                        this.state.addRemarkLoading ? (
                            <React.Fragment>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                Loading...
                            </React.Fragment>
                        ) : 'Add Remarks'
                    }
                </button>
                )
            },

            // {
            //     Header: (
            //     <React.Fragment>
            //         <p className="mb-2">Roll Call</p>
            //         <select name="rollCall" onChange={this.handleFilterChange} className="custom-select">
            //             <option value="all">All</option>
            //             <option value="true">Active</option>
            //             <option value="false">Not Active</option>
            //         </select>
            //     </React.Fragment>
            //     ),
            //     Cell: row => (
            //         <span>{row.original.rollCall && <span className="text-success"> Active </span> }</span>
            //     ),
            // },
            // {
            //     Header: 'Remarks',
            //     Cell: row => (
            //         <span>{row.original.gender }</span>
            //     ),
            // },
            
            
        ]

        const length = this.state.users.length;

        if(!this.state.isMeetingTriggered) {
            return (
                <div>
                    <div className="page-head mb_30">
                        <div className="head">
                            <h1 className="page-title">Absents</h1>
                            <nav>
                                <ol className="breadcrumb page-title">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item current">Absents</li>
                                </ol>
                            </nav>
                        </div>
                    </div>		

                    <p className="text-center mt-5">The meeting is not yet started</p>

                </div>
            )
        }

        return (
            <div>
                {/* Modal */}
                <div className="modal fade" id="remarkModal" tabIndex={-1} role="dialog" aria-labelledby="remarkModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="remarkModal">Add Remarks</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="label">Remarks</label>
                            <div className="input-effect-1">
                                <input name="remarks" ref={this.remarksRef} onChange={this.handleChange} name="remarks" type="text" className="form-control" placeholder="Enter reason" />
                                <span className="focus-border" />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button data-dismiss="modal"  onClick={this.handleAddRemarks} type="button" className="btn btn-orange">Save</button>
                    </div>
                    </div>
                </div>
                </div>

                <div className="page-head mb_30">
                    <div className="head">
                        <h1 className="page-title">Absents</h1>
                        <nav>
                            <ol className="breadcrumb page-title">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item current">Absents</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <button className="btn btn-orange mb-5" onClick={this.handleExportCsv}>Export</button>		

                <div className="table-area">
                    {
                        this.state.isLoading && <Loader />
                    }
                    <p className="mb-2">{length} entries</p>
                    <ReactTable
                        // PaginationComponent={Pagination}
                        showPagination={false}
                        data={this.state.users}
                        minRows={5}
                        columns={columns}
                        noDataText={this.state.isLoading ? '' : "No data available right now."}
                        defaultPageSize={99999}
                        pageSizeOptions={[10, 25, 50, 100]}
                        resizable={true}
                        // onPageChange={(index) => this.handlePageChange(index)}
                        // onPageSizeChange={(size) => this.handlePageSizeChange(size)}
                        // getTheadThProps={(state, rowInfo, column, instance) => this.handleThProps(state, rowInfo, column, instance)}
                    />
                </div>    
            </div>
        );
    }
}

export default Absents;