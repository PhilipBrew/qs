import axios                                            from 'axios';
import {GET_ERRORS, GET_PAGE, GET_SECURED_PAGES, GET_PAGES, PAGES_LOADING} from "./types";
import {ToastsStore}                                    from "react-toasts";

//GET PAGES
export const getPages = () => dispatch => {
	dispatch(setPagesLoading());
	axios.get('/api/pages')
	.then(res => {
		dispatch({
			type   : GET_PAGES,
			payload : res.data
		})
	}).catch(err => {
		dispatch({type: GET_ERRORS, payload : err.response.data});
	})
};

//GET PAGES
export const getSecuredPages = () => dispatch => {
	dispatch(setPagesLoading());
	axios.get('/api/pages/secured')
	.then(res => {
		dispatch({
			type   : GET_SECURED_PAGES,
			payload : res.data
		})
	}).catch(err => {
		dispatch({type: GET_ERRORS, payload : err.response.data});
	})
};

//GET PAGE
export const getPage = (page_id) => dispatch => {
	dispatch(setPagesLoading());
	axios.get('/api/pages/' + page_id)
	.then(res => {
		dispatch({
			type   : GET_PAGE,
			payload : res.data
		})
	}).catch(err => {
		dispatch({type: GET_ERRORS, payload : err.response.data});
	})
}

//CREATE PAGE
export const createPage = (pageData, history) => dispatch => {
	axios.post('/api/pages/create', pageData)
	.then(() => {
		ToastsStore.success(`Page created successfully`);
		history.push('/settings/pages/');
	}).catch(err => {
		dispatch({
			type   : GET_ERRORS,
			payload : err.response.data
		});
	})
};

//DELETE PAGE
export const deletePage = (id, history) => () => {
	axios.delete(`/api/pages/${id}`).then(() => {
		ToastsStore.success('Page and all associated objects deleted successfully');
	}).catch(() => {
		ToastsStore.error('Error deleting page');
	})

	history.push('/settings/pages');
};

// EDIT PAGE
export const editPage = (page_id, pageData, history) => dispatch => {
	axios.post('/api/pages/' + page_id, pageData)
	.then(res => {
		ToastsStore.success(`${res.data.title} updated successfully`);
		history.push(`/settings/pages/view/${page_id}`);
	}).catch(err => {
		dispatch({
			type   : GET_ERRORS,
			payload : err.response.data
		});
	})
}

export const setPagesLoading = () => {
	return {type: PAGES_LOADING}
};
