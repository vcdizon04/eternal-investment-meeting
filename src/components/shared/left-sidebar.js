import React, { Component } from 'react';
import Logos from '../../public/images/small-logo.png';
import Logo from '../../public/images/logo.png';
import dashboardSvg from '../../public/svg/dashboard.svg';
import gamesSvg from '../../public/svg/games.svg';
import settingsSvg from '../../public/svg/settings.svg';
import organisationSvg from '../../public/svg/organisation.svg';
import leaguesSvg from '../../public/svg/leagues.svg';
import usersSvg from '../../public/svg/users.svg';
import venuesSvg from '../../public/svg/venues.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import '../../public/styles/leftsidebar.scss';
import $ from 'jquery';
import ReactResizeDetector from 'react-resize-detector';
import UserContext from '../../contexts/user';

export default class LeftSidebar extends Component {

	static contextType = UserContext;

	getSettings() {
		$('.imgsvg').each(function () {
			var $img = $(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');
			$.get(imgURL, function (data) {
				var $svg = $(data).find('svg');
				if (typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}
				if (typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass + ' replaced-svg');
				}
				$svg = $svg.removeAttr('xmlns:a');
				if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
					$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
				}
				$img.replaceWith($svg);
			}, 'xml');
		});

		const toggleStateParent = () => {
			// this.props.toggle();
		};


		function leftmenu() {
			if ($(window).width() > 767) {
				// desktop
				$('.main').addClass('desktop').removeClass('mobile left-open');
				$('.desktop .header-container .toggle').click(function (e) {
					e.preventDefault();
					$('.main').toggleClass('left-mini');
					toggleStateParent();
				});
			} else {
				// mobile
				$('.main').addClass('mobile').removeClass('desktop left-mini');
				$('.mobile .header-container .toggle').click(function () {
					$('.main').addClass('left-open');
				});
				$('.mobile .leftmenu li a.link').on('click', function () {
					if ($('.mobile .leftmenu li a.link').hasClass('active')) {
						setTimeout(function () {
							$('.main').removeClass('left-open');
						}, 500);
					}
				});
				$(document).on('touchstart click', function (e) {
					var closearea = $(".mobile .leftsidebar, .mobile .header-container .toggle");
					if (closearea.has(e.target).length === 0) {
						$('.main').removeClass('left-open');
					}
				});
			}
		}
		$(document).ready(function () {
			leftmenu();
		});
		$(window).resize(function () {
			leftmenu();
		});
	}
	componentDidMount() {
		this.getSettings();
	}
	render() {
		return (
			<div className="leftsidebar">
				<div className="wrappers">
					<div className="main-logo">
						<div className="dflex align-items-center h-100">
							<div className="logo">
								<img src={Logo} alt="logo" />
								Eternal Investment
							</div>
							{/* <div className="small-logo">
								<span><img src={Logos} alt="logo" /></span>
							</div> */}
						</div>
					</div>
					<div className="leftmenu" id="accordion">
						<ul>
							<li className="level_0">
								<NavLink exact={true} to="/" activeClassName='active' className="link">
									<span className="icon icon-dashboard">
										<img src={dashboardSvg} className="imgsvg" alt="dashboard" />
									</span>
									<span className="text">Metting Attendance</span>
								</NavLink>
							</li>

							{
								(this.context.user.team == 'Executive Team' || this.context.user.team == 'Admin Team') && (
									<li className="level_0">
										<NavLink to="/absents" activeClassName='active' className="link">
											<span className="icon icon-games">
												<img src={gamesSvg} className="imgsvg" alt="games" />
											</span>
											<span className="text">Absents</span>
											{/* <span className="icon icon-down-arrow"><FontAwesomeIcon icon={faChevronDown} className="fa" /></span> */}
										</NavLink>
										
										{/* <div className="collapse sub-menu" id="game_collapse_1" data-parent="#accordion">
											<ul>
												<li><NavLink to="/games" activeClassName='active' className="link">All Games</NavLink></li>
											</ul>
										</div> */}
									</li>
								)
							}
						
							
						
						</ul>
					</div>
				</div>
				<ReactResizeDetector handleWidth refreshMode="debounce" refreshRate={100} onResize={this.props.onResize} />
			</div>
		);
	}
}