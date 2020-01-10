import {GET_QSSERVER, QSSERVER_LOADING, SET_QSSERVER} from "../actions/types";

const initialState = {
	qsServer: null,
	loading : false
};

export default function(state = initialState, action){
	switch (action.type) {
		case QSSERVER_LOADING :
			return {
				...state,
				loading : true
			};
		case GET_QSSERVER :
			return {
				...state,
				qsServer : action.payload,
				loading : false
			};
		case SET_QSSERVER :
			return {
				...state,
				qsServer : action.payload,
				loading : false,
			};
		default :
			return state;
		
	}
}
