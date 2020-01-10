import {TOGGLE_SIDEBAR} from "../actions/types";
const initialState = {
	showMenu : false
};

export default function (state = initialState, action){
	switch (action.type){
		case TOGGLE_SIDEBAR :
			return {
				...state,
				showMenu : action.payload
			};
		default : return state
	}
}
