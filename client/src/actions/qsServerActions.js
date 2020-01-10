import axios                                                      from 'axios';
import {GET_QSSERVER, QSSERVER_LOADING,
	GET_ERRORS, SET_QSSERVER} from "./types";
import {ToastsStore}                                          from "react-toasts";

//GET QLIK SENSE SERVER
export const getQsServer = () => dispatch => {
	dispatch(setQsServerLoading());

	axios.get('/api/qsserver')
	     .then(res => {
		     dispatch({
	              type   : GET_QSSERVER,
	              payload: res.data
              })
	     }).catch(err => {
			dispatch({type   : GET_ERRORS, payload: err.response.data})
	})
};

//SET QLIK SENSE SERVER DETAILS (SAVE TO DATABASE)
export const setQsServer = (qsServerData) => dispatch => {
	dispatch(setQsServerLoading());
	axios.post('/api/qsserver', qsServerData)
	     .then(res => {
		     dispatch({
	              type   : SET_QSSERVER,
	              payload: res.data,
              });
		     ToastsStore.success('Server details updated successfully');
		     // history.push('/settings');
			}).catch(err => {
		     dispatch({
	              type   : GET_ERRORS,
	              payload: err.response.data
              })
	     })
}

//QLIK SENSE SERVER LOADING
export const setQsServerLoading = () => {
	return {
		type: QSSERVER_LOADING
	}
}
