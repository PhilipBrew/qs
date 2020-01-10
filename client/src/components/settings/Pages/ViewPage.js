import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser, qlikLoginSSO } from '../../../actions/authActions';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import Loading from '../../common/Loading';
import Error from '../../common/Error';
import QdtComponent from '../../common/QdtComponent';
import * as Icon from 'react-feather';
import ReadMoreReact from 'read-more-react';
import { getPage, getSecuredPages } from '../../../actions/pagesActions';
import { getObjects } from '../../../actions/objectsAction';
import { getQsServer } from '../../../actions/qsServerActions';
import SelectFieldGroup from '../../common/SelectFieldGroup';
import { getGroups } from '../../../actions/groupsActions';
import isEmpty from '../../../validation/is-empty';
import axios from 'axios';
import { ToastsStore } from 'react-toasts';
import { updateAuthToken } from '../../../actions/authActions';
import Custom from './Templates/Custom';

class ViewPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			objects: null,
			page: null,
			errors: {},
			loading: true,
			group: '',
			qlikBaseUrl: null,
			qssOptions: null,
			showResourceDeleteConfirmWindow: false,
			toDelete: {
				type: '',
				id: ''
			}
		};
		this.onChange = this.onChange.bind(this);
		this.onResourceSelect = this.onResourceSelect.bind(this);
		this.onResourceFormSubmit = this.onResourceFormSubmit.bind(this);
	}

	resourceDeleteConfirmWindow(type, id) {
		this.setState({ showResourceDeleteConfirmWindow: true, toDelete: { type, id } });
	}

	resourceDeleteConfirmed() {
		const type = this.state.toDelete.type;
		const id = this.props.match.params.id;
		const group_id = this.state.toDelete.id;

		axios
			.delete(`/api/groups/resources/${type}/${group_id}/${id}`)
			.then(res => {
				this.setState({ showResourceDeleteConfirmWindow: true, toDelete: { type, id } });
				this.props.getPage(this.props.match.params.id);
				ToastsStore.success(`${group_id} removed from group`);
			})
			.catch(err => {
				this.setState({ errors: err.response.data });
			});
	}

	resourceDeleteCancelled() {
		this.setState({ showResourceDeleteConfirmWindow: false, toDelete: { type: '', id: '' } });
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	onResourceSelect(e) {
		e.preventDefault();
		const group = e.target.value;
		this.setState({ group });
	}

	onResourceFormSubmit(e) {
		e.preventDefault();
		const resourceData = {
			type: 'pages',
			resource_id: this.props.match.params.id
		};
		const group_id = this.state.group;

		axios
			.post(`/api/groups/resources/${group_id}`, resourceData)
			.then(() => {
				this.props.getPage(resourceData.resource_id);
				ToastsStore.success(`${resourceData.type} ${resourceData.resource_id} added to group.`);
			})
			.catch(err => {
				// console.log(err);
				ToastsStore.error(`Failed to add page to group ${group_id}`);
			});
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount() {
		const page_id = this.props.match.params.id;
		//GET PAGE CONTENT
		this.props.getPage(page_id);

		//GET QLIK SENSE SERVER DETAILS
		this.props.getQsServer();

		//GET OBJECTS
		this.props.getObjects(page_id);

		//GET GROUPS
		this.props.getGroups();

		//SET LOADING TO FALSE
		this.setState({ loading: false });
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({
			objects: null,
			page: null,
			errors: {},
			loading: true
		});

		//Make Page and Qlik sense Server Properties
		if (nextProps.pages && nextProps.qsServer) {
			if (nextProps.pages.page && nextProps.qsServer.qsServer) {
				this.setState({ pages: nextProps.pages.pages });
				let qsApp = null;

				//Check App Id Available in the page
				if (nextProps.pages.page.qsApp !== undefined) {
					if (!isEmpty(nextProps.pages.page.qsApp)) {
						qsApp = nextProps.pages.page.qsApp;
					}
				}

				const secure = nextProps.qsServer.qsServer.secure === 'YES' ? true : false;
				const protocol = secure ? 'https://' : 'http://';
				const port = nextProps.qsServer.qsServer.port !== null ? parseInt(nextProps.qsServer.qsServer.port) : 80;
				const prefix = isEmpty(nextProps.qsServer.qsServer.prefix) ? '/' : `/${nextProps.qsServer.qsServer.prefix}/`;
				const qTicket = localStorage.getItem('qTicket');
				const qlikBaseUrl = `${protocol}${nextProps.qsServer.qsServer.hostname}${prefix}`;
				const qlikLogo = `${qlikBaseUrl}resources/hub/img/core/logo/logo-76x76.png?qlikTicket=${qTicket}`;

				if (qsApp === null) {
					qsApp = nextProps.qsServer.qsServer.app;
				}

				this.setState({
					qssOptions: {
						config: {
							host: nextProps.qsServer.qsServer.hostname,
							secure: secure,
							port: port,
							prefix: nextProps.qsServer.qsServer.prefix,
							appId: qsApp
						},
						connections: {
							vizApi: true,
							engineApi: true
						}
					},
					qlikBaseUrl: `${protocol}${nextProps.qsServer.qsServer.hostname}${prefix}`,
					page: nextProps.pages.page
				});

				// GET request for remote image
				if (qlikLogo !== null && qlikLogo !== undefined) {
					this.setState({
						qlikLogo,
						qlikSSO: true
					});
				}
			}
		}

		//Make Qlik Sense Objects
		if (nextProps.objects) {
			if (nextProps.objects.objects) {
				const objects = nextProps.objects.objects;
				this.setState({ objects });
				this.setState({
					selectionBar: {
						type: 'QdtSelectionToolbar',
						props: {
							type: 'QdtSelectionToolbar',
							title: 'Selections',
							btnText: 'Clear Selections'
						}
					}
				});
			}
		}

		if (nextProps.groups.groups) {
			let groupOptions = [];

			for (let group of nextProps.groups.groups) {
				groupOptions.push({ key: group._id, title: group.name });
			}
			this.setState({ groupOptions });
		}

		//SET LOADING TO FALSE
		this.setState({ loading: false });
	}

	render() {
		const { errors, page, objects, loading, qssOptions } = this.state;
		return (
			<div className="o-page">
				<Header />
				<div className="container">
					{loading || page === null ? (
						<Loading />
					) : (
						<div className="row u-justify-center">
							{/*<!-- PAGE INFORMATION-->*/}
							<div className="col-md-12 col-sm-12 col-xl-12 u-mb-medium">
								<div className="u-m-auto">
									<div className="c-card u-p-zero u-m-zero">
										<div className="o-line c-card__title u-p-small u-m-small">
											<h3 className="u-color-secondary u-text-capitalize">{page.title}</h3>
											<div className="c-dropdown dropdown">
												<span
													className="c-btn c-btn--warning has-icon dropdown-toggle"
													id="MoreActionsDropdown"
													data-toggle="dropdown"
													aria-haspopup="true"
													aria-expanded="false"
												>
													More <Icon.ChevronDown size={14} />
												</span>

												<div className="c-dropdown__menu dropdown-menu has-arrow dropdown-menu-right" aria-labelledby="MoreActionsDropdown">
													<span
														onClick={e => {
															this.props.history.goBack();
														}}
														className="c-dropdown__item dropdown-item"
													>
														Back
													</span>
													<Link to={`/p/${page._id}`} className="c-dropdown__item dropdown-item">
														View In Dashboard
													</Link>
													<Link to={`/settings/pages/edit/${page._id}`} className="c-dropdown__item dropdown-item">
														Edit Page
													</Link>
													<Link to={`/settings/pages/create-object/${page._id}`} className="c-dropdown__item dropdown-item">
														{' '}
														New Object
													</Link>
												</div>
											</div>
										</div>

										{page.description ? (
											<div className="u-pl-small u-pr-small u-pb-small u-ml-small u-mr-small u-mb-small">
												<ReadMoreReact text={page.description} min={0} ideal={180} max={250} readMoreText="Continue Reading." />
											</div>
										) : (
											''
										)}

										<div className="c-tabs u-height-100">
											<div className="c-tabs__list nav nav-tabs" role="tablist">
												<a className="c-tabs__link active" id="objects-tab" data-toggle="tab" href="#objects" role="tab" aria-controls="objects" aria-selected="true">
													Page Objects
												</a>
												<a
													className="c-tabs__link"
													id="security-groups-tab"
													data-toggle="tab"
													href="#security-groups"
													role="tab"
													aria-controls="security-groups"
													aria-selected="true"
												>
													Security Groups
												</a>
											</div>

											<div className="c-tabs__content tab-content" id="nav-tabContent">
												<div className="c-tabs__pane" id="security-groups" role="tabpanel" aria-labelledby="security-groups-tab">
													<form onSubmit={this.onResourceFormSubmit}>
														{this.state.groupOptions ? (
															<div className={'row'}>
																<div className={'col-sm-9 u-m-zero'}>
																	<SelectFieldGroup
																		options={this.state.groupOptions}
																		label={'New User Groups'}
																		type={'text'}
																		onChange={this.onResourceSelect}
																		value={this.state.group}
																		name={'group'}
																	/>
																</div>
																<div className={'col-sm-3 u-m-zero'}>
																	<div className="c-field c-pt-cust-23  u-m-zero">
																		<button className="c-btn--warning u-p-xsmall c-btn--small c-btn c-btn__icon c-btn--fullwidth">ADD</button>
																	</div>
																</div>
															</div>
														) : (
															''
														)}
													</form>
													<ul className="u-m-zero list-group">
														{page.groups.map(group => (
															<li key={group._id} className="u-border-bottom u-border-top u-p-xsmall list-group-item d-flex justify-content-between align-items-center">
																{group.name}
																{!this.state.showResourceDeleteConfirmWindow || this.state.toDelete.id !== group._id ? (
																	<span className="badge-pill">
																		<button
																			className="c-btn c-btn--danger c-btn--small u-mr-small"
																			onClick={e => {
																				this.resourceDeleteConfirmWindow('pages', group._id);
																			}}
																		>
																			Delete
																		</button>
																		<NavLink exact={true} to={`/settings/groups/view/${group._id}`} className="c-btn c-btn--info c-btn--small u-ml-small">
																			Edit Group
																		</NavLink>
																		<NavLink exact={true} to={`/settings/groups/view/${group._id}`} className="c-btn c-btn--warning c-btn--small u-ml-small">
																			View Group
																		</NavLink>
																	</span>
																) : (
																	<span className="badge-pill">
																		<button
																			type={'button'}
																			className="c-btn c-btn--danger u-m-xsmall c-btn--small has-arrow u-text-center"
																			onClick={e => {
																				this.resourceDeleteConfirmed();
																			}}
																		>
																			Delete Page From Group
																		</button>
																		<button
																			type={'button'}
																			className="c-btn c-btn--secondary u-m-xsmall c-btn--small has-arrow u-text-center"
																			onClick={e => {
																				this.resourceDeleteCancelled();
																			}}
																		>
																			Cancel
																		</button>
																	</span>
																)}
															</li>
														))}
													</ul>
												</div>

												<div className="c-tabs__pane active" id="objects" role="tabpanel" aria-labelledby="objects-tab">
													{errors.noobjects ? (
														<Error error={errors.noobjects} />
													) : objects !== null ? (
														<div className="row u-p-zero">
															{objects.map((qsObject, key) => {
																if (page.template === 'custom') {
																	return (
																		<Custom
																			key={key}
																			qsObject={qsObject}
																			qssOptions={qssOptions}
																			options={this.state.qssOptions}
																			page={page}
																		/>
																	)
																} else {
																	return (
																		<div
																			key={qsObject._id}
																			className={
																				page.template === 'dashboard'
																					? 'col-md-4'
																					: page.template === 'analysis'
																					? 'col-md-6'
																					: page.template === 'report'
																					? 'col-md-12'
																					: 'col-md-12'
																			}
																		>
																			<div className="c-card" data-mh="overview-cards">
																				<h4 className={'truncate'}>{qsObject.title}</h4>
																				<div className="c-chart">
																					<div className="c-chart__body">
																						{qssOptions ? (
																							<QdtComponent
																								options={this.state.qssOptions}
																								type={qsObject.type}
																								props={{
																									type: 'chart',
																									id: qsObject.qsId,
																									height: '150px'
																								}}
																							/>
																						) : (
																							<Error error={'Object preview not available'} />
																						)}
																					</div>
																					<div className="c-chart__legends">
																						<div className="row">
																							<div className="col-12">
																								<span className="c-chart__legend">
																									<p className={'truncate'}>{qsObject.description}</p>
																								</span>

																								<span className="c-chart__legend">
																									<div className="u-text-center o-line">
																										<div>
																											<i className="c-chart__legend-icon u-bg-info" /> Height
																										</div>
																										<div>{qsObject.height}</div>
																									</div>
																								</span>

																								<span className="c-chart__legend">
																									<div className="u-text-center o-line">
																										<div>
																											<i className="c-chart__legend-icon u-bg-pink" />
																											Object Id
																										</div>
																										<div>{qsObject.qsId}</div>
																									</div>
																								</span>

																								<div className="u-text-center o-line">
																									<div>
																										<Link
																											to={`/settings/pages/delete-object/${page._id}/${qsObject._id}`}
																											className="c-btn c-btn--danger c-btn--small "
																										>
																											<Icon.Slash size={10} /> Delete
																										</Link>
																									</div>
																									<div>
																										<Link
																											to={`/settings/pages/edit-object/${page._id}/${qsObject._id}`}
																											className="c-btn c-btn--info c-btn--small "
																										>
																											<Icon.Edit3 size={10} /> Edit
																										</Link>
																									</div>
																								</div>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	);
																}
															})}
															<div
																className={
																	page.template === 'dashboard'
																		? 'col-md-4 '
																		: page.template === 'analysis'
																		? 'col-md-6'
																		: page.template === 'report'
																		? 'col-md-12'
																		: 'col-md-12'
																}
															>
																<div className="c-card u-p-zero row u-m-zero" style={{ height: '368px' }}>
																	<div className={'col-sm-12 u-m-auto u-text-center'}>
																		<Link to={`/settings/pages/create-object/${page._id}`} className="c-btn c-btn--warning ">
																			{' '}
																			New Object
																		</Link>
																	</div>
																</div>
															</div>
														</div>
													) : (
														''
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
								{/*<!-- PAGE GROUPS SIDEBAR -->*/}
							</div>
						</div>
					)}
				</div>
				<Footer />
			</div>
		);
	}
}

ViewPage.propTypes = {
	auth: PropTypes.object.isRequired,
	qlikLoginSSO: PropTypes.func.isRequired,
	getPage: PropTypes.func.isRequired,
	getObjects: PropTypes.func.isRequired,
	getQsServer: PropTypes.func.isRequired,
	getGroups: PropTypes.func.isRequired,
	updateAuthToken: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	pages: state.pages,
	objects: state.objects,
	errors: state.errors,
	loading: state.loading,
	groups: state.groups,
	qsServer: state.qsServer
});

export default connect(
	mapStateToProps,
	{
		qlikLoginSSO,
		getSecuredPages,
		getObjects,
		getPage,
		getQsServer,
		getGroups,
		logoutUser,
		updateAuthToken
	}
)(withRouter(ViewPage));
