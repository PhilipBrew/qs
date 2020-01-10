import React, {Component} from 'react';
import {connect}          from "react-redux";
import PropTypes          from 'prop-types';
import {Link}             from "react-router-dom";
import Loader             from "react-loader-spinner";
import {getPages}         from "../../../actions/pagesActions";
import {qlikLoginSSO}     from "../../../actions/authActions";
import Header             from "../../layout/Header";
import Footer             from "../../layout/Footer";
import Error              from "../../common/Error";
import * as Icon          from 'react-feather';
import {updateAuthToken}                from "../../../actions/authActions";

class Pages extends Component {
	constructor(prop){
		super(prop);

		this.state = {
			errors : {},
			pages : {},
		}
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors})
		}
		if (nextProps.pages) {
			this.setState({pages: nextProps.pages});
		}
		if (nextProps.location.key !== this.props.location.key) {
			this.props.getPages();
			console.log('New Key RP');
		}
	}

	componentWillUpdate(nextProps, nextState, nextContext) {
		if (nextProps.location.key !== this.props.location.key) {
			this.props.getPages();
		}
	}

	componentWillMount(){
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));

		this.props.getPages();

		if(this.props.auth.isAuthenticated) {
			this.props.qlikLoginSSO(this.props.auth)
		}else{
			this.props.history.push('/login');
		}
	}

	componentDidMount() {
		this.props.getPages();
	}

	render() {
		const {pages} = this.state;
		const loading = pages.loading;
		const pageList = pages.pages;

		return (
			<div className="o-page">
				<Header/>
				<div className="container">
					{
						(loading) ?
						<div className="u-text-center u-m-auto">
							<Loader
								type="Triangle"
								color="#f19012"
								height="250"
								width="250"
							/>
						</div> :
								((!pageList) || (pageList.length === 0 )) ?
										<div className="row u-justify-center">
											<div className="col-md-8 col-xl-8 u-m-auto u-mb-medium">
												<Error error='No pages found' link={{url : "/settings/pages/create", title : 'New Page'}}/>
											</div>
										</div>
								:
										<div className="c-card u-p-zero">
										<div className=" o-line u-p-medium">
											<h4 className="c-card__title u-color-secondary">Site Pages</h4>
											<Link to={'/settings/pages/create'}
											      className="c-btn c-btn--warning">Create Page
											</Link>
										</div>
										<div className={'c-table-responsive@wide'}>
											<table className="c-table">
												<thead className="c-table__head">
													<tr className="c-table__row">
														<th className="c-table__cell c-table__cell--head">Title</th>
														<th className="c-table__cell c-table__cell--head">Status</th>
														<th className="c-table__cell c-table__cell--head">Menu Visible</th>
														<th className="c-table__cell c-table__cell--head">Template</th>
														<th className="c-table__cell c-table__cell--head">Action</th>
													</tr>
												</thead>
												<tbody>
													{pageList.map(page =>
														<tr className="c-table__row u-text-capitalize" key={page._id}>
															<td className="c-table__cell">{page.title}</td>
															<td className="c-table__cell">{page.status}</td>
															<td className="c-table__cell">{page.menu}</td>
															<td className="c-table__cell">{page.template}</td>
															<td className="c-table__cell" width="90">
																<Link to={`/settings/pages/view/${page._id}`} className="c-btn c-btn--warning u-m-xsmall c-btn--small has-arrow u-text-center">
																	<Icon.Eye size={14}/>
																</Link>
																<Link to={`/settings/pages/edit/${page._id}`} className="c-btn c-btn--info u-m-xsmall c-btn--small has-arrow u-text-center"><Icon.Edit3 size={14}/></Link>
																<Link to={`/settings/pages/delete/${page._id}`} className="c-btn c-btn--danger u-m-xsmall c-btn--small has-arrow u-text-center"><Icon.Slash size={14}/></Link>
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
									</div>
					}
				</div>
				<Footer/>
			</div>
		);
	}
}

Pages.propTypes = {
	auth    : PropTypes.object.isRequired,
	getPages: PropTypes.func.isRequired,
	errors  : PropTypes.object.isRequired,
	qlikLoginSSO : PropTypes.func.isRequired,
	updateAuthToken : PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
	auth  : state.auth,
	pages : state.pages,
	errors: state.errors
})
export default connect(mapStateToProps, {getPages, qlikLoginSSO, updateAuthToken})(Pages);
