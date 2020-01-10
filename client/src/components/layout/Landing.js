import React, {Component} from 'react';
import {Link}             from 'react-router-dom';
import PropTypes          from 'prop-types';
import {connect}          from "react-redux";
import {logoutUser}       from "../../actions/authActions";
import {qlikLoginSSO}     from "../../actions/authActions";

import * as Icon     from 'react-feather';
import Header        from "./Header";

class Landing extends Component {

	onLogoutClick(e) {
		e.preventDefault();
		this.props.logoutUser();
	}

	componentWillMount() {
		if(this.props.auth.isAuthenticated){
			this.props.qlikLoginSSO(this.props.auth);
		}else{
			this.props.history.push('/login');
		}
	}

	componentDidMount() {
		if(!this.props.auth.isAuthenticated){
			this.props.history.push('/login');
		}
	}


	componentWillReceiveProps(nextProps, nextContext) {
		if(!this.props.auth.isAuthenticated){
			this.props.history.push('/login');
		}
	}

	render() {
		const {isAuthenticated, user} = this.props.auth;
		return (
			<div className="o-page">
				<Header/>

				<div className="container">
					<div className="row u-justify-center">
						<div className="col-lg-6 u-text-center">
							{isAuthenticated ?
								(<h2 className="u-mb-small">Hello {user.name}, Welcome to your dashboard </h2>) :
								(<h2 className="u-mb-small"><Link to="/login"> Login </Link> to get started</h2>)}

							<p className="u-text-large u-mb-large">
								Start using dashboard by exploring features included, we built a complete, easy to
								configure
								Qlik Sense Mashup Portal just for you to help get up and running as quickly as possible.
							</p>
						</div>
					</div>

					{isAuthenticated ? (
						<div>
							<div className="row">
								<div className="col-md-6 col-xl-6 u-m-auto">
									<div className="c-card is-animated">
									<span className="c-icon c-icon--large u-mb-small">
										<Icon.BarChart2 color="#f19012"/>
									</span>

										<h5 className="u-mb-xsmall">Explore Your Dashboard</h5>
										<p className="u-mb-medium">
											Start exploring the various visualisations powered by the Qlik's
											Qix Engine
										</p>
										<Link className="c-btn c-btn--warning has-arrow"
										      to="/dashboard/">Explore
										</Link>
									</div>
								</div>
								<div className="col-md-6 col-xl-6 u-m-auto">
									<div className="c-card is-animated">
									<span className="c-icon c-icon--large u-mb-small">
										<Icon.UserCheck color="#f19012"/>
									</span>

										<h5 className="u-mb-xsmall">Edit Profile</h5>
										<p className="u-mb-medium">
											View and update your account details, profile settings and manage password.
										</p>
										<Link to="/users/profile" className="c-btn c-btn--warning has-arrow">Manage
											Account</Link>
									</div>
								</div>
							</div>
							{user.role === 'Admin' ?
								<div className="row">
									<div className="col-md-6 col-xl-4 u-m-auto">
										<div className="c-card is-animated">
									<span className="c-icon c-icon--large u-mb-small">
										<Icon.Book color="#f19012"/>
									</span>
											<h5 className="u-mb-xsmall">Create A Page</h5>
											<p className="u-mb-medium">
												Create a new page with pre-configured templates for, Dashboard, Analysis
												or Reports.
											</p>
											<Link className="c-btn c-btn--warning has-arrow"
											      to="/settings/pages/">Page Manager</Link>
										</div>
									</div>

									<div className="col-md-6 col-xl-4 u-m-auto">
										<div className="c-card is-animated">
									<span className="c-icon c-icon--large u-mb-small">
										<Icon.UserPlus color="#f19012"/>
									</span>

											<h5 className="u-mb-xsmall">Add Team Members</h5>
											<p className="u-mb-medium">
												Invite your team members to dashboard and work with your data together.
											</p>
											<Link to="/settings/users/create"
											      className="c-btn c-btn--warning has-arrow">Manage Users
											</Link>
										</div>
									</div>

									<div className="col-md-6 col-xl-4 u-m-auto">
										<div className="c-card is-animated">
											<span className="c-icon c-icon--large u-mb-small"><Icon.Settings
												color="#f19012"/> </span>

											<h5 className="u-mb-xsmall">Admin Settings</h5>
											<p className="u-mb-medium">
												Manage your portal settings including users, Qlik Sense Server, Apps and
												Objects.
											</p>
											<Link to="/settings"
											      className="c-btn c-btn--warning has-arrow">Manage </Link>
										</div>
									</div>
								</div>
								: ''}
						</div>

					) : (
						<div className="row">
							{/*<div className="col-md-6 col-xl-6 u-m-auto">*/}
							{/*	<div className="c-card is-animated">*/}
							{/*		<span className="c-icon c-icon--large u-mb-small"><Icon.UserPlus color="#f19012"/> </span>*/}

							{/*		<h5 className="u-mb-xsmall">Register</h5>*/}
							{/*		<p className="u-mb-medium">*/}
							{/*			New to dashboard ? Create account to start exploring.*/}
							{/*		</p>*/}
							{/*		<Link to="/register" className="c-btn c-btn--warning has-arrow">Create Account*/}
							{/*		</Link>*/}
							{/*	</div>*/}
							{/*</div>*/}

							<div className="col-md-6 col-xl-6 u-m-auto">
								<div className="c-card is-animated">
									<span className="c-icon c-icon--large u-mb-small"><Icon.LogIn
										color="#f19012"/></span>

									<h5 className="u-mb-xsmall">Login</h5>
									<p className="u-mb-medium">
										Already have an account ? Login to gain new insights.
									</p>
									<Link to="/login"
									      className="c-btn c-btn--warning has-arrow"> Login </Link>
								</div>
							</div>
						</div>

					)}

					<div className="row">
						<div className="col-12">
							<footer className="c-footer">
								<p>© 2019 CatalystiT Solutions </p>
								<span className="c-footer__divider">|</span>
								<nav>
									<span className="c-footer__link" href="#">Terms</span>
									<span className="c-footer__link" href="#">Privacy</span>
									<span className="c-footer__link" href="#">FAQ</span>
									<span className="c-footer__link" href="#">Help</span>
								</nav>
							</footer>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

Landing.protoTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth      : PropTypes.object.isRequired,
	qlikLoginSSO : PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {logoutUser, qlikLoginSSO})(Landing);
