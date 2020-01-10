import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import {Link, withRouter} from "react-router-dom";
import {connect}          from "react-redux";
import Header             from "../../layout/Header";
import Footer             from "../../layout/Footer";
import Loading            from "../../common/Loading";
import * as Icon          from "react-feather";
import axios              from "axios";
// import SelectField        from "../../common/SelectFieldGroup";
import classnames         from "classnames";
import {ToastsStore}      from "react-toasts";
import {updateAuthToken}                from "../../../actions/authActions";

class ViewGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			objects     : null,
			group       : null,
			pages : [],
			errors      : {},
			users : [],
			loading     : true,
			qssOptions  : null,
			resourceValue     : '',
			resourceType : '',
			usersOptions: [],
			pageOptions : [],
			showResourceDeleteConfirmWindow : false,
			toDelete : {
				type : '',
				id : '',
			}
		};

		this.getGroup = this.getGroup.bind(this);
		this.getQsServerDetails = this.getQsServerDetails.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.getPages = this.getPages.bind(this);
		this.onResourceSelect = this.onResourceSelect.bind(this);
		this.onResourceFormSubmit = this.onResourceFormSubmit.bind(this);
		this.resourceDeleteConfirmWindow = this.resourceDeleteConfirmWindow.bind(this);
		this.resourceDeleteConfirmed = this.resourceDeleteConfirmed.bind(this);
		this.resourceDeleteCancelled = this.resourceDeleteCancelled.bind(this);

	}

	resourceDeleteConfirmWindow(type, id){
		this.setState({showResourceDeleteConfirmWindow : true, toDelete : {type , id}});
	}

	resourceDeleteConfirmed(){
		const {type, id} = this.state.toDelete;
		const group_id = this.props.match.params.id;

		axios.delete(`/api/groups/resources/${type}/${group_id}/${id}`)
		     .then((res) => {
			     this.setState({showResourceDeleteConfirmWindow : true, toDelete : {type , id}});
			     this.getGroup(group_id);
			     ToastsStore.success(`${res.data.name} removed from group`);
		     })
		     .catch(err => {this.setState({errors : err.response.data})})
	}

	resourceDeleteCancelled(){
		this.setState({showResourceDeleteConfirmWindow : false, toDelete : {type : '' , id : ''}});
	}

	onResourceSelect(e){
		e.preventDefault();
		this.setState({resourceValue : e.target.value, resourceType : e.target.name});
	}

	onResourceFormSubmit(e){


		e.preventDefault();
		const resourceData = {
			type       : this.state.resourceType,
			resource_id: this.state.resourceValue
		};
		const group_id = this.props.match.params.id;

		axios.post(`/api/groups/resources/${group_id}`, resourceData)
			.then(() => {
				this.getGroup(group_id);
				ToastsStore.success(`${resourceData.type} ${resourceData.resource_id} added to group.`);
			})
			.catch(err => { this.setState({errors : err.response.data})});
	}

	getUsers(){
		axios.get('/api/users')
			.then(res => {
				let userOptions = [];
				res.data.map(user => {
					return userOptions.push({key : user._id, name : user.email})
				});
				this.setState({userOptions});
			})
			.catch(err => {
				this.setState({errors : err.response.data});
			})
	}

	getPages(){
		this.setState({loading : true});
		axios.get('/api/pages')
		     .then(res => {
			     let pageOptions = [];
			     res.data.map(page => {
				     return pageOptions.push({key : page._id, title : page.title})
			     });
			     this.setState({pageOptions});
		     })
		     .catch(err => {
			     this.setState({errors : err.response.data})
		     })
	}

	getQsServerDetails() {
		axios.get('/api/qsserver')
		     .then(res => {
			     const secure = res.data.secure === 'YES' ? true : false;
			     const port = res.data.port !== null ? parseInt(res.data.port) : 80;

			     this.setState({
	                   qssOptions: {
		                   config: {
			                   host  : res.data.hostname,
			                   secure: secure,
			                   port  : port,
			                   prefix: res.data.prefix,
			                   appId : res.data.app
		                   }
	                   },
	                   servername : res.data.name });
		     });
	}

	getGroup (group_id) {
		axios.get(`/api/groups/${group_id}`)
		     .then(res => {
			     this.setState({group : res.data});
		     }).catch(err => {
			this.setState({errors : err.response.data});
		});

		axios.get(`/api/groups/pages/${group_id}`)
			.then(res => {
				this.setState({pages : res.data});
			})
			 .catch(err => {
			 	this.setState({errors : err.response.data});
			 });

		axios.get(`/api/groups/users/${group_id}`)
		     .then(res => {
			     this.setState({users : res.data});
		     })
		     .catch(err => {
			     this.setState({errors : err.response.data});
		     })
	};

	componentDidMount() {
		const group_id = this.props.match.params.id;
		//GET GROUP CONTENT
		this.getGroup(group_id);

		//GET QLIK SENSE SERVER DETAILS
		this.getQsServerDetails();

		//GET LIST OF USERS and PAGES FOR OPTIONS
		this.getUsers();
		this.getPages();

		//SET LOADING TO FALSE
		this.setState({loading : false});
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({
			              objects: null,
			              group   : null,
			              errors : {},
			              loading: true
		              });

		const group_id = nextProps.match.params.id;

		//GET GROUP CONTENT
		this.getGroup(group_id);

		//GET QLIK SENSE SERVER DETAILS
		this.getQsServerDetails();

		//SET LOADING TO FALSE
		this.setState({loading : false});
	}


	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	render() {
		const {group, userOptions, pageOptions, loading , pages, users} = this.state;
		return (
			<div className="o-group">
				<Header/>
				<div className="container">{
					loading || group === null ?
						<Loading/> :
						<div className="row">
							<div className="col-md-12 col-lg-12">
								<div className="c-tabs">
									<div className="o-line u-pl-xsmall u-pr-xsmall u-pt-medium ">
										<h3 className="u-color-secondary u-mb-xsmall">{group.name}</h3>
										<div
											className="c-dropdown dropdown">
											<span
											   className="c-btn c-btn--warning has-icon dropdown-toggle"
											   id="MoreActionsDropdown"
											   data-toggle="dropdown"
											   aria-haspopup="true"
											   aria-expanded="false">
												More <Icon.ChevronDown size={14} />
											</span>

											<div
												className="c-dropdown__menu dropdown-menu has-arrow dropdown-menu-right"
												aria-labelledby="MoreActionsDropdown">
												<Link to={`/settings/groups/`} className="c-dropdown__item dropdown-item ">Groups</Link>
												<Link to={`/settings/groups/edit/${group._id}`} className="c-dropdown__item dropdown-item ">Edit Group</Link>
												<Link to={`/settings/groups/create`} className="c-dropdown__item dropdown-item "> Create Group</Link>
											</div>
										</div>
									</div>

									<div className="u-pl-xsmall u-pb-medium u-pr-xsmall">
										<p>{group.description}</p>
									</div>

									<nav className="c-tabs__list nav nav-tabs" id="myTab" role="tablist">
										<a className="c-tabs__link active" id="pages-tab" data-toggle="tab"
										   href="#pages" role="tab" aria-controls="pages"
										   aria-selected="true">Pages</a>
										<a className="c-tabs__link" id="nav-users-tab" data-toggle="tab"
										   href="#nav-users" role="tab" aria-controls="nav-users"
										   aria-selected="false">Users</a>
									</nav>

									<div className="c-tabs__content tab-content" id="nav-tabContent">
										<div className="c-tabs__pane u-p-zero active" id="pages" role="tabpanel"
										     aria-labelledby="pages-tab">
											{
												!loading && pages && pages.length <= 0 ?
													<div className="c-alert c-alert--warning">
											            <span className="c-alert__icon">
												            <Icon.Triangle size={14}/>
											            </span>

														<div className="c-alert__content">
															<h4 className="c-alert__title">Nothing to show</h4>
															<p>Start adding pages to this group. Pages added to this group are restricted only to users in this group</p>
														</div>
													</div> :
													<div className="c-table-responsive@wide">
														<table className="c-table u-ml-zero">
															<thead className="c-table__head">
															<tr className="c-table__row">
																<th className="c-table__cell c-table__cell--head">Page Title</th>
																<th className="c-table__cell c-table__cell--head" width="90">Actions</th>
															</tr>
															</thead>

															<tbody>
															{
																pages.map(page =>
																	<tr className="c-table__row" key={page._id}>
																		<td className="c-table__cell u-pb-xsmall u-pt-xsmall">{page.title}</td>
																		{ !this.state.showResourceDeleteConfirmWindow || this.state.toDelete.id !== page._id ?
																			<td className="c-table__cell u-pb-xsmall u-pt-xsmall" width="70">
																				<Link to={`/settings/pages/view/${page._id}`} className="c-btn c-btn--warning u-m-xsmall c-btn--small has-arrow u-text-center"><Icon.Eye size={14}/></Link>
																				<Link to={`/settings/pages/edit/${page._id}`} className="c-btn c-btn--info u-m-xsmall c-btn--small has-arrow u-text-center"><Icon.Edit3 size={14}/></Link>
																				<button type={'button'} className="c-btn c-btn--danger u-m-xsmall c-btn--small has-arrow u-text-center" onClick={(e) => {this.resourceDeleteConfirmWindow('pages',page._id)}}><Icon.Slash size={14}/></button>
																		</td>
																			: <td className="c-table__cell u-pb-xsmall u-pt-xsmall o-line">
																				<button type={'button'} className="c-btn c-btn--danger c-btn--fullwidth u-m-xsmall c-btn--small has-arrow u-text-center" onClick={(e) => {this.resourceDeleteConfirmed()}}>Delete</button>
																				<button type={'button'} className="c-btn c-btn--secondary c-btn--fullwidth u-m-xsmall c-btn--small has-arrow u-text-center" onClick={(e) => {this.resourceDeleteCancelled()}}>Cancel</button>
																			</td>}
																	</tr>
																)
															}
															</tbody>
														</table>
													</div>
											}
											<form onSubmit={this.onResourceFormSubmit}>
												<div className="row u-m-small">
													<div className="c-field u-pb-small col-sm-8 u-mt-small">
														<label className="c-field__label">Add page to
															group</label>
														<div className="c-select u-mb-xsmall">
															<select
																className={classnames('c-select__input', {' c-select--danger': this.state.errors.newPage})}
																type={'text'}
																name={'pages'}
																onChange={this.onResourceSelect}>
																<option>Select Page</option>
																{
																	pageOptions ?
																		pageOptions.map(page => <option
																			key={page.key}
																			value={page.key}>{page.title}</option>) : null
																}
															</select>
														</div>
													</div>

													<div className="c-field u-p-xsmall col-sm-4 u-mt-medium">
														<div className={'o-line '}>
															<button
																className="c-btn c-btn--fullwidth c-btn--warning"
																type={'submit'}>
																Add Page to Group
															</button>
														</div>
													</div>
												</div>
											</form>
										</div>

										<div className="c-tabs__pane u-p-zero" id="nav-users" role="tabpanel"
										     aria-labelledby="nav-users-tab">
											<div className="c-table-responsive@wide">
												<table className="c-table u-ml-zero">
													<thead className="c-table__head">
													<tr className="c-table__row">
														<th className="c-table__cell c-table__cell--head">User Name</th>
														<th className="c-table__cell c-table__cell--head">User Email</th>
														<th className="c-table__cell c-table__cell--head">Actions</th>
													</tr>
													</thead>

													<tbody>

													{
														users.map(user =>
															                <tr className="c-table__row" key={user._id}>
																                <td className="c-table__cell u-pb-xsmall u-pt-xsmall">{user.name}</td>
																                <td className="c-table__cell u-pb-xsmall u-pt-xsmall"><small>{user.email}</small></td>
																                { !this.state.showResourceDeleteConfirmWindow || this.state.toDelete.id !== user._id ?
																	                <td className="c-table__cell u-pb-xsmall u-pt-xsmall" width="70">
																		                <Link to={`/settings/users/view/${user._id}`} className="c-btn c-btn--warning u-m-xsmall c-btn--small has-arrow u-text-center"><Icon.Eye size={14}/></Link>
																		                <Link to={`/settings/users/edit/${user._id}`} className="c-btn c-btn--info u-m-xsmall c-btn--small has-arrow u-text-center"><Icon.Edit3 size={14}/></Link>
																		                <button type={'button'} className="c-btn c-btn--danger u-m-xsmall c-btn--small u-m-xsmall has-arrow u-text-center" onClick={(e) => {this.resourceDeleteConfirmWindow('users', user._id)}}><Icon.Slash size={14}/></button>
																	                </td> :
																	                <td className="c-table__cell u-pb-xsmall u-pt-xsmall o-line">
																		                <button type={'button'} className="c-btn c-btn--danger c-btn--fullwidth u-m-xsmall c-btn--small has-arrow u-text-center" onClick={(e) => {this.resourceDeleteConfirmed()}}>Delete</button>
																		                <button type={'button'} className="c-btn c-btn--secondary c-btn--fullwidth u-m-xsmall c-btn--small has-arrow u-text-center" onClick={(e) => {this.resourceDeleteCancelled()}}>Cancel</button>
																	                </td>
																                }
															                </tr>
														)
													}
													</tbody>
											</table>
											</div>
											<form onSubmit={this.onResourceFormSubmit}>
												<div className="row u-m-small">
													<div className="c-field u-pb-small col-sm-8 u-mt-small">
														<label className="c-field__label">Add user to
															group</label>
														<div className="c-select u-mb-xsmall">
															<select
																className={classnames('c-select__input', {' c-select--danger': this.state.errors.newUser})}
																type={'text'}
																name={'users'}
																onChange={this.onResourceSelect}>
																<option>Select User</option>
																{
																	userOptions ?
																		userOptions.map(user => <option
																			key={user.key}
																			value={user.key}>{user.name}</option>) : null
																}
															</select>
														</div>
													</div>

													<div className="c-field u-p-xsmall col-sm-4 u-mt-medium">
														<div className={'o-line '}>
															<button
																className="c-btn c-btn--fullwidth c-btn--warning"
																type={'submit'}>
																Add User to Group
															</button>
														</div>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
				}</div>
				<Footer/>
			</div>
		);
	}
}

ViewGroup.propTypes = {
	auth        : PropTypes.object.isRequired,
	updateAuthToken : PropTypes.func.isRequired,

};

const mapStateToProps = (state) => ({
	auth   : state.auth,
	groups  : state.groups,
	objects: state.objects,
	errors : state.errors
});

export default connect(mapStateToProps, {updateAuthToken})(withRouter(ViewGroup));
