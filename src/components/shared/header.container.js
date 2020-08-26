import { connect } from 'react-redux';
import Header from './header';
import { getProfilePicPerformed } from '../../actions/official';

function mapsDispatchToProps(dispatch) {
	return {
		getprofilePic: () => dispatch(getProfilePicPerformed())
	}
}

function mapsStateToProps(state) {
	return {
		loading: state.official.is_profile_photo_loading,
		profile_pic: state.official.profile_pic
	}
}

export default connect(() => (mapsStateToProps), mapsDispatchToProps)(Header);