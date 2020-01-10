import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes          from 'prop-types';
import {connect}          from "react-redux";
import * as Icon          from 'react-feather';

class TopBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page : {},
			showMenu : false
		}
	}

	onLogoutClick(e) {
		e.preventDefault();
		this.props.logoutUser();
	}

	render() {
		const {user} = this.props.auth;
		const {page} = this.props;
		return (
			<header className="c-navbar u-mb-medium">
				<button className="c-sidebar-toggle js-sidebar-toggle">
					<Icon.Menu />
				</button>
				<h2 className="c-navbar__title u-text-capitalize">{page.title} </h2>

				<p className="u-color-secondary u-hidden-down@mobile">{page.description}</p>

				<div className="c-dropdown dropdown u-mr-small u-ml-auto">
					<div className="c-dropdown dropdown">
						<div className="c-notification dropdown-toggle" id="dropdownMenuToggle2"
						     data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
							<Icon.User/>
						</div>

						<div className="c-dropdown__menu has-arrow dropdown-menu dropdown-menu-right"
						     aria-labelledby="dropdownMenuAvatar">
							<Link className="c-dropdown__item dropdown-item" to="/users/profile">{user.name} </Link>
							<Link className="c-dropdown__item dropdown-item" to="/settings">Settings</Link>
							<Link className="c-dropdown__item dropdown-item"
							   onClick={this.onLogoutClick.bind(this)}
							   to="/help">Logout</Link>
						</div>
					</div>
				</div>
			</header>
		);
	}
};

TopBar.protoTypes = {
		auth       : PropTypes.object.isRequired,
	};

const mapStateToProps = (state) => ({
	auth    : state.auth,
});

export default connect(mapStateToProps, {})(withRouter(TopBar));
