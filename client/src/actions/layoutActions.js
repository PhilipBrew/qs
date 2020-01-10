import {TOGGLE_SIDEBAR} from "./types";

export const toggleMenu = (nextState) => dispatch => {
	dispatch({
		type : TOGGLE_SIDEBAR,
		payload : nextState
	})
};
