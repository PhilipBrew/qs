import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import {Link, withRouter} from "react-router-dom";
import {connect}          from "react-redux";
import Header             from "../../layout/Header";
import Footer             from "../../layout/Footer";
import Loading            from "../../common/Loading";
import TextFieldGroup     from "../../common/TextFieldGroup";
import SelectFieldGroup   from "../../common/SelectFieldGroup";
import axios              from "axios";
import {ToastsStore}      from "react-toasts";
import TextAreaFieldGroup from "../../common/TextAreaFieldGroup";
import {updateAuthToken}                from "../../../actions/authActions";

class EditObject extends Component {
	constructor(props) {
		super(props);
		this.state = {
			object : null,
			page : null,
			errors: {},
			loading : true
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.getObject = this.getObject.bind(this);
		this.getPage = this.getPage.bind(this);
		this.editObject = this.editObject.bind(this);
	}

	getPage (page_id) {
		axios.get(`/api/pages/${page_id}`)
		     .then(res => {
			     this.setState({page : res.data});
		     }).catch(err => {
			this.setState({errors : err.response.data});
		});
	}

	getObject(page_id, object_id){
		axios.get(`/api/pages/objects/${page_id}/${object_id}`)
		     .then(res => {
			     this.setState({object : res.data});
		     }).catch(err => {
			this.setState({errors : err.response.data});
		});
	}

	editObject(){
		const objectData = {
			title : this.state.object.title,
			qsId : this.state.object.qsId,
			height : this.state.object.height,
			type : this.state.object.type,
			width: this.state.object.width,
			description : this.state.object.description
		};
		const page_id = this.state.page._id;
		const object_id = this.state.object._id;

		axios.post(`/api/pages/objects/${page_id}/${object_id}`, objectData)
		     .then(res => {
			     ToastsStore.success(`Object updated successfully`);
			     this.props.history.push(`/settings/pages/view/${page_id}`);
		     }).catch(err => {
				this.setState({errors : err.response.data})
		})
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount() {

		const page_id = this.props.match.params.pid;
		const object_id = this.props.match.params.oid;
		//GET PAGE CONTENT
		this.getPage(page_id);

		//GET OBJECTS
		this.getObject(page_id, object_id);

		//SET LOADING TO FALSE
		this.setState({loading : false});
	}

	componentWillReceiveProps(nextProps, nextContext) {
		this.setState({
			              objects: null,
			              page   : null,
			              errors : {},
			              loading: true
		              });
		const page_id = nextProps.match.params.pid;
		const object_id = nextProps.match.params.oid;
		//GET PAGE CONTENT
		this.getPage(page_id);

		//GET OBJECTS
		this.getObject(page_id, object_id);

		//SET LOADING TO FALSE
		this.setState({loading : false});
	}

	onChange(e) {
		const state = this.state;
		state.object[e.target.name] = e.target.value;
		this.setState(state);
	}

	onSubmit(e) {
		e.preventDefault();
		this.editObject();
	}

	render() {
		const {errors, page, loading, object} = this.state;
		return (
			<div className="o-page">
				<Header/>
				<div className="container">

					<div className="row u-justify-center">
						<div className="col-md-8 col-xl-8 u-m-auto u-mb-medium">
							{loading || page === null || object === null ? <Loading/> :
								<div>
									<div className="c-card">
										<div className="o-line c-card__title">
											<h3 className="u-color-secondary u-text-capitalize u-pt-zero u-mt-zero u-pb-small">{page.title} | <small>Edit Object </small></h3>
											<div>
												<Link to={`/settings/pages/view/${page._id}`}
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
														value={this.state.object.title}
														name='title'
														disabled={false}
														error={errors.title}/>
												</div>
												<div className="col-md-6">
													<TextFieldGroup
														label="Qlik Sense Object ID"
														type="text"
														onChange={this.onChange}
														value={this.state.object.qsId}
														name='qsId'
														disabled={false}
														error={errors.qsId}/>
												</div>
												<div className="col-md-6">
													<SelectFieldGroup
														label="Object Type"
														type="text"
														onChange={this.onChange}
														value={this.state.object.type}
														options={[{key : 'QdtViz' , title : 'Chart Object'}]}
														name='type'
														disabled={false}
														error={errors.type}/>
												</div>
												<div className="col-md-6">
													<TextFieldGroup
														label="Chart Height"
														type="text"
														onChange={this.onChange}
														value={this.state.object.height}
														name='height'
														disabled={false}
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
												<div className={'col-sm-12'}>
													<TextAreaFieldGroup
														label={'Object Description'}
														type={'text'}
														onChange={this.onChange}
														value={this.state.object.description}
														name={'description'}
														disabled={false}
														error={errors.description}
													/>
												</div>
											</div>

											<div className="o-line">
												<button type="submit" className="c-btn c-btn--warning">Update Object</button>
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

EditObject.propTypes = {
	auth        : PropTypes.object.isRequired,
	errors : PropTypes.object.isRequired,
	updateAuthToken : PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth   : state.auth,
	errors : state.errors
});

export default connect(mapStateToProps, {updateAuthToken})(withRouter(EditObject));
