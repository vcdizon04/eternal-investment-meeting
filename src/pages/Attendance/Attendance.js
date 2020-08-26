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
            meetingState: false
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

    init() {
        this.Socket.on(`meeting/state`, state => {
            console.log(state)
            this.setState({
                meetingState: state
            })
        });
    }

    componentDidMount() {
        this.init()
    }
    
    render() {

        const columns = [
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
                    <span>{row.original.league && row.original.league.league_name}</span>
                ),
            },
            {
                Header: 'Transition',
                Cell: row => (
                    <span>{row.original.gender }</span>
                ),
            },
            {
                Header: 'Schedule',
                Cell: row => (
                    <span>{row.original.gender }</span>
                ),
            },

            {
                Header: 'Status',
                Cell: row => (
                    <span>{row.original.gender }</span>
                ),
            },

            {
                Header: 'Late',
                Cell: row => (
                    <span>{row.original.gender }</span>
                ),
            },

            {
                Header: 'Roll Call',
                Cell: row => (
                    <span>{row.original.gender }</span>
                ),
            },
            {
                Header: 'Remarks',
                Cell: row => (
                    <span>{row.original.gender }</span>
                ),
            },
            
            
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
                    <div className="actions mb_15">
                       {
                           (!this.meetingState && (this.context.user.team == 'Executives Team' || this.context.user.team == 'Admin Team')) ? (
                               <React.Fragment>
                                <button onClick={this.handleStart} className="btn btn-orange">
                                    {
                                        this.state.meetingStarting ? (
                                            <React.Fragment>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                Loading...
                                            </React.Fragment>
                                        ) : 'Start Meeting'
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
                       }
                    </div>
                   
                </div>
            </div>
        );
    }
}

export default Attendance;