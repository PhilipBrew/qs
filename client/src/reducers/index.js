import {combineReducers} from "redux";
import authReducer       from './authReducer';
import errorReducer      from "./errorReducer";
import qsServerReducer   from "./qsServerReducer";
import pagesReducer      from "./pagesReducer";
import groupsReducer     from "./groupsReducer";
import objectsReducer    from "./objectsReducer";
import qlikReducer       from './qlikReducer';
import layoutReducer     from "./layoutReducer";

export default combineReducers({
	auth    : authReducer,
	errors  : errorReducer,
	qsServer: qsServerReducer,
	pages   : pagesReducer,
	groups  : groupsReducer,
	objects : objectsReducer,
	qlik    : qlikReducer,
	layout  : layoutReducer
})


