import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import {withRouter}                from "react-router-dom";
import {connect}                   from "react-redux";
import {createPage, getPages}      from "../../../actions/pagesActions";
import TextFieldGroup              from "../../common/TextFieldGroup";
import SelectFieldGroup            from "../../common/SelectFieldGroup";
import Header                      from "../../layout/Header";
import Footer                      from "../../layout/Footer";
import TextAreaFieldGroup          from "../../common/TextAreaFieldGroup";
import {getQlikApps}               from "../../../actions/qlikActions"
import {updateAuthToken}                from "../../../actions/authActions";

class CreatePage extends Component {
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
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount() {
		this.props.getPages();
		/*

		 TODO : Comment for multi applications dropdown

		 this.props.getQlikApps();

		*/

	}

	componentWillReceiveProps(nextProps) {
		//CHECK FOR ERRORS
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}
		if(nextProps.pages.pages) {
			const options = [];
			const pages = nextProps.pages.pages;

			for(let page of pages){
				options.push({key : page._id, title : page.title});
			}
			this.setState({parentPageOptions : options});
		}

		/*

		TODO : Comment for multi applications dropdown

		if(nextProps.qlik.apps){
			const qsApps = [];
			nextProps.qlik.apps.forEach(app => {
				if(app.qMeta.published) { //Only show published Applications
					qsApps.push({key: app.qDocId, title: app.qDocName})
				}
			});
			this.setState({qsApps});
		}

		*/

	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		const pageData = {
			createdBy  : this.props.auth.user.id,
			parent     : this.state.parent,
			title      : this.state.title,
			status     : this.state.status,
			description: this.state.description,
			 qsApp       : this.state.qsApp,
			menu       : this.state.menu,
			template   : this.state.template,
		};
		this.props.createPage(pageData, this.props.history);
	}

	render() {
		const {errors, qsApps} = this.state;
		const templates = [
			{key : 'dashboard' ,title : 'Dashboard'},
			{key : 'analysis' , title : 'Analysis'},
			{key : 'report' , title : 'Report'},
			{key: 'custom', title: 'Custom'}
		];

		return (
			<div className="o-page">
				<Header/>
				<div className="container">
					<div className="row">
						<div className="col-md-8 col-xl-8 u-m-auto">
							<div className="c-card is-animated">
								<div className="o-line">
									<h5 className="u-mb-xsmall u-color-secondary">Create New Page</h5>
									<button className="btn c-btn c-btn--secondary" onClick={(e) => this.props.history.goBack()}>Cancel</button>
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
												options={[{key : 'draft', title : 'Draft'},{key : 'published', title : 'Published'}]}
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
												options={[{key : 'yes' , title : 'Show'}, {key : 'no', title : 'Hide'}]}
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
												(qsApps === null || qsApps.length <= 0) ?
													<TextFieldGroup label={'Qlik Sense App'} onChange={this.onChange} value={this.state.qsApp} name={'qsApp'}/> :
													<SelectFieldGroup
														label={'Qlik Sense App'}
														type={'text'}
														onChange={this.onChange}
														value={this.state.qsApp}
														options={this.state.qsApps}
														name={'qsApp'}
														error={errors.qlik}/>
											}
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
												className="c-btn c-btn--fullwidth c-btn--warning">Create Page
											</button>
										</div>
									</div>
								</form>

							</div>
						</div>
					</div>
				</div>
				<Footer/>
			</div>
		);
	}
}

CreatePage.propTypes = {
	auth      : PropTypes.object.isRequired,
	createPage: PropTypes.func.isRequired,
	getPages : PropTypes.func.isRequired,
	errors    : PropTypes.object.isRequired,
	getQlikApps : PropTypes.func.isRequired,
	updateAuthToken : PropTypes.func.isRequired,
	qlik : PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	pages  : state.pages,
	qlik : state.qlik,
	errors: state.errors
});

export default connect(mapStateToProps, {createPage,getPages, getQlikApps, updateAuthToken})(withRouter(CreatePage));
