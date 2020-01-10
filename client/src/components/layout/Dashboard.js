import React, {Component}          from 'react';
import PropTypes                   from 'prop-types';
import {Link, withRouter}          from "react-router-dom";
import {connect}                   from "react-redux";
import {getSecuredPages} from "../../actions/pagesActions";
import {getQsServer}               from "../../actions/qsServerActions";
import Loading                     from "../common/Loading";
import * as Icon                   from "react-feather";
import Header                      from "./Header";
import {qlikLoginSSO}              from "../../actions/authActions";
import Footer                      from "./Footer";
import ReadMoreReact               from "read-more-react";
import {updateAuthToken}                from "../../actions/authActions";

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			objects   : null,
			errors    : {},
			loading   : true,
			pages : null,
		};
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));

		if(!this.props.auth.isAuthenticated) {
			this.props.history.push('/login')
		}else{
			this.props.getQsServer();
			const user = this.props.auth;
			this.props.qlikLoginSSO(user);
		}
		this.props.getSecuredPages();
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.pages){
			this.setState({loading : nextProps.pages.loading, pages : nextProps.pages.pages});
		}

		//Authentication Expired
		if(nextProps.auth){
			if(!nextProps.auth.isAuthenticated){
				this.props.history.push('/login');
			}
		}

	}

	render() {
		const {pages, loading} = this.state;
		const user = this.props.auth.user;

		return (
			<div className="o-page">
				<Header />

				<main className="container">
					<div>
						{pages === undefined || pages === null || loading ? <Loading/> :
							<div className="container">
								<div className="row u-justify-center">
									<div className="col-lg-8 u-text-center">
										<h4 className="u-text-secondary u-mb-small">Hello {user.name}, Welcome
											to your
											dashboard </h4>
										<p className="u-text-large u-mb-large">Click any of the tiles below to
											start
											exploring related data.
										</p>
									</div>
								</div>

								<div>
									<div className="row">
										{pages.map(page =>
											page.status ==='published' ?
												<div className="col-md-6 u-text-center u-m-auto"
												     key={page._id}>
													<div className="c-card is-animated u-page-thumbnail">
										<span className="c-icon c-icon--large u-mb-small">
											{
												page.template === 'dashboard' ?
													<Icon.Monitor color="#f19012"/> :
													page.template === 'analysis' ?
														<Icon.Activity color="#f19012"/> :
														page.template === 'report' ?
															<Icon.Paperclip color="#f19012"/> :
															<Icon.BarChart2 color="#f19012"/>

											}

										</span>

														<h5 className="u-mb-xsmall">{page.title}</h5>
														<div className="u-mb-medium">
															{page && page.description ?
																<ReadMoreReact
																	text={page.description}
																	min={0}
																	ideal={150}
																	max={250}
																	readMoreText="Continue Reading."
																/>  : null}
														</div>
														<Link
															className="c-btn c-btn--warning has-arrow"
															to={`/p/${page._id}`}> Goto Page
														</Link>
													</div>
												</div>
												:
												page.createdBy === user.id ?
													<div className="col-md-6 u-text-center u-m-auto"
												     key={page._id}>
														<div className="c-card is-animated u-page-thumbnail">
															<div className="c-alert c-alert--warning u-m-zero is-animated ">
																<div className="o-line">
																	<span className="c-alert__icon"><Icon.Edit3 size={16}/></span> <span className=" c-badge c-badge--warning">Draft </span>
																</div>
																<div className="c-alert__content">
																	<h4 className="c-alert__title">{page.title}</h4>

																	<div className="u-mb-medium">
																		{page && page.description ?
																			<ReadMoreReact
																				text={page.description}
																				min={0}
																				ideal={150}
																				max={250}
																				readMoreText="Continue Reading."
																			/>  : null}
																	</div>

																	<Link
																		className="c-btn c-btn--warning has-arrow"
																		to={`/p/${page._id}`}> Goto Page
																	</Link>
																</div>
															</div>
														</div>
													</div>
												: ''

										)}
									</div>
								</div>
							</div>
						}
					</div>
					<Footer/>
				</main>
			</div>
		);
	}
}

Dashboard.propTypes = {
	auth    : PropTypes.object.isRequired,
	getSecuredPages: PropTypes.func.isRequired,
	// getPages: PropTypes.func.isRequired,
	qlikLoginSSO : PropTypes.func.isRequired,

};

const mapStateToProps = (state) => ({
	auth : state.auth,
	pages: state.pages,
	page : state.page,
	qsServer: state.qsServer,

});

export default connect(mapStateToProps, {getSecuredPages,qlikLoginSSO,getQsServer, updateAuthToken})(withRouter(Dashboard));
