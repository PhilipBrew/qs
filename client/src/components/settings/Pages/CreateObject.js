import React, {Component}              from 'react';
import PropTypes                       from 'prop-types';
import {Link, withRouter}              from "react-router-dom";
import {connect}                       from "react-redux";
import {getPage, getPages}             from "../../../actions/pagesActions";
import {createObject, getObjects}      from "../../../actions/objectsAction";
import {getQsServer}                   from "../../../actions/qsServerActions";
import {getQlikSheets, getQlikObjects} from "../../../actions/qlikActions";
import Header                          from "../../layout/Header";
import Footer                          from "../../layout/Footer";
import Loading                         from "../../common/Loading";
import TextFieldGroup                  from "../../common/TextFieldGroup";
import SelectFieldGroup                from "../../common/SelectFieldGroup";
import TextAreaFieldGroup              from "../../common/TextAreaFieldGroup";
import isEmpty                         from "../../../validation/is-empty";
import {updateAuthToken}                from "../../../actions/authActions";

class CreateObject extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object      : {
				title			: '',
				qsId       		: '',
				height     		: '',
				type       		: '',
				description		: ''
			},
			errors      : {},
			manual_entry: false,
			qsApp       : null,
			sheet       : '',
			sheets      : null,
			objects     : null,
		};

		this.onChange = this.onChange.bind(this);
		this.onSelectSheet = this.onSelectSheet.bind(this);
		// this.onGetSheetsClick = this.onGetSheetsClick(this);
		this.onSubmit = this.onSubmit.bind(this);
	}


	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount() {
		this.props.getPage(this.props.match.params.id);
		this.props.getQsServer();
	}

	onGetSheetsClick(qsApp) {
		this.props.getQlikSheets(qsApp);
	}

	componentWillReceiveProps(nextProps) {
		//wait for both pages and server details to load
		if (nextProps.pages && nextProps.qsServer) {
			if (nextProps.pages.page) {
				const page = nextProps.pages.page;

				//check page has app
				const qsApp = (page.qsApp && !isEmpty(page.qsApp)) ? page.qsApp : nextProps.qsServer.qsServer.app;

				this.setState({
					parent     : page.parent,
					title      : page.title,
					status     : page.status,
					description: page.description,
					qsApp,
					menu       : page.menu,
					template   : page.template
				})
			}
		}

		//CHECK FOR ERRORS
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors})
		}

		//When Sheets have been loaded from Qlik
		if (nextProps.qlik.sheets) {
			let sheets = [];
			nextProps.qlik.sheets.forEach(sheet => {
				if (sheet.qMeta.published) {
					sheets.push({key: sheet.qInfo.qId, title: sheet.qMeta.title})
				}
			});
			this.setState({sheets})
		}

		//when objects have been loaded from sheet from qlik
		if (nextProps.qlik.objects) {
			let objects = [];
			nextProps.qlik.objects.forEach(
				object => {
					const key = object.name;
					const title = `${object.type} ${object.name}`;
					objects.push({key, title})
				}
			);
			this.setState({objects});
		}

		//check for authentication always
		if (nextProps.auth) {
			if (!nextProps.auth.isAuthenticated) {
				this.props.history.push('/login');
			}
		}
	}

	onChange(e) {
		const state = this.state;
		state.object[e.target.name] = e.target.value;
		this.setState(state);
	}

	onSelectSheet(e) {
		const qsApp = this.state.qsApp;
		const sheetId = e.target.value;
		this.setState({sheet: sheetId});
		this.props.getQlikObjects(qsApp, sheetId);
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.createObject(this.props.match.params.id, this.state.object, this.props.history);
	}

	render() {
		const {
			      errors,
			      // sheets,
			      // qsApp,
			      // objects
			      // manual_entry, sheet, objects
		      } = this.state;
		const {pages} = this.props;
		const page = pages.page;

		return (
			<div className="o-page">
				<Header/>
				<div className="container">
					<div className="row u-justify-center">
						<div className="col-md-8 col-xl-8 u-m-auto u-mb-medium">
							{
								//GET PAGE FIRST ELSE SHOW LOADING IMAGE
								pages.loading || page === null ? <Loading/> :
									//CHECK IF USER HAS SELECTED MANUAL ENTRY YET
									<div>
										<div className="c-card">
											<div className="o-line c-card__title">
												<h3 className="u-color-secondary u-text-capitalize u-pt-zero u-mt-zero u-pb-small">{page.title} |
													New Object</h3>
												<div>
													<Link to={`/settings/pages/view/${page._id}`}
													      className="u-mr-xsmall c-btn c-btn--secondary u-mb-medium">
														Back
													</Link>
												</div>
											</div>
											<hr className="u-mt-small u-mb-medium"/>
											<form noValidate onSubmit={this.onSubmit}>
												<div className="row">
													{/*
													<div className={'col-md-6'}>
														{

															sheets !== null ?
																<SelectFieldGroup
																	label={'Qlik Sense Sheet'}
																	onChange={this.onSelectSheet}
																	name={'sheet'}
																	value={this.state.sheet}
																	options={sheets}
																	error={errors.sheets}
																/>
																:
																<div className="c-field u-pt-xsmall ">
																	<div className="u-pt-xsmall ">
																		<button type={'button'} onClick={() => this.onGetSheetsClick(qsApp)} className="c-btn c-btn--warning c-btn--outline">Load
																			Qlik App Sheets
																		</button>
																	</div>
																</div>
														}
													</div> */}
													<div className="col-md-6">
														{

															// (objects === null) ?

																<TextFieldGroup
																	label="Qlik Sense Object ID"
																	type="text"
																	onChange={this.onChange}
																	value={this.state.object.qsId}
																	name='qsId'
																	error={errors.qsId}/>
																/*:
																<SelectFieldGroup
																	label={'Qlik Sense Object ID'}
																	onChange={this.onChange}
																	value={this.state.object.qsId}
																	name={'qsId'}
																	errors={errors.qsId}
																	options={objects}
																/>
																*/
														}
													</div>
													<div className="col-md-6">
														<TextFieldGroup
															label="Title"
															type="text"
															onChange={this.onChange}
															value={this.state.object.title}
															name='title'
															error={errors.title}/>
													</div>
													<div className="col-md-6">
														<SelectFieldGroup
															label="Object Type"
															type="text"
															onChange={this.onChange}
															value={this.state.object.type}
															options={[{
																key  : 'QdtViz',
																title: 'Chart Object'
															}]}
															name='type'
															error={errors.type}/>
													</div>
													<div className="col-md-6">
														<TextFieldGroup
															label="Chart Height"
															type="text"
															onChange={this.onChange}
															value={this.state.object.height}
															name='height'
															error={errors.height}/>
													</div>
													<div className="col-md-6">
														<SelectFieldGroup
															label="Column Width"
															type="text"
															onChange={this.onChange}
															value={this.state.object.width}
															options={[
																{key: '1', title: '1'},
																{key: '2', title: '2'},
																{key: '3', title: '3'},
																{key: '4', title: '4'},
																{key: '5', title: '5'},
																{key: '6', title: '6'},
																{key: '7', title: '7'},
																{key: '8', title: '8'},
																{key: '9', title: '8'},
																{key: '10', title: '10'},
																{key: '11', title: '11'},
																{key: '12', title: '12'}
															]}
															name='width'
															error={errors.type}/>
													</div>
													<div className="col-md-12">
														<TextAreaFieldGroup
															label="Chart Description"
															type="text"
															onChange={this.onChange}
															value={this.state.object.description}
															name='description'
															error={errors.description}/>
													</div>
												</div>

												<div className="o-line">
													<button type="submit" className="c-btn c-btn--warning">Create
														Object
													</button>
												</div>
											</form>
										</div>
									</div>
							}
						</div>
					</div>
				</div>
				<Footer/>
			</div>
		);
	}
}

CreateObject.propTypes = {
	auth          : PropTypes.object.isRequired,
	pages         : PropTypes.object.isRequired,
	getObjects    : PropTypes.func.isRequired,
	getPage       : PropTypes.func.isRequired,
	createObject  : PropTypes.func.isRequired,
	errors        : PropTypes.object.isRequired,
	getQlikSheets : PropTypes.func.isRequired,
	getQsServer   : PropTypes.func.isRequired,
	getQlikObjects: PropTypes.func.isRequired,
	updateAuthToken : PropTypes.func.isRequired,
	qlik          : PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth    : state.auth,
	pages   : state.pages,
	objects : state.objects,
	errors  : state.errors,
	qsServer: state.qsServer,
	qlik    : state.qlik
});

export default connect(mapStateToProps, {
	createObject,
	getPages,
	getObjects,
	getPage,
	getQlikSheets,
	getQlikObjects,
	getQsServer,
	updateAuthToken

})(withRouter(CreateObject));
