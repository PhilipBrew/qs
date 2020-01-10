import React, {Component}          from 'react';
import {connect}                   from "react-redux";
import PropTypes                   from 'prop-types';
import {NavLink}                   from "react-router-dom";
import {getSecuredPages} from "../../actions/pagesActions";
import {getQsServer}               from "../../actions/qsServerActions";
import {qlikLoginSSO}              from "../../actions/authActions";
import logo                        from '../../img/LogoLight.png';
import isEmpty                     from "../../validation/is-empty";

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			qssOptions: {},
			qlikBaseUrl : null
		};
		this.generateMenu = this.generateMenu.bind(this);
	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.qlikLoginSSO(this.props.auth);
			// this.qlikJWT()
		}
		this.props.getSecuredPages();
		this.props.getQsServer();
	}

	generateMenu(pages){
		if(pages.pages) {
			//Go Look For Child Pages
			pages.pages.forEach((page,index) => {
				if(page.parent) {
					//Add is Child tag to the child page
					pages.pages[index].isChild = true;

					pages.pages.forEach((parentPage, parentIndex) => {
						if (parentPage._id === page.parent){
							let childPages = parentPage.childPages ? parentPage.childPages : [];
							pages.pages[parentIndex].isParent = true;
							// push child to parent
							if(childPages.indexOf(page) === -1) {
								childPages.push(page);
							}
							pages.pages[parentIndex].childPages = childPages;
						}
					});
				}
			});

			//Remove Child Pages that are not parent pages
			pages.pages.forEach((page, index) => {
				if(page.isChild && !page.isParent){
					pages.pages.splice(index, 1);
				}
			})
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if(nextProps.qsServer.qsServer){
			const qsServer = nextProps.qsServer.qsServer;
			const secure = qsServer.secure === 'YES' ? true : false;
			const port = qsServer.port !== null ? parseInt(qsServer.port) : 80;
			const prefix = isEmpty(qsServer.prefix) ? '/' : `/${qsServer.prefix}/`;
			this.setState(
				{
					qssOptions: {
						config: {
							host  : qsServer.hostname,
							secure: secure,
							port  : port,
							prefix: qsServer.prefix,
							appId : qsServer.app
						}
					},
					qlikBaseUrl : `https://${qsServer.hostname}${prefix}`,
					servername: qsServer.name
				});
		}

		if(nextProps.pages){
			this.generateMenu(nextProps.pages);
		}
	}

	render(){
		const {pages} = this.props;
		const pageList = pages.pages;
		const qTicket = localStorage.getItem('qTicket');
		let qlikLogo = null;
		if(this.state.qlikBaseUrl !== null){
			qlikLogo = `${this.state.qlikBaseUrl}resources/hub/img/core/logo/logo-76x76.png?qlikTicket=${qTicket}`;
		}
		return (
			<aside className="c-sidebar">
				<div className="c-sidebar__brand">
					<NavLink to={'#'}><img width={150} src={logo} alt="Neat"/></NavLink>
				</div>

				<div className="c-sidebar__body">
					<span className="c-sidebar__title">Dashboards</span>
					<ul className="c-sidebar__list">
						<NavLink  exact={true} activeClassName="is-active" className="c-sidebar__link" to={`/dashboard`}>Home</NavLink>
						{
							pages !== null ?
								pageList !== null ?
									pageList.map(
										page =>
											(page.menu === 'yes' && page.status === 'published') ?
												(page.isParent) ?
													<li key={page._id} className="c-sidebar__item has-submenu" >
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
																				<NavLink exact={true} to={`/p/${childPage._id}`} className="c-sidebar__link" activeClassName="is-active">{childPage.title}</NavLink></li>
																		)
																	: null
																}
															</ul>
														</div>

													</li>

													:
												<li key={page._id}>
										             <NavLink exact={true} activeClassName="is-active" className="c-sidebar__link" to={`/p/${page._id}`}>{page.title}</NavLink>
									             </li>
							: ''
		                            ) :
								null :
							null
						}
					</ul>
				</div>

				{qlikLogo !== null ?
					<span className="c-sidebar__footer" href="#">
							Powered By Qlik <img src={qlikLogo} alt={'Qlik Logo'} width={40}/>
					</span> : ''
				}
		</aside>
		)
	}
};

Sidebar.propTypes = {
	auth    : PropTypes.object.isRequired,
	getSecuredPages : PropTypes.func.isRequired,
	getQsServer : PropTypes.func.isRequired,
	qsServer: PropTypes.object.isRequired,
	qlikLoginSSO : PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
	pages : state.pages,
	auth : state.auth,
	qsServer : state.qsServer
});
export default connect(mapStateToProps, {qlikLoginSSO, getQsServer, getSecuredPages})(Sidebar);
