import React, {Component}            from 'react';
import PropTypes                     from 'prop-types';
import {Link, withRouter}            from "react-router-dom";
import {connect}                     from "react-redux";
import {editPage, getPage, getPages} from "../../../actions/pagesActions";
import {getQlikApps}                 from "../../../actions/qlikActions";
import TextFieldGroup                from "../../common/TextFieldGroup";
import SelectFieldGroup              from "../../common/SelectFieldGroup";
import Header                        from "../../layout/Header";
import Footer                        from "../../layout/Footer";
import Loading                       from "../../common/Loading";
import TextAreaFieldGroup            from "../../common/TextAreaFieldGroup";
import {updateAuthToken}                from "../../../actions/authActions";


class EditPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			parentPageOptions: [],
			createdBy        : this.props.auth.user.id,
			parent           : '',
			title            : '',
			status           : '',
			description      : '',
			qsApp            : '',
			menu             : '',
			template         : '',
			errors           : {},
			qsApps           : null
		};

		this.onChange = this.onChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		//CHECK FOR ERRORS
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}

		if (nextProps.pages.page) {
			const page = nextProps.pages.page;

			this.setState({
				parent     : page.parent,
				title      : page.title,
				status     : page.status,
				description: page.description,
				qsApp      : page.qsApp,
				menu       : page.menu,
				template   : page.template,

			})
		}
		if (nextProps.pages.pages) {
			const options = [{key : '', title : 'No Parent'}];
			const pages = nextProps.pages.pages;

			for (let page of pages) {
				options.push({key: page._id, title: page.title});
			}
			this.setState({parentPageOptions: options});
		}
		if (nextProps.qlik.apps) {
			const qsApps = [];
			nextProps.qlik.apps.forEach(app => {
				if (app.qMeta.published) { //Only show published Applications
					qsApps.push({key: app.qDocId, title: app.qDocName})
				}
			});
			this.setState({qsApps});
		}
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount() {
		this.props.getPage(this.props.match.params.id);
		this.props.getPages();
		// this.props.getQlikApps();
		if (!this.props.auth.isAuthenticated) {
			this.props.history.push('/login');
		}

	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit = e => {
		e.preventDefault();
		const pageData = {
			createdBy  : this.props.auth.user.id,
			parent     : this.state.parent,
			title      : this.state.title,
			status     : this.state.status,
			description: this.state.description,
			qsApp      : this.state.qsApp,
			menu       : this.state.menu,
			template   : this.state.template,
		};

		this.props.editPage(this.props.match.params.id, pageData, this.props.history);
	}

	render() {
		const {
			      errors,
			      // qsApps
		      } = this.state;
		const templates = [
			{key: 'dashboard', title: 'Dashboard'},
			{key: 'analysis', title: 'Analysis'},
			{key: 'report', title: 'Report'},
			{key: 'custom', title:'Custom'}
		];
		const {pages} = this.props;

		return (
			<div className="o-page">
				<Header/>
				<div className="container">
					{pages.loading || pages.page === null ? <Loading/> :
						<div className="row">
							<div className="col-md-9 col-xl-9 u-m-auto">
								<div className="c-card is-animated">
									<div className="o-line c-card__title">
										<h3 className="u-color-secondary u-text-capitalize u-pt-zero u-mt-zero u-pb-small">Edit
											| <small>{this.state.title}</small></h3>
										<div>
											<Link to={`/settings/pages/`} className="u-mr-xsmall c-btn c-btn--secondary u-mb-medium">
												Cancel
											</Link>
										</div>
									</div>

									<hr className="u-mt-small u-mb-medium"/>
									<form noValidate onSubmit={this.onSubmit}>
										<div className="row">
											<div className="col-md-6">
												<TextFieldGroup
													label="Title"
													type="text"
													onChange={this.onChange}
													value={this.state.title}
													name='title'
													error={errors.title}/>
											</div>
											<div className="col-md-6">
												<SelectFieldGroup
													label="Status"
													type="text"
													onChange={this.onChange}
													value={this.state.status}
													options={[{key: 'draft', title: 'Draft'}, {
														key  : 'published',
														title: 'Published'
													}]}
													name='status'
													error={errors.status}/>
											</div>
											<div className="col-md-6">
												<SelectFieldGroup
													label="Parent"
													type="text"
													onChange={this.onChange}
													value={this.state.parent}
													options={this.state.parentPageOptions}
													name='parent'
													error={errors.parent}
												/>
											</div>
											<div className="col-md-6">
												<SelectFieldGroup
													label="Menu Visibility"
													type="text"
													onChange={this.onChange}
													options={[{key: 'yes', title: 'Show'}, {key: 'no', title: 'Hide'}]}
													value={this.state.menu}
													name='menu'
													error={errors.menu}/>
											</div>
											<div className="col-md-6">
												<SelectFieldGroup
													label="Template"
													type="text"
													onChange={this.onChange}
													value={this.state.template}
													options={templates}
													name='template'
													error={errors.template}/>
											</div>
											<div className="col-md-6">
												{
													// (qsApps === null || qsApps.length <= 0) ?
													<TextFieldGroup
														label={'Qlik Sense App'}
														onChange={this.onChange}
														value={this.state.qsApp}
														name={'qsApp'}/>
													/*
													 :

													 <SelectFieldGroup
													 label={'Qlik Sense App'}
													 type={'text'}
													 onChange={this.onChange}
													 value={this.state.qsApp}
													 options={this.state.qsApps}
													 name={'qsApp'}
													 error={errors.qlik}/>
													 */}

											</div>
											<div className="col-md-12">
												<TextAreaFieldGroup
													label="Description"
													type="text"
													onChange={this.onChange}
													value={this.state.description}
													name='description'
													error={errors.description}/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-6">
												<button
													className="c-btn c-btn--fullwidth c-btn--warning">Update Page
												</button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					}

				</div>
				<Footer/>
			</div>
		);
	}
}

EditPage.propTypes = {
	auth       : PropTypes.object.isRequired,
	pages      : PropTypes.object.isRequired,
	editPage   : PropTypes.func.isRequired,
	getPage    : PropTypes.func.isRequired,
	getPages   : PropTypes.func.isRequired,
	errors     : PropTypes.object.isRequired,
	getQlikApps: PropTypes.func.isRequired,
	qlik       : PropTypes.object.isRequired,
	updateAuthToken : PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	pages : state.pages,
	errors: state.errors,
	qlik  : state.qlik,
});

const mapDispatchToProps = {
	editPage,
	getPages,
	getQlikApps,
	getPage, 
	updateAuthToken
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditPage));
