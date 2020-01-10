import React, {Component}                       from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Provider}                               from 'react-redux';
import jwt_decode                               from 'jwt-decode';
import setAuthToken                             from './utils/setAuthToken';
import {setCurrentUser, logoutUser}             from "./actions/authActions";
import store                                    from './store';

import PrivateRoute from "./components/common/PrivateRoute";
import Landing      from "./components/layout/Landing";
import Login        from "./components/auth/Login";
import Register     from "./components/auth/Register";
import Settings     from "./components/layout/Settings";
import QsServer     from "./components/settings/QsServer";
import {
	ToastsContainer,
	ToastsContainerPosition,
	ToastsStore
}                   from "react-toasts";
import Pages        from "./components/settings/Pages/Pages";
import CreatePage   from "./components/settings/Pages/CreatePage";
import EditPage     from "./components/settings/Pages/EditPage";
import ViewPage     from "./components/settings/Pages/ViewPage";
import CreateObject from "./components/settings/Pages/CreateObject";
import Dashboard    from "./components/layout/Dashboard";
import DeleteObject from "./components/settings/Pages/DeleteObject";
import EditObject  from "./components/settings/Pages/EditObject";
import Profile     from "./components/settings/Users/Profile";
import CreateUser  from "./components/settings/Users/CreateUser";
import Users       from "./components/settings/Users/Users";
import ViewUser    from "./components/settings/Users/ViewUser";
import EmailServer from "./components/settings/EmailServer";
import NewPassword    from "./components/auth/NewPassword";
import EditUser       from "./components/settings/Users/EditUser";
import Groups         from "./components/settings/Groups/Groups";
import CreateGroup    from "./components/settings/Groups/CreateGroup";
import EditGroup      from "./components/settings/Groups/EditGroup";
import ViewGroup      from "./components/settings/Groups/ViewGroup";
import DeletePage     from "./components/settings/Pages/DeletePage";
import DeleteUser     from "./components/settings/Users/DeleteUser";
import ForgotPassword from "./components/auth/ForgotPassword";
import AnalyticsPage  from "./components/layout/AnalyticsPage";

class App extends Component {

	render() {
		//CHECK FOR TOKEN
		if (localStorage.jwtToken) {
			//Set Auth Token
			setAuthToken(localStorage.jwtToken);

			//decode token and get user info and exp
			const decoded = jwt_decode(localStorage.jwtToken);

			//set current user and is authenticated
			store.dispatch(setCurrentUser(decoded));

			//check for expired token
			const currentTime = Date.now() / 1000;

			if (decoded.exp < currentTime) {
				//logout user
				store.dispatch(logoutUser());

				//Redirect to loginx
				window.location.href = '/login'
			}
		}

		return (
			<Provider store={store}>
				<Router>
					<div className="App">
						<ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER}/>

						<Route exact path="/login" component={Login}/>
						<Route exact path="/register" component={Register}/>
						<Route exact path="/forgot-password" component={ForgotPassword}/>
						<Route exact path="/" component={Landing}/>
						<Route exact path="/users/new-password/:token" component={NewPassword}/>
						{
							(localStorage.jwtToken !== null) ?
								<Switch>
									{/*CREATE ROUTES*/}
									<PrivateRoute exact path="/settings/pages/create" component={CreatePage}/>
									<PrivateRoute exact path="/settings/users/create" component={CreateUser}/>
									<PrivateRoute exact path="/settings/groups/create" component={CreateGroup}/>
									<PrivateRoute exact path="/settings/pages/create-object/:id"
									              component={CreateObject}/>

									{/*READ ROUTES*/}
									<PrivateRoute exact path="/settings/pages/view/:id" component={ViewPage}/>
									<PrivateRoute exact path="/settings/groups/view/:id" component={ViewGroup}/>
									<PrivateRoute exact path="/dashboard/" component={Dashboard}/>
									<PrivateRoute path="/p/:id" component={AnalyticsPage}/>
									<PrivateRoute exact path="/settings/users/view/:id" component={ViewUser}/>

									{/*UPDATE / EDIT ROUTES*/}
									<PrivateRoute exact path="/settings/pages/edit-object/:pid/:oid"
									              component={EditObject}/>
									<PrivateRoute exact path="/settings/pages/edit/:id" component={EditPage}/>
									<PrivateRoute exact path="/settings/groups/edit/:id" component={EditGroup}/>
									<PrivateRoute exact path="/settings/users/edit/:id" component={EditUser}/>

									{/* OTHER ROUTES*/}
									<PrivateRoute exact path="/users/profile" component={Profile}/>
									<PrivateRoute exact path="/settings" component={Settings}/>
									<PrivateRoute exact path="/settings/qsserver" component={QsServer}/>
									<PrivateRoute exact path="/settings/pages" component={Pages}/>
									<PrivateRoute exact path="/settings/groups" component={Groups}/>
									<PrivateRoute exact path="/settings/users" component={Users}/>
									<PrivateRoute exact path="/settings/smtp" component={EmailServer}/>

									{/*DELETE ROUTES*/}
									<PrivateRoute exact path="/settings/pages/delete-object/:pid/:oid" component={DeleteObject}/>
									<PrivateRoute exact path="/settings/pages/delete/:pid/" component={DeletePage}/>
									<PrivateRoute exact path="/settings/users/delete/:id/" component={DeleteUser}/>

								</Switch>
								: ''
						}
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
