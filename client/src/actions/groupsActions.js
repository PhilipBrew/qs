import axios         from 'axios';
import {
	GET_ERRORS, GET_GROUP, GET_GROUPS, GROUPS_LOADING
}                    from "./types";
import {ToastsStore} from "react-toasts";

//GET GROUPS
export const getGroups = () => dispatch => {
	dispatch(setGroupsLoading());

	axios.get('/api/groups')
	     .then(res => {
		     dispatch({
	              type   : GET_GROUPS,
	              payload: res.data
              })
	     }).catch(err => {
		dispatch({type: GET_ERRORS, payload: err.response.data});
	})
};

//GET GROUP
export const getGroup = (group_id) => dispatch => {
	dispatch(setGroupsLoading());
	axios.get('/api/groups/'+group_id)
	     .then(res => {
		     dispatch({
               type   : GET_GROUP,
               payload: res.data
             })
	     }).catch(err => {
		dispatch({
			         type: GET_ERRORS,
			         payload: err.response.data
		});
	})
}

//CREATE GROUP
export const createGroup = (groupData, history) => dispatch => {
	axios.post('/api/groups/create', groupData)
	     .then(res => {
		     ToastsStore.success(`Group created successfully`);
		     history.push('/settings/groups/');
	     }).catch(err => {
		dispatch({
			         type   : GET_ERRORS,
			         payload: err.response.data
		         });
	})
}
// EDIT GROUP
export const editGroup = (group_id, groupData, history) => dispatch => {
	axios.post('/api/groups/edit/'+group_id, groupData)
	     .then(res => {
		     ToastsStore.success(`${res.title} updated successfully`);
		     history.push(`/settings/groups/view/${group_id}`);
	     }).catch(err => {
		dispatch({
	         type   : GET_ERRORS,
	         payload: err.response.data
         });
	})
}

export const setGroupsLoading = () => {
	return {
		type: GROUPS_LOADING
	}
}
