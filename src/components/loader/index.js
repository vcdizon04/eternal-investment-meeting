import React from 'react';
import loaderSvg from '../../public/svg/loader.svg';


const Loader = ({ sidebarWidth, headerHeight }) => {
	const style = {
		width: `calc(100% - ${sidebarWidth}px)`,
		height: `calc(100% - ${headerHeight}px)`
	};
	return (
		<div className="dynamic-loader" style={style}>
			<img src={loaderSvg} className="loader-spin" alt="loader" />
		</div>
	);
}

const FullScreenLoader = () => {
	return (
		<div className="full-screen-loader">
			<img src={loaderSvg} className="loader-spin" alt="loader" />
		</div>
	);
}

export { Loader, FullScreenLoader };