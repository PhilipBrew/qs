import {GET_OBJECTS, OBJECTS_LOADING, GET_OBJECT,CLEAR} from "../actions/types";

const initialState = {
	objects: null,
	object : null,
	loading : false
};

export default function(state = initialState, action){
	switch (action.type) {
		case OBJECTS_LOADING :
			return {
				...state,
				loading : true
			};
		case GET_OBJECTS :
			return {
				...state,
				objects : action.payload,
				loading : false
			};
		case GET_OBJECT :
			return {
				...state,
				object : action.payload,
				loading : false
			};
		case CLEAR :
			return {
				initialState
		}
		default :
			return state;
		
	}
}
