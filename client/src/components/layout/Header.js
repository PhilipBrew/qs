import React, {Component} from 'react';
import logo               from '../../img/LogoLight.png';
import {Link}             from 'react-router-dom';
import PropTypes          from 'prop-types';
import {connect}          from "react-redux";
import {logoutUser}       from "../../actions/authActions";
import * as Icon          from 'react-feather';
import {NavLink}            from "react-router-dom";

class Header extends Component {
	onLogoutClick(e) {
		e.preventDefault();
		this.props.logoutUser();
	}

	render() {
		const {isAuthenticated, user} = this.props.auth;


		const authLinks = (
			<ul className="c-navbar__nav-list">
				<li className="c-navbar__nav-item"><NavLink className="c-navbar__nav-link" exact={true} activeClassName={'is-active'}  to="/">Home</NavLink></li>
				<li className="c-navbar__nav-item"><NavLink className="c-navbar__nav-link" exact={true} activeClassName={'is-active'}  to="/settings">Settings</NavLink></li>
			</ul>
		);
		const authAdminLinks = (
			<ul className="c-navbar__nav-list">
				<li className="c-navbar__nav-item"><NavLink className="c-navbar__nav-link" exact={true} activeClassName={'is-active'}  to="/">Home</NavLink></li>
				<li className="c-navbar__nav-item"><NavLink className="c-navbar__nav-link" exact={true} activeClassName={'is-active'} to={'/dashboard'}>Dashboard</NavLink></li>
				<li className="c-navbar__nav-item"><NavLink className="c-navbar__nav-link" exact={true} activeClassName={'is-active'} to="/settings">Settings</NavLink></li>
				<li className="c-navbar__nav-item"><NavLink className="c-navbar__nav-link" match={'/settings/Pages/*'}  activeClassName={'is-active'} to="/settings/Pages">Pages</NavLink></li>
				<li className="c-navbar__nav-item"><NavLink className="c-navbar__nav-link" match={'/settings/Users/*'}  activeClassName={'is-active'} to="/settings/Users">Users</NavLink></li>
				{/*<li className="c-navbar__nav-item"><NavLink className="c-navbar__nav-link" exact={true} activeClassName={'is-active'} to="/settings/smtp">Email Setup</NavLink></li>*/}
				{/*<li className="c-navbar__nav-item"><NavLink className="c-navbar__nav-link" exact={true} activeClassName={'is-active'} to="/settings/qsserver">Qlik Sense Setup</NavLink></li>*/}
				<li className="c-navbar__nav-item"><NavLink className="c-navbar__nav-link" match={'/settings/groups/*'} activeClassName={'is-active'} to="/settings/groups">Security Groups</NavLink></li>

			</ul>
		)
		const guestLinks = (
			<ul className="c-navbar__nav-list">
				<li className="c-navbar__nav-item"><NavLink exact={true} activeClassName={'is-active'} className="c-navbar__nav-link" to="/">Home</NavLink></li>
				<li className="c-navbar__nav-item"><NavLink exact={true} activeClassName={'is-active'} className="c-navbar__nav-link" to="/login">Login</NavLink></li>
				{/*<li className="c-navbar__nav-item"><NavLink exact={true} activeClassName={'is-active'}  className="c-navbar__nav-link" to="/register"> Register </NavLink></li>*/}
			</ul>
		);

		return (
			<header className="c-navbar u-mb-large container">
				<Link className="c-navbar__brand" to="/">
					<img src={logo} width="200px" alt="Neat" title="Neat UI Kit"/>
				</Link>

				<nav className="c-navbar__nav collapse" id="main-nav">
					{isAuthenticated && user.role === 'Admin' ? authAdminLinks :
						isAuthenticated && user.role !== 'Admin' ? authLinks : guestLinks}

				</nav>
				{isAuthenticated ? (
					<div className="c-dropdown dropdown u-mr-small u-ml-auto">
						<div className="c-dropdown dropdown">
							<div className="c-notification dropdown-toggle" id="dropdownMenuToggle2"
							     data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
								<Icon.User/>
							</div>

							<div className="c-dropdown__menu has-arrow dropdown-menu dropdown-menu-right"
							     aria-labelledby="dropdownMenuAvatar">
								<Link className="c-dropdown__item dropdown-item" to="/users/profile">{user.name} </Link>
								<Link className="c-dropdown__item dropdown-item" to="/dashboard/">Dashboard</Link>
								<span className="c-dropdown__item dropdown-item"
								   onClick={this.onLogoutClick.bind(this)}
								   >Logout</span>
							</div>
						</div>
					</div>
				) : null}

				<button className="c-navbar__nav-toggle" type="button"
				        data-toggle="collapse" data-target="#main-nav">
					<Icon.Menu/>
				</button>
			</header>

		);
	}
};

Header.protoTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth      : PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {logoutUser})(Header);
