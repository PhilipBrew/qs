import React, {Component}          from 'react';
import Header                      from "../../layout/Header";
import Footer                      from "../../layout/Footer";
import PropTypes                   from 'prop-types';
import {connect}                   from "react-redux";
import {withRouter, NavLink, Link} from "react-router-dom";
import Loading                     from "../../common/Loading";
import {getGroups}                 from "../../../actions/groupsActions";
import * as Icon                   from 'react-feather';
import axios                       from 'axios';
import {ToastsStore}               from "react-toasts";
import {logoutUser}                from "../../../actions/authActions";
import classnames                  from "classnames";
import SelectFieldGroup            from "../../common/SelectFieldGroup";
import {updateAuthToken}                from "../../../actions/authActions";

class ViewUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading        : true,
			profile        : null,
			group          : '',
			errors         : {},
			password       : '',
			newPassword    : '',
			confirmPassword: '',
			groupsOptions  : [],
			showResourceDeleteConfirmWindow : false,
			toDelete : {
				type : '',
				id : '',
			}

		};
		this.getProfile = this.getProfile.bind(this);
		this.changePasswordRequest = this.changePasswordRequest.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onResourceSelect = this.onResourceSelect.bind(this);
		this.onResourceFormSubmit = this.onResourceFormSubmit.bind(this);
	}

	resourceDeleteConfirmWindow(type, id){
		this.setState({showResourceDeleteConfirmWindow : true, toDelete : {type , id}});
	}

	resourceDeleteConfirmed(){
		const type = this.state.toDelete.type;
		const id = this.props.match.params.id;
		const group_id = this.state.toDelete.id;

		axios.delete(`/api/groups/resources/${type}/${group_id}/${id}`)
		.then((res) => {
			this.setState({showResourceDeleteConfirmWindow : true, toDelete : {type , id}});
			this.getProfile(this.props.match.params.id);
			ToastsStore.success(`${group_id} removed from group`);
		})
		.catch(err => {this.setState({errors : err.response.data})})
	}

	resourceDeleteCancelled(){
		this.setState({showResourceDeleteConfirmWindow : false, toDelete : {type : '' , id : ''}});
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onResourceSelect(e) {
		e.preventDefault();
		const group = e.target.value;
		this.setState({group});
	}

	onResourceFormSubmit(e) {
		e.preventDefault();
		const resourceData = {
			type       : 'users',
			resource_id: this.props.match.params.id
		};

		const group_id = this.state.group;

		axios.post(`/api/groups/resources/${group_id}`, resourceData)
		.then(() => {
			this.getProfile();
			ToastsStore.success(`${resourceData.type} ${resourceData.resource_id} added to group.`);
		})
		.catch(err => {this.setState({errors: err.response.data});})
	}

	getProfile() {
		axios.get(`/api/users/${this.props.match.params.id}`)
		.then(res => {
			this.setState({profile: res.data, loading: false});
		}).catch(err => {
			this.setState({errors: err});
		});
	}

	changePasswordRequest(e) {
		e.preventDefault();
		const passwordData = {
			name   : this.state.profile.name,
			userId : this.state.profile._id,
			mailTo : this.state.profile.email,
			baseUrl: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`

		};

		axios
		.post('/api/users/change-password-email', passwordData)
		.then(res => {
			ToastsStore.success('Password change successful');

		}).catch(err => {
			this.setState({errors: err.response.data})
		})

	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount() {
		this.getProfile();
		this.props.getGroups()
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (nextProps.groups.groups) {
			let groupOptions = [];

			for (let group of nextProps.groups.groups) {
				groupOptions.push({key: group._id, title: group.name})
			}
			this.setState({groupOptions});
		}
	}

	render() {
		const {loading, profile} = this.state;
		return (
			<div className="o-page">
				<Header/>
				{(profile === null || loading) ? <Loading/> :
					<div className="container">
						<div className="row">
							<div className="col-md-8 u-mb-small col-sm-12">
								<div className="c-card u-height-100">
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
									<span
										className="c-badge u-mt-small c-badge--small c-badge--warning u-mb-xsmall">{profile.active ? 'Active' : 'In Active'}</span>
								</div>
							</div>

							<div className="col-md-4 u-mb-small col-sm-12">
								<nav className="c-tabs u-height-100">
									<div className="c-tabs__list nav nav-tabs" id="myTab" role="tablist">
										<a className="c-tabs__link active" id="nav-home-tab" data-toggle="tab"
										   href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Account
											Actions</a>
									</div>
									<div className="c-tabs__content tab-content" id="nav-tabContent">
										<div className="c-tabs__pane active" id="nav-home" role="tabpanel"
										     aria-labelledby="nav-home-tab">
											<Link
												className={classnames('u-mb-small c-btn c-btn--danger c-btn--fullwidth', {'is-disabled': profile._id === this.props.auth.user.id})}
												to={`/settings/users/delete/${profile._id}`}>Delete User</Link>
											<button className="u-mb-small c-btn c-btn--warning c-btn--fullwidth"
											        onClick={(e) => this.changePasswordRequest(e)}>Send Password Change
												Email
											</button>
											<Link to={`/settings/users/edit/${profile._id}`}
											      className="u-mb-small c-btn c-btn--info c-btn--fullwidth">Edit User
												Account </Link>
										</div>
									</div>
								</nav>
							</div>

							<div className="col-md-12 u-mb-small col-sm-12">
								<div className="c-tabs u-height-100">
									<div className="c-tabs__list nav nav-tabs" role="tablist">
										<a className="c-tabs__link active" id="nav-home-tab" data-toggle="tab"
										   href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">User
											Groups</a>
									</div>
									<div className="c-tabs__content tab-content" id="nav-tabContent">
										<div className="c-tabs__pane active" id="nav-home" role="tabpanel"
										     aria-labelledby="nav-home-tab">
											<form onSubmit={this.onResourceFormSubmit}>
												{
													this.state.groupOptions ?
														<div className={'row'}>
															<div className={'col-sm-9'}>
																<SelectFieldGroup options={this.state.groupOptions} label={'New User Groups'} type={'text'}
																                  onChange={this.onResourceSelect} value={this.state.group} name={'group'}/>
															</div>
															<div className={'col-sm-3'}>
																<div className="c-field c-pt-cust-23">
																	<button className="c-btn--warning u-p-xsmall c-btn--small c-btn c-btn__icon c-btn--fullwidth">ADD</button>
																</div>
															</div>
														</div>
														: ''
												}
											</form>

											<ul className="u-m-zero list-group">
												{
													profile.groups.map(group =>
														<li key={group._id} className="u-border-bottom u-border-top u-p-xsmall list-group-item d-flex justify-content-between align-items-center">
															{group.name}
															{!this.state.showResourceDeleteConfirmWindow || this.state.toDelete.id !== group._id ?
																<span className="badge-pill">
																	<button className="c-btn c-btn--danger c-btn--small u-mr-small" onClick={(e) => {this.resourceDeleteConfirmWindow('users', group._id)}}>Delete</button>
																	<NavLink exact={true} to={`/settings/groups/view/${group._id}`} className="c-btn c-btn--info c-btn--small u-ml-small">Edit Group</NavLink>
																	<NavLink exact={true} to={`/settings/groups/view/${group._id}`} className="c-btn c-btn--warning c-btn--small u-ml-small">View Group</NavLink>
																</span>
																:
																<span className="badge-pill">
																	<button type={'button'} className="c-btn c-btn--danger u-m-xsmall c-btn--small has-arrow u-text-center" onClick={(e) => {this.resourceDeleteConfirmed()}}>Delete User From Group</button>
																	<button type={'button'} className="c-btn c-btn--secondary u-m-xsmall c-btn--small has-arrow u-text-center" onClick={(e) => {this.resourceDeleteCancelled()}}>Cancel</button>
																</span>
															}
														</li>
													)
												}
											</ul>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				}
				<Footer/>
			</div>
		);
	}
}

ViewUser.propTypes = {
	auth     : PropTypes.object.isRequired,
	errors   : PropTypes.object.isRequired,
	getGroups: PropTypes.func.isRequired,

};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	errors: state.errors,
	groups: state.groups
});
export default connect(mapStateToProps, {logoutUser, getGroups,updateAuthToken})(withRouter(ViewUser));
