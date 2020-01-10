//REGISTER USER
import axios        from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode   from 'jwt-decode';

import {GET_ERRORS, GET_USERS, USERS_LOADING, SET_CURRENT_USER, FORGOT_PASSWORD} from "./types";
import {ToastsStore}                                                             from "react-toasts";

/***
 * @const registerUser
 * @param userData : User Registration Data passed form /register
 * @param history : React Redirect Property to be used on registration success
 * @returns {Function} : A redirect to the /login or some errors to be displayed on fail
 */
export const registerUser = (userData, history) => dispatch => {
	axios.post('/api/users/register', userData)
	.then(res => {
		ToastsStore.success('Account created successfully, please login.');
		history.push('/login');
	})
	.catch(err => {
		dispatch({
			type   : GET_ERRORS,
			payload: err.response.data
		})
	});
};

/***
 * @const createUser
 * @param userData : User Registration Data passed form /register
 * @param history : React Redirect Property to be used on registration success
 * @returns {Function} : A redirect to the /settings/users or some errors to be displayed on fail
 */
export const createUser = (userData, history) => dispatch => {
	axios.post('/api/users/create', userData)
	.then(res => {
		ToastsStore.success('Account created successfully, please as user to login.');
		history.push('/settings/users');
	})
	.catch(err => {
		dispatch({
			type   : GET_ERRORS,
			payload: err.response.data
		})
	});
};

export const getUsers = () => dispatch => {
	dispatch(setUsersLoading());
	axios.get('/api/users').then(res => {
		dispatch({
			type   : GET_USERS,
			payload: res.data
		})
	}).catch(err => {
		dispatch({
			type   : GET_ERRORS,
			payload: err.response.data
		})
	})
}

export const forgotPassword = (userData) => dispatch => {
	axios.post('/api/users/forgot-password-email', userData)
	.then(res => {
		dispatch({
			type   : FORGOT_PASSWORD,
			payload: res.data
		});
	}).catch(err => {
		if(err.response) {
			dispatch({
				type   : GET_ERRORS,
				payload: err.response.data
			})
		}
	})
}

/**
 * @const loginUser
 * @param userData : User Login Data passed in form /login
 * @param history : React redirect property to be used on login success
 * @returns {Function} Setting token in local storage and returning errors on failure
 */
export const loginUser = (userData) => dispatch => {
	axios.post('/api/users/login', userData)
	.then(res => {
		//SAVE TO LOCAL STORAGE
		const {token} = res.data;
		localStorage.setItem('jwtToken', token);

		//SET TOKEN TO AUTH HEADER
		setAuthToken(token);

		//DECODE TOKEN TO GET USER
		const decoded = jwt_decode(token);

		//SET CURRENT USER
		dispatch(setCurrentUser(decoded));

	})
	.catch(err => {
		dispatch({
			type   : GET_ERRORS,
			payload: err.response.data
		})
	});
};

export const updateAuthToken = (jwtToken) => dispatch => {
	axios.post('/api/users/update-token', {token : jwtToken} )
	.then(res => {
		//SAVE TO LOCAL STORAGE
		const {token} = res.data;
		localStorage.setItem('jwtToken', token);

		//SET TOKEN TO AUTH HEADER
		setAuthToken(token);

		//DECODE TOKEN TO GET USER
		const decoded = jwt_decode(token);

		//SET CURRENT USER
		dispatch(setCurrentUser(decoded));

	}).catch(err => {
		dispatch({
			type   : GET_ERRORS,
			payload: err.response.data
		})
	});

}

export const logoutUser = () => dispatch => {
	//clear token from local storage
	localStorage.removeItem('jwtToken');
	//Remove Auth header token
	setAuthToken(false);

	//set current user to an empty object
	dispatch(setCurrentUser({}));

	//TODO CLEAR STATE ON LOGOUT
}

//SET LOGGED IN USER
export const setCurrentUser = (decoded) => {
	return {
		type   : SET_CURRENT_USER,
		payload: decoded
	}
}

export const qlikLoginSSO = (auth) => () => {
	const user = auth.user;
	const {userId, userDir} = user;
	axios.post('/api/users/qlik-node-sso',
		{userId, userDir})
	.then(res => {
		const qTicket = res.data.qTicket;
		localStorage.setItem('qTicket', qTicket);
	}).catch(err => {
		ToastsStore.error(err.message);
	})
}

export const setUsersLoading = () => {
	return {
		type: USERS_LOADING
	}
}
