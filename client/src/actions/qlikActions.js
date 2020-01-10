import axios                                                                                           from 'axios';
import {QLIK_LOADING, GET_QLIK_APPS, GET_QLIK_APP, GET_QLIK_SHEETS, GET_QLIK_OBJECTS, GET_QLIK_OBJECT, GET_ERRORS} from "./types";

export const getQlikApps = () => dispatch => {
	dispatch(setQlikLoading());
	axios.get('/api/qlik/apps')
	.then(res => {
		dispatch({
			type : GET_QLIK_APPS,
			payload : res.data
		})
	}).catch(err => {
		dispatch({type: GET_ERRORS, payload: err.response.data});
	})
};

export const getQlikApp = (app_id) => dispatch => {
	dispatch(setQlikLoading());
	axios.get(`/api/qlik/app/${app_id}`)
	.then(res => {
		dispatch({
			type : GET_QLIK_APP,
			payload : res.data
		})
	}).catch(err => {
		dispatch({type: GET_ERRORS, payload: err.response.data});
	})
};

export const getQlikSheets = (app_id) => dispatch => {
	dispatch(setQlikLoading());
	axios.get(`/api/qlik/app/${app_id}/sheets`)
	.then(res => {
		dispatch({
			type : GET_QLIK_SHEETS,
			payload : res.data
		})
	}).catch(err => {
		dispatch({type: GET_ERRORS, payload: err.response.data});
	})
};

export const getQlikObjects = (app_id, sheet_id) => dispatch => {
	dispatch(setQlikLoading());
	axios.get(`/api/qlik/app/${app_id}/sheet/${sheet_id}/objects`)
	.then(res => {
		dispatch({
			type : GET_QLIK_OBJECTS,
			payload : res.data
		})
	}).catch(err => {
		dispatch({type: GET_ERRORS, payload: err.response.data});
	})
};

export const getQlikObject = (app_id, object_id) => dispatch => {
	dispatch(setQlikLoading());
	axios.get(`/api/qlik/app/${app_id}/object/${object_id}`)
	.then(res => {
		dispatch({
			type : GET_QLIK_OBJECT,
			payload : res.data
		})
	}).catch(err => {
		dispatch({type: GET_ERRORS, payload: err.response.data});
	})
};

export const setQlikLoading = () => {
	return {type : QLIK_LOADING};
}
