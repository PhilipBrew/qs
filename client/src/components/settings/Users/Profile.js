import React, {Component} from 'react';
import Header             from "../../layout/Header";
import Footer             from "../../layout/Footer";
import PropTypes          from 'prop-types';
import {connect}          from "react-redux";
import { withRouter} from "react-router-dom";
import Loading            from "../../common/Loading";
import * as Icon          from 'react-feather';
import axios              from 'axios';
import TextFieldGroup     from "../../common/TextFieldGroup";
import {ToastsStore}      from "react-toasts";
import {logoutUser}       from "../../../actions/authActions";
import {updateAuthToken}                from "../../../actions/authActions";

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			profile: null,
			errors : {},
			password : '',
			newPassword : '',
			confirmPassword : ''
		};
		this.getProfile = this.getProfile.bind(this);
		this.resetPassword = this.resetPassword.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		this.setState( {[e.target.name]: e.target.value});
	}

	getProfile() {
		axios.get('/api/users/current')
		     .then(res => {
			     this.setState({profile: res.data, loading: false});
		     }).catch(err => {
			this.setState({errors: err});
		});
	}

	resetPassword(e) {
		e.preventDefault();
		const passwordData = {
			password : this.state.password,
			newPassword : this.state.newPassword,
			confirmPassword : this.state.confirmPassword
		};

		axios
			.post('/api/users/change-password', passwordData)
			.then(res => {
			ToastsStore.success('Password change successful');

		}).catch(err => {
			this.setState({errors : err.response.data})
		})
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount() {
		this.getProfile();
	}

	render() {
		const {loading, profile, errors} = this.state;

		return (
			<div className="o-page">
				<Header/>
				{(profile === null || loading) ? <Loading/> :
					<div className="container">
						<div className="row">
							<div className="col-md-5">
								<div className="c-card">
									<div className="u-text-center">
										<div className="c-avatar c-avatar--large u-mb-small u-inline-flex">
											<span className="c-icon c-icon--large c-icon--warning u-mb-small">
												<Icon.UserCheck color={'white'}/>
											</span>
										</div>

										<h5>{profile.name}</h5>
										<p>{profile.directory}/{profile.qsId}</p>
									</div>

									<span className="c-divider u-mv-small"></span>

									<span className="c-text--subtitle">Email Address</span>
									<p className="u-mb-small u-text-large">{profile.email}</p>

									<span className="c-text--subtitle">Role</span>
									<p className="u-mb-small u-text-large">{profile.role}</p>

									<span className="c-text--subtitle u-block">Status</span>
									<span className="c-badge u-mt-small c-badge--small c-badge--warning u-mb-xsmall" >{profile.active ? 'Active' : 'In Active'}</span>
								</div>
							</div>

							<div className="col-md-7">
								<nav className="c-tabs">
									<div className="c-tabs__list nav nav-tabs" id="myTab" role="tablist">
										<a className="c-tabs__link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Change Password</a>
									</div>
									<div className="c-tabs__content tab-content" id="nav-tabContent">
										<div className="c-tabs__pane active" id="nav-home" role="tabpanel"
										     aria-labelledby="nav-home-tab">
											<p className={'u-mb-medium'}>Strong password required. Enter 8-16 characters. Do not include common words or names. Combine uppercase letters, lowercase letters, numbers and symbols.</p>
											<form onClick={this.resetPassword} noValidate>
												<TextFieldGroup
													label="Old Password"
													type="password"
													onChange={this.onChange}
													value={this.state.password}
													error={errors.password}
													name="password"/>
												<TextFieldGroup
													label="New Password"
													type="password"
													onChange={this.onChange}
													value={this.state.newPassword}
													error={errors.newPassword}
													name="newPassword" />
												<TextFieldGroup
													label="Confirm Password"
													type="password"
													onChange={this.onChange}
													error={errors.confirmPassword}
													value={this.state.confirmPassword}
													name="confirmPassword"
													/>
												<button type={'submit'} className="c-btn c-btn--warning has-arrow"> Change Password </button>
												<p>Changes made to your password will take effect from your next login.</p>
											</form>
										</div>
									</div>
								</nav>
							</div>
						</div>
					</div>
				}
				<Footer/>
			</div>
		);
	}
}

Profile.propTypes = {
	auth  : PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	logoutUser : PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	errors: state.errors,
});
export default connect(mapStateToProps, {logoutUser,updateAuthToken})(withRouter(Profile));
