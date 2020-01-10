import React, {Component}            from 'react';
import PropTypes                     from 'prop-types';
import {Link, withRouter}            from "react-router-dom";
import {connect}                     from "react-redux";
import {editPage, getPage, getPages, deletePage} from "../../../actions/pagesActions";
import TextFieldGroup                from "../../common/TextFieldGroup";
import SelectFieldGroup              from "../../common/SelectFieldGroup";
import Header                        from "../../layout/Header";
import Footer                        from "../../layout/Footer";
import Loading                       from "../../common/Loading";
import TextAreaFieldGroup            from "../../common/TextAreaFieldGroup";
import {updateAuthToken}                from "../../../actions/authActions";

class DeletePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createdBy        : this.props.auth.user.id,
			parent           : '',
			title            : '',
			status           : '',
			description      : '',
			qsApp            : '',
			parentPageOptions: [],
			menu             : '',
			template         : '',
			errors           : {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		//CHECK FOR ERRORS
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}
		if (nextProps.pages.pages) {
			const options = [];
			const pages = nextProps.pages.pages;

			for (let page of pages) {
				options.push({key: page._id, title: page.title});
			}
			this.setState({parentPageOptions: options});
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
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount()
	{
		this.props.getPage(this.props.match.params.pid);
		this.props.getPages();
	}

	onChange(e)
	{
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.deletePage(this.props.match.params.pid, this.props.history);
	}

	render()
	{
		const {errors} = this.state;
		const templates = [
			{key: 'dashboard', title: 'Dashboard'},
			{key: 'analysis', title: 'Analysis'},
			{key: 'report', title: 'Report'},
			{key: 'custom', title: 'Custom'}
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
										<h3 className="u-color-secondary u-text-capitalize u-pt-zero u-mt-zero u-pb-small">Delete
											| <small>{this.state.title}</small>
										</h3>
										<div>
											<Link to={`/settings/pages/`}
											      className="u-mr-xsmall c-btn c-btn--secondary u-mb-medium">
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
													disabled={true}
													error={errors.title}/>
											</div>
											<div className="col-md-6">
												<SelectFieldGroup
													label="Status"
													type="text"
													onChange={this.onChange}
													value={this.state.status}
													options={[{
														key  : 'draft',
														title: 'Draft'
													}, {
														key  : 'published',
														title: 'Published'
													}]}
													name='status'
													disabled={true}
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
													disabled={true}
													error={errors.parent}
												/>
											</div>


											<div className="col-md-6">
												<SelectFieldGroup
													label="Menu Visibility"
													type="text"
													onChange={this.onChange}
													options={[{
														key  : 'yes',
														title: 'Show'
													}, {
														key  : 'no',
														title: 'Hide'
													}]}
													value={this.state.menu}
													name='menu'
													disabled={true}
													error={errors.menu}/>
											</div>
											<div className="col-md-6">
												<SelectFieldGroup
													label="Template"
													type="text"
													onChange={this.onChange}
													value={this.state.template}
													options={templates}
													disabled={true}
													name='template'
													error={errors.template}/>
											</div>


											<div className="col-md-12">
												<TextAreaFieldGroup
													label="Description"
													type="text"
													onChange={this.onChange}
													value={this.state.description}
													name='description'
													disabled={true}
													error={errors.description}/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-6">
												<div className="o-line">
													<button type="submit" className="c-btn c-btn--danger">Delete Page</button>
												</div>
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

DeletePage.propTypes = {
	auth    : PropTypes.object.isRequired,
	pages   : PropTypes.object.isRequired,
	editPage: PropTypes.func.isRequired,
	getPage : PropTypes.func.isRequired,
	errors  : PropTypes.object.isRequired,
	updateAuthToken : PropTypes.func.isRequired,
	deletePage : PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	pages : state.pages,
	errors: state.errors
});

export default connect(mapStateToProps, {
	editPage,
	getPages,
	deletePage,
	getPage,
	updateAuthToken
})(withRouter(DeletePage));
