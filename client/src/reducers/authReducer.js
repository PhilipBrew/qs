import {GET_USERS, SET_CURRENT_USER,FORGOT_PASSWORD} from "../actions/types";
import isEmpty                       from '../validation/is-empty';
const initialState = {
	isAuthenticated : false,
	user : {},
	users : {},
	passwordReset : {},
	loading : {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case SET_CURRENT_USER :
			return {
				...state,
				isAuthenticated : !isEmpty(action.payload),
				user : action.payload
			};
		case GET_USERS :
			return {
			...state,
			users : action.payload,
			loading : false
		};
		case FORGOT_PASSWORD :
			return {
				...state,
				loading : false,
				passwordReset : action.payload
			};
		default :
			return state;
	}
}
