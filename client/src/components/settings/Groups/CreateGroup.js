import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import {withRouter}       from "react-router-dom";
import {connect}          from "react-redux";
import {createGroup}      from "../../../actions/groupsActions";
import {updateAuthToken}  from "../../../actions/authActions";
import TextFieldGroup     from "../../common/TextFieldGroup";
import Header             from "../../layout/Header";
import Footer             from "../../layout/Footer";
import * as Icon          from 'react-feather';
import TextAreaFieldGroup from "../../common/TextAreaFieldGroup";

class CreateGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			owner  : this.props.auth.user.id,
			name     : '',
			description: '',
			errors     : {}
		}

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentWillReceiveProps(nextProps) {
		//CHECK FOR ERRORS
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		const groupData = {
			createdBy  : this.props.auth.user.id,
			name     : this.state.name,
			description: this.state.description,
		};
		this.props.createGroup(groupData, this.props.history);
	}

	render() {
		const {errors} = this.state;
		return (
			<div className="o-group">
				<Header/>
				<div className="container">

					<div className="row">
						<div className="col-md-8 col-xl-8 u-m-auto">
							<div className="c-card is-animated">
								<div className="o-line">
									<span className="c-icon c-icon--large u-mb-small">
										<Icon.ShieldOff color="#f19012"/>
									</span>
									<h5 className="u-mb-xsmall">Create New Group</h5>
								</div>

								<hr className="u-mt-small u-mb-medium"/>
								<form noValidate onSubmit={this.onSubmit}>

									<div className="row">
										<div className="col-md-6">
											<TextFieldGroup
												label="Group Name"
												type="text"
												onChange={this.onChange}
												value={this.state.name}
												name='name'
												error={errors.name}/>
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
										<div className="col-md-6 u-mt-xsmall">
											<button type={'submit'} className="c-btn c-btn--fullwidth c-btn--warning">Create Group</button>
										</div>

										<div className="col-md-6 u-mt-xsmall">
											<button type={'button'} onClick={(e) => {this.props.history.goBack()}} className="c-btn c-btn--fullwidth c-btn--secondary">Cancel</button>
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

CreateGroup.propTypes = {
	auth      : PropTypes.object.isRequired,
	createGroup: PropTypes.func.isRequired,
	updateAuthToken : PropTypes.func.isRequired,
	errors    : PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, {createGroup, updateAuthToken})(withRouter(CreateGroup));
