import axios         from 'axios';
import {
	GET_ERRORS, GET_OBJECT, GET_OBJECTS, OBJECTS_LOADING, CLEAR
}                    from "./types";
import {ToastsStore} from "react-toasts";

//GET OBJECTS
export const getObjects = (page_id) => dispatch => {
	dispatch(setObjectsLoading());

	axios.get(`/api/pages/objects/${page_id}`)
	     .then(res => {
		     dispatch({
	              type   : GET_OBJECTS,
	              payload: res.data,
              })
	     }).catch(err => {
		dispatch({type: GET_ERRORS, payload: err.response.data});
	})
};


//GET OBJECT
export const getObject = (page_id,object_id) => dispatch => {
	dispatch(setObjectsLoading());

	axios.get(`/api/pages/objects/${page_id}/${object_id}`)
	     .then(res => {
		     dispatch({
               type   : GET_OBJECT,
               payload: res.data,
             })
	     }).catch(err => {
	     	dispatch({type : CLEAR });
		dispatch({type: GET_ERRORS,
			         payload: err.response.data});
	})
}

//CREATE OBJECT
export const createObject = (page_id, objectData, history) => dispatch => {

	axios.post(`/api/pages/objects/${page_id}`, objectData)
	     .then(res => {
	     	 ToastsStore.success(`Object Created successfully`);
		     history.push(`/settings/pages/view/${page_id}`);
	     }).catch(err => {
		dispatch({
	         type   : GET_ERRORS,
	         payload: err.response.data
         });
	})
}
// EDIT OBJECT
export const editObject = (page_id,object_id, objectData, history) => dispatch => {
	axios.post(`/api/pages/objects/${page_id}/${object_id}`, objectData)
	     .then(res => {
		     ToastsStore.success(`Object updated successfully`);
		     history.push(`/settings/pages/view/${page_id}`);
	     }).catch(err => {
		dispatch({
	         type   : GET_ERRORS,
	         payload: err.response.data
         });
	})
}

export const setObjectsLoading = () => {
	return {
		type: OBJECTS_LOADING
	}
}
