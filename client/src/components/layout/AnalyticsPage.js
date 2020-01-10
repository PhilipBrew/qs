import React, {Component}          from 'react';
import {connect}                   from "react-redux";
import PropTypes                   from "prop-types";
import {withRouter, NavLink, Link} from "react-router-dom";
import {getPage, getSecuredPages}  from "../../actions/pagesActions";
import {getObjects}                from "../../actions/objectsAction";
import {getQsServer}               from "../../actions/qsServerActions";
import {logoutUser}                from "../../actions/authActions";
import logo                        from '../../img/LogoLight.png';
import * as Icon                   from "react-feather";
import classnames                  from "classnames"
import isEmpty                     from "../../validation/is-empty";
import QdtComponent                from "../common/QdtComponent";
import ReadMoreReact from 'read-more-react';
import {updateAuthToken}                from "../../actions/authActions";


class AnalyticsPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			objects     : null,
			pages       : null,
			page        : null,
			qssOptions  : null,
			showMenu    : false,
			qlikBaseUrl : null,
			qlikLogo    : null,
			qlikSSO     : false,
			selectionBar: null
		};
		this.menuBtnClick = this.menuBtnClick.bind(this);
		this.generateMenu = this.generateMenu.bind(this);
	}

	componentDidMount() {
		const page_id = this.props.match.params.id;
		this.props.getSecuredPages();
		this.props.getPage(page_id);
		this.props.getObjects(page_id);
		this.props.getQsServer();

		if (!this.props.auth.isAuthenticated) {
			this.history.push('/login');
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		const page_id = nextProps.match.params.id;

		//Make Menu Pages
		if (nextProps.pages && nextProps.qsServer) {
			if (nextProps.pages.page && nextProps.qsServer.qsServer) {
				this.generateMenu(nextProps.pages);
				this.setState({pages: nextProps.pages.pages});
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
					qssOptions : {
						config     : {
							host  : nextProps.qsServer.qsServer.hostname,
							secure: secure,
							port  : port,
							prefix: nextProps.qsServer.qsServer.prefix,
							appId : qsApp
						},
						connections: {
							vizApi   : true,
							engineApi: true
						}
					},
					qlikBaseUrl: `${protocol}${nextProps.qsServer.qsServer.hostname}${prefix}`,
				});

				this.setState({page: nextProps.pages.page});

				// GET request for remote image
				if (qlikLogo !== null && qlikLogo !== undefined) {
					this.setState({
						qlikLogo,
						qlikSSO: true
					})
				}
			}

		}

		//Make Qlik Sense Objects
		if (nextProps.objects) {
			if (nextProps.objects.objects) {
				const objects = nextProps.objects.objects;
				this.setState({objects});
				this.setState({
					selectionBar: {
						type : 'QdtSelectionToolbar',
						props: {
							type   : 'QdtSelectionToolbar',
							title  : 'Selections',
							btnText: 'Clear Selections',
						}
					}
				})
			}
		}

		if (!nextProps.auth.isAuthenticated) {
			this.props.history.push('/login');
		}

		if (nextProps.location.key !== this.props.location.key) {
			//GET PAGE CONTENT
			this.props.getPage(page_id);

			//GET OBJECTS
			this.props.getObjects(page_id);

			window.location.reload();
		}
	}

	componentWillUnmount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));

		this.setState({
			objects   : null,
			page      : null,
			qssOptions: null,
			showMenu  : false,
		})
	}

	menuBtnClick(showMenu) {
		if (showMenu) {
			this.setState({showMenu: false});
		} else {
			this.setState({showMenu: true});
		}
	}

	generateMenu(pages) {
		if (pages.pages) {
			//Go Look For Child Pages
			pages.pages.forEach((page, index) => {
				if (page.parent) {
					//Add is Child tag to the child page
					pages.pages[index].isChild = true;

					pages.pages.forEach((parentPage, parentIndex) => {
						if (parentPage._id === page.parent) {
							let childPages = parentPage.childPages ? parentPage.childPages : [];
							pages.pages[parentIndex].isParent = true;
							// push child to parent
							if (childPages.indexOf(page) === -1) {
								childPages.push(page);
							}
							pages.pages[parentIndex].childPages = childPages;
						}
					});
				}
			});

			//Remove Child Pages that are not parent pages
			pages.pages.forEach((page, index) => {
				if (page.isChild && !page.isParent) {
					pages.pages.splice(index, 1);
				}
			});
		}
	}

	render() {
		const {page, objects, pages, qssOptions, qlikLogo, qlikSSO} = this.state;
		const user = this.props.auth.user;
		const template = (page) ?
			((page.template === 'dashboard') ?
				'col-sm-4' : (page.template === 'analysis') ?
					'col-sm-6' : 'col-sm-12') : null;

		return (
			<div className={classnames('o-page', {'is-sidebar-open': this.state.showMenu})}>
				<div className={'o-page__sidebar js-page-sidebar'}>
					<aside className="c-sidebar">
						<div className="c-sidebar__brand o-line">
							<NavLink to={'/dashboard'}><img src={logo} width={100} alt="Neat"/></NavLink>
							<button className="c-sidebar-toggle u-text-right pull-right" onClick={() => this.menuBtnClick(this.state.showMenu)}>
								<Icon.Menu/>
							</button>
						</div>

						<div className="c-sidebar__body">
							<span className="c-sidebar__title">Dashboards</span>
							<ul className="c-sidebar__list">
								{(pages && pages !== null && pages !== undefined) ?
									pages.map(page =>
										(page.menu === 'yes' && page.status === 'published') ?
											(page.isParent) ?
												<li key={page._id} className="c-sidebar__item has-submenu">
													< a className="c-sidebar__link" data-toggle="collapse" href={`#${page._id}`} aria-expanded="false" aria-controls="sidebar-submenu">
														{page.title}
													</a>
													<div>
														<ul className="c-sidebar__list collapse" id={`${page._id}`}>
															<NavLink exact={true} activeClassName="is-active" className="c-sidebar__link" to={`/p/${page._id}`}>{page.title}</NavLink>
															{
																(page.childPages) ?
																	page.childPages.map(childPage =>
																		<li key={childPage._id}>
																			<NavLink exact={true} to={`/p/${childPage._id}`} className="c-sidebar__link" activeClassName="is-active">{childPage.title}</NavLink>
																		</li>
																	)
																	: null
															}
														</ul>
													</div>
												</li>
												:
												(!page.isChild) ?
													<li key={page._id}>
														<NavLink exact={true} activeClassName="is-active" className="c-sidebar__link" to={`/p/${page._id}`}>{page.title}</NavLink>
													</li>
												: null
											: null
									)
									: ''
								}
							</ul>
						</div>

						{qlikLogo !== null ?
							<span className="c-sidebar__footer" href="#">
								Powered By Qlik <img src={qlikLogo} alt={'Qlik Logo'} width={40}/>
							</span> : ''
						}
					</aside>
				</div>

				<main className="o-page__content">
					<header className="c-navbar u-mb-zero">
						<button className="c-sidebar-toggle" onClick={() => this.menuBtnClick(this.state.showMenu)}>
							<Icon.Menu/>
						</button>

						<h2 className="c-navbar__title">{page ? page.title : ''}</h2>

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
									<span className="c-dropdown__item dropdown-item" onClick={() => this.props.logoutUser()}>Logout</span>
								</div>
							</div>
						</div>
					</header>

					{page && page.description ?

						<div className="c-toolbar u-p-medium u-mb-medium">
							<ReadMoreReact
								text={page.description}
								min={0}
								ideal={180}
								max={250}
								readMoreText="Continue Reading."
							/>
						</div>
					: null}

					<div className="u-m-small u-mh-700">
						{
							((qssOptions && qssOptions !== null && qssOptions !== undefined) &&
								(objects && objects !== null && objects !== undefined) &&
								(qlikLogo && qlikLogo !== null && qlikLogo !== undefined) &&
								(qlikSSO && qlikSSO !== null && qlikSSO !== undefined)) ?
								<div className="row">
									{
										objects.map(qsObject =>
											<div key={qsObject._id} className={template}>
												<div className="c-card" data-mh="overview-cards">
													<div className="o-line">
														{qsObject.title ? <h4 className={'truncate'}>{qsObject.title}</h4> : ''}
														{qsObject.description ? <span data-toggle="modal" data-target={`#${qsObject._id}`}><Icon.Info/></span> : ''}
													</div>
													<div
														className="c-modal modal fade"
														id={qsObject._id}
														tabIndex="-1"
														role="dialog"
														aria-labelledby="modal1">
														<div className="c-modal__dialog modal-dialog" role="document">
															<div className="modal-content">
																<div className="u-text-center c-card u-p-medium u-mh-auto">
																	<h3 >{qsObject.title ? qsObject.title : ''}</h3>
																	<p className="u-text-mute u-mb-small">{qsObject.description ? qsObject.description : ''}</p>
																	<button className="c-btn c-btn--warning" data-dismiss="modal">
																		Close
																	</button>
																</div>
															</div>
														</div>
													</div>
													<div className="c-chart">
														<div className="c-chart__body">
															<QdtComponent
																options={this.state.qssOptions}
																type={qsObject.type}
																props={{
																	type  : 'chart',
																	id    : qsObject.qsId,
																	height: qsObject.height
																}}/>
														</div>
													</div>
												</div>
											</div>
										)
									}
									<div className="col-sm-12 u-pt-small u-mb-xlarge">
										<div className={'c-card u-m-auto'}>
											<QdtComponent
												options={qssOptions}
												type={this.state.selectionBar.type}
												props={this.state.selectionBar.props}/>
										</div>
									</div>

								</div> : null
						}
					</div>
				</main>
			</div>
		);
	}
};

AnalyticsPage.propTypes = {
	auth       : PropTypes.object.isRequired,
	getPage    : PropTypes.func.isRequired,
	getObjects : PropTypes.func.isRequired,
	getQsServer: PropTypes.func.isRequired,
	logoutUser : PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	auth    : state.auth,
	pages   : state.pages,
	objects : state.objects,
	qsServer: state.qsServer,
	loading : state.loading
});

export default connect(mapStateToProps, {
	getSecuredPages,
	getObjects,
	getPage,
	getQsServer,
	logoutUser,
	updateAuthToken
})(withRouter(AnalyticsPage));
