import {QLIK_LOADING, GET_QLIK_APPS, GET_QLIK_APP, GET_QLIK_SHEETS, GET_QLIK_OBJECTS, GET_QLIK_OBJECT} from "../actions/types";
const initialState = {
	loading : false,
	sheets : null,
	apps : null,
	object : null,
	objects : null
};
export default function (state = initialState, action){
	switch (action.type){
		case QLIK_LOADING :
			return {
				...state,
				loading : true
			};
		case GET_QLIK_APPS :
			return {
				...state,
				loading : false,
				apps : action.payload
			};
		case GET_QLIK_APP :
			return {
				...state,
				loading : false,
				app : action.payload
			};
		case GET_QLIK_SHEETS :
			return {
				...state,
				loading : false,
				sheets : action.payload
			};
		case GET_QLIK_OBJECTS :
			return {
				...state,
				loading : false,
				objects : action.payload
			};
		case GET_QLIK_OBJECT :
			return {
				...state,
				loading : false,
				object : action.payload
			};
		default :
			return state
	}
}
