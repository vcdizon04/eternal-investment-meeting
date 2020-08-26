import React, { Component } from 'react';
import menuSvg from '../../public/svg/menu.svg';
import notificationSvg from '../../public/svg/notification.svg';
import userPic from '../../public/images/e-logo.png';
import profileDownSvg from '../../public/svg/down-arrow.svg';
import settingsSvg from '../../public/svg/settings.svg';
// import Logout from '../logout/logout-container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import '../../public/styles/header.scss';
import ReactResizeDetector from 'react-resize-detector';
import UserContext from '../../contexts/user';
import Cookies from 'js-cookie';
import { PROFILE_IMAGE_BASE_URL } from '../../constants/constants';

export default class Header extends Component {

	static contextType = UserContext;

	constructor(props) {
		super(props);
		this.state = {
			image: userPic,
			user: {
				profilePic: ''
			}
			// user: this.context.user
			// currentOrg: getOrgId()

		}
	}

	logOut = () => {
		Cookies.remove('user');
		this.context.setUser(null);
		window.location.href = '/login';
	}

	searchShow() {
		$('.modal').modal({
			backdrop: 'static',
			keyboard: false,
			show: false,
		});
		$('.search-toggle').click(function () {
			$('.main').addClass('search-opened');
		});
		$('.search-close').click(function () {
			$('.main').removeClass('search-opened');
		});
		$('.theme-setting-toggle').click(function () {
			$('.theme-setting-panel').toggleClass('opened');
		});
		$('.color-code').each(function () {
			$(this).click(function () {
				var getcolor = $(this).data('color-name');
				$('body').removeClass();
				$('body').addClass(getcolor);
			});
		});
	}
	customheader() {
		if ($(window).width() < 767) {
			$('.header-email .fa-arrow-left').click(function () {
				$('.header-email .dropdown-menu').removeClass('show');
				$('.header-email').removeClass('show');
			});
			$('.header-notification .fa-arrow-left').click(function () {
				$('.header-notification .dropdown-menu').removeClass('show');
				$('.header-notification').removeClass('show');
			});
			$('.header-profile .fa-arrow-left').click(function () {
				$('.header-profile .dropdown-menu').removeClass('show');
				$('.header-profile').removeClass('show');
			});
		}

		$('.organisation-change').click(function (e) {
			e.stopPropagation();
		});
	}
	componentWillMount() {
		// this.props.getprofilePic();
	}
	componentDidMount() {
		this.searchShow();
		this.customheader();
		console.log('componentDidMount')
		// this.setState({
		// 	user: {
		// 		...this.context.user ? this.context.user.user : null,
		// 		profilePic: `${PROFILE_IMAGE_BASE_URL}/${this.context.user.user.profile_pic_url}`
		// 	}
		// })
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.profile_pic !== '') {
			this.setState({
				image: nextProps.profile_pic
			});
		}
	}

	handleChangeOrg = (e) => {
		// console.log('change', e.target.value);
		// this.setState({
		// 	currentOrg: e.target.value
		// })
		// this.props.changeOrganisation(e.target.value);
	};
	render() {
		const user = this.context.user ? this.context.user : null;

		
		// const auth_data = JSON.parse(localStorage.getItem('user'));
		// const permissions = getPermission();
		// const filteredOrg = getOrganisations().filter(org => org.permissions.some(role => ['admin', 'allocator'].includes(role)));
		// const showChangeOrg = filteredOrg.length > 1;
		// const orgOptions = filteredOrg.map(org => (
		// 	<option key={org.org_id} value={org.org_id}>{org.organisation_name}</option>
		// ));
		return (
			<div className="header-container fixed">
				<div className="container-fluid h-100">
					<div className="d-flex align-items-center justify-content-between h-100">
						<div className="toggle">
							<div className="mobile-toggle">
								<span className="icon icon-menu">
									<img src={menuSvg} className="imgsvg" alt="menu" />
								</span>
							</div>
							<div className="desktop-toggle">
								<span className="icon icon-menu">
									<img src={menuSvg} className="imgsvg" alt="menu" />
								</span>
							</div>
						</div>
						<div className="header-other">
							{/* <div className="header-search">
								<button className="d-flex align-items-center search-toggle">
									<span className="icon icon-search">
										<img src={searchSvg} className="imgsvg" alt="search" />
									</span>
								</button>
								<div className="search-area">
									<div className="input-effect-1">
										<input type="text" className="form-control" placeholder="Search Now" />
										<span className="focus-border"></span>
									</div>
									<button className="search-close">
										<span className="icon icon-close">
											<img src={closeSvg} className="imgsvg" alt="close" />
										</span>
									</button>
								</div>
							</div> */}
							<div className="others">
								<ul className="nav">
									<li className="nav-item">
										{/* <div className="header-email">
											<button className="dropdown-toggle d-flex align-items-center" data-toggle="dropdown">
												<span className="icon icon-email">
													<img src={emailSvg} className="imgsvg" alt="email" />
												</span>
											</button>
											<div className="dropdown-menu">
												<div className="card card-simple">
													<div className="card-header d-flex align-items-center">
														<FontAwesomeIcon icon={faArrowLeft} className="fa fa-arrow-left" />
														<h2>Email</h2>
														<div className="email-counter">05</div>
													</div>
													<div className="card-body">content require</div>
                                                    <div className="card-footer">
                                                        <button className="btn btn-text orange">See All</button>
                                                    </div>
												</div>
											</div>
										</div> */}
									</li>
								
									<li className="nav-item d-flex align-items-center">
										<div className="header-profile dropdown">
											<button data-toggle="dropdown" className="dropdown-toggle d-flex align-items-center" id="header-ani">
												<div className="thumb">
													<div className="avatar avatar-xs avatar-round"><img src={userPic} alt="user" /></div>
												</div>
												<div className="name">
													<span className="welcome">Welcome</span>
													<span className="user-name">{user && user.username}</span>
													<span className="icon icon-down-arrow">
														<img src={profileDownSvg} className="imgsvg" alt="down-arrow" />
													</span>
												</div>
											</button>
											<div className="dropdown-menu" aria-labelledby="header-ani">
												<div className="card card-simple">
													<div className="card-header">
														<FontAwesomeIcon icon={faArrowLeft} className="fa fa-arrow-left" />
														<div className="user-mail">
															<span className="name">{user && user.username}</span>
															{/* {auth_data.user.email && <a href={`mailto:${auth_data.user.email}`}><span className="email">{auth_data.user.email}</span></a>} */}
														</div>
													</div>
													<div className="card-body">
														<ul>
															{/* {showChangeOrg && (
																<li className="organisation-change mb-3" style={{ fontSize: '14px' }}>
																	<p className="dropdown-header p-0 mb-1" style={{ fontSize: '14px' }}>Change Organisation</p>
																	<div className="input-effect-1">
																		<select className="normal-select" value={this.state.currentOrg} onChange={this.handleChangeOrg}>
																			{orgOptions}
																		</select>
																	</div>
																</li>
															)} */}
															<li><Link to="/edit/profile"><button className="link">Edit Profile</button></Link></li>
															{/* {permissions.some(p => ['administrator'].includes(p)) && <li><Link to="/organisation/edit"><button className="link">Edit Organisation</button></Link></li>} */}
															<li><button className="link" onClick={this.logOut}>Logout</button></li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="theme-setting-panel">
					<button className="theme-setting-toggle">
						<span className="text">Theme Setting</span>
						<span className="icon icon-settings">
							<img src={settingsSvg} className="imgsvg" alt="setting" />
						</span>
					</button>
					<div className="card card-theme">
						<div className="card-header d-flex align-items-center">
							<FontAwesomeIcon icon={faArrowLeft} className="fa fa-arrow-left" />
							<h2>Theme Setting</h2>
						</div>
						<div className="card-body">
							<div className="color-value">
								<button className="color-code" data-color-name="theme-defaults"></button>
								<button className="color-code" data-color-name="theme-oranges"></button>
								<button className="color-code" data-color-name="theme-browns"></button>
							</div>
						</div>
					</div>
				</div>
				<ReactResizeDetector handleHeight refreshMode="debounce" refreshRate={100} onResize={this.props.onResize} />
			</div>
		);
	}
}