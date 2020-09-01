import Axios from "axios";
import Cookies from 'js-cookie';
import io, { Manager } from 'socket.io-client'


export const API_URL = "http://meeting.eternal-investment.com:3000/api";
// export const PROFILE_IMAGE_BASE_URL = "http://video.devapi.efficialtec.com/storage/profileimages";

// export const API_URL = "http://localhost:8080/api";
export const PROFILE_IMAGE_BASE_URL = "http://127.0.0.1:8001/storage/profileimages";

export const request = (method, url, data = null, isNeedAuthorization = false) => {
    return Axios.request({
        method: method,
        url: API_URL + url,
        data: data,
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Token': isNeedAuthorization ?  `${getToken()}` : null
        }
    })
}

export const getToken = () => {
    const user = getUser();
    console.log(user)
    return user && user.access_token;
}

export const getUser = () => {
    return Cookies.getJSON('user');
}


// const SOCKET_URL = "http://localhost:8080";

const SOCKET_URL = "http://meeting.eternal-investment.com:3000";

export const socket = () => io.connect(SOCKET_URL, {
    query: `token=${getToken()}`,
    // autoConnect: false
});
