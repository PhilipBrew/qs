import {GET_PAGES, GET_SECURED_PAGES, PAGES_LOADING, GET_PAGE} from "../actions/types";

const initialState = {
	pages: null,
	page : null,
	loading : false
};

export default function(state = initialState, action){
	switch (action.type) {
		case PAGES_LOADING :
			return {
				...state,
				loading : true
			};
		case GET_PAGES :
			return {
				...state,
				pages : action.payload,
				loading : false
			};
		case GET_SECURED_PAGES :
			return {
				...state,
				pages : action.payload,
				loading : false
			};
		case GET_PAGE :
			return {
				...state,
				page : action.payload,
				loading : false
			};
		default :
			return state;
	}
}
