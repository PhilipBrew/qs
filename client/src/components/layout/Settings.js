import React, {Component} from 'react';
import {Link}             from 'react-router-dom';
import PropTypes          from 'prop-types';
import {connect}          from "react-redux";
import {logoutUser}       from "../../actions/authActions";
import Header             from "./Header";
import Footer             from "./Footer";
import * as Icon          from 'react-feather';

class Settings extends Component {
	onLogoutClick(e) {
		e.preventDefault();
		this.props.logoutUser();
	}
	
	componentDidMount() {
		if (!this.props.auth.isAuthenticated) {
			this.props.history.push('/login');
		}
	}
	
	render() {
		const {user} = this.props.auth;
		
		const manageProfile = (<div className="col-md-6 col-xl-4 u-ml-auto">
			<div className="c-card is-animated">
									<span className="c-icon c-icon--large u-mb-small">
			<Icon.UserCheck color="#f19012"/>
									</span>
				
				<h5 className="u-mb-xsmall">Edit Profile</h5>
				<p className="u-mb-medium">
					View and update your account details, and profile settings.
				</p>
				<Link to="/users/profile" className="c-btn c-btn--warning has-arrow">Manage Account</Link>
			</div>
		</div>);
		
		return (
			<div className="o-page">
				<Header/>
				<div className="container">
					<div className="row u-justify-center">
						<div className="col-lg-6 u-text-center">
							
							<h2 className="u-mb-small">Hello {user.name}</h2>
							
							<p className="u-text-large u-mb-large">
								{user.role === 'Admin' ?
									'Configure and administer your dashboard site,including managing Qlik Sense Connections, Applications,  Objects, Users and Pages' :
									'Configure and manage your dashboard profile, change password and request for new Qlik Sense objects to be added to dashboard by the administrators. '
								}
							</p>
						</div>
					</div>
					
					{user.role === 'Admin' ? (
						<div>
							<div className="row">
								<div className="col-md-6 col-xl-4 u-ml-auto">
									<div className="c-card is-animated">
										<span className="c-icon c-icon--large u-mb-small">
											<Icon.Server color="#f19012"/>
										</span>
										
										<h5 className="u-mb-xsmall">Qlik Sense Server</h5>
										<p className="u-mb-medium">
											Setup the Qlik Sense Host to define Qlik engine connection and Qlik Sense
											client side software and extensions location.
										</p>
										<Link className="c-btn c-btn--warning has-arrow"
										      to="/settings/qsserver">QS Server
										</Link>
									</div>
								</div>
								
								<div className="col-md-6 col-xl-4 u-m-auto">
									<div className="c-card is-animated">
										<span className="c-icon c-icon--large u-mb-small"><Icon.Mail color="#f19012"/></span>
										
										<h5 className="u-mb-xsmall">Mail Server Settings</h5>
										<p className="u-mb-medium">
											Setup email SMTP details to enable outgoing emails from the portal.
										</p>
										<Link to="/settings/smtp"
										      className="c-btn c-btn--warning has-arrow">Manage Mail Server
										</Link>
									</div>
								</div>
								
								<div className="col-md-6 col-xl-4 u-mr-auto">
									<div className="c-card is-animated">
										<span className="c-icon c-icon--large u-mb-small"><Icon.Book color="#f19012"/></span>
										<h5 className="u-mb-xsmall">Site Manager</h5>
										<p className="u-mb-medium">
											Create, update and delete pages of the mashup application, add and remove
											objects from pages existing in the dashboard.
										</p>
										<Link className="c-btn c-btn--warning has-arrow"
										      to="/settings/pages">Manage Content</Link>
									</div>
								</div>
								
								<div className="col-md-6 col-xl-4 u-mr-auto">
									<div className="c-card is-animated">
										<span className="c-icon c-icon--large u-mb-small"><Icon.Users color="#f19012"/></span>
										
										<h5 className="u-mb-xsmall">Add Team Members</h5>
										<p className="u-mb-medium">
											Invite your team members to dashboard and work with your data together.
										</p>
										<Link to="/settings/users"
										      className="c-btn c-btn--warning has-arrow">Manage Users
										</Link>
									</div>
								</div>
								
								<div className="col-md-6 col-xl-4 u-mr-auto">
									<div className="c-card is-animated">
										<span className="c-icon c-icon--large u-mb-small"><Icon.ShieldOff color="#f19012"/></span>
										<h5 className="u-mb-xsmall">Security Groups</h5>
										<p className="u-mb-medium">
											Create, update and delete groups for pages, objects and users.
											Access to pages and objects can be restricted through groups.
										</p>
										<Link className="c-btn c-btn--warning has-arrow" to="/settings/groups">Manage Groups</Link>
									</div>
								</div>
								
								{manageProfile}
							</div>
						</div>
					) : (
						
						<div className="row">
							
							<div className="col-md-6 col-xl-4 u-mr-auto">
								<div className="c-card is-animated">
									<span className="c-icon c-icon--large u-mb-small">
										<Icon.BarChart2 color="#f19012"/>
									</span>
									<h5 className="u-mb-xsmall">Dashboard</h5>
									<p className="u-mb-medium">
										Go to dashboard to start exploring new insights.
									</p>
									<Link to="/"
									      className="c-btn c-btn--warning has-arrow"> Dashboard </Link>
								</div>
							</div>
							
							{manageProfile}
							
						
						</div>
					)}
					<Footer/>
				</div>
			</div>
		);
	}
};

Settings.protoTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth      : PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
})

export default connect(mapStateToProps, {logoutUser})(Settings);
