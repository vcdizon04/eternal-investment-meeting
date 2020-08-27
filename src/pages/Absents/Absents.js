import React, { Component } from 'react';
import { request } from '../../constants/constants';
import Loader from '../../components/loader/loader';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import Pagination from '../../components/pagination/pagination';

class Absents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: {},
			pageSize: 10,
			currentPage: 1,
			selectedAll: {},
			indeterminateSign: false,
			users: [],
            isLoading: false,
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
                users: res.data.data
            })
        })
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

            
        ]

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

                <div className="table-area">
                    {
                        this.state.isLoading && <Loader />
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
                </div>    
            </div>
        );
    }
}

export default Absents;