import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import {withRouter}       from "react-router-dom";
import {connect}          from "react-redux";
import {createUser}       from "../../../actions/authActions";
import TextFieldGroup     from "../../common/TextFieldGroup";
import Header             from "../../layout/Header";
import SelectFieldGroup   from "../../common/SelectFieldGroup";
import {updateAuthToken}                from "../../../actions/authActions";

class CreateUser extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name            : '',
			email           : '' ,
			role            : 'User',
			qsId            : '',
			directory        : 'QMS-GO',
			password        : '',
			confirm_password: '',
			errors          : {},
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this)
	}
	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
		this.setState({errors : {}})
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.errors){
			this.setState({errors : nextProps.errors.errors});
		}
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		const newUser = {
			name            : this.state.name,
			qsId            : this.state.qsId,
			role            : this.state.role,
			directory       : this.state.directory,
			email           : this.state.email,
			password        : this.state.password,
			confirm_password: this.state.confirm_password
		};

		this.props.createUser(newUser, this.props.history);
	}

	render() {
		const {errors} = this.props;
		return (
			<div className="o-page">
				<Header/>
				<div className="container">
					<div className="row">
						<div className="col-md-8 u-m-auto">
							<div className="c-card is-animated">
								<div className="o-line">
									<h5 className="u-mb-xsmall">Create New User</h5>
									<button className="c-btn c-btn--secondary" onClick={(e) => {this.props.history.goBack()}}>Cancel</button>
								</div>

								<hr className="u-mt-small u-mb-medium"/>

								<form noValidate onSubmit={this.onSubmit} autoComplete={'none'}>
									<div className="row">
										<div className="col-md-6">
											<TextFieldGroup label="Name" type="text" onChange={this.onChange} value={this.state.name} name="name" placeholder="e.g. Luke Skywalker" error={errors.name}/>
										</div>
										<div className="col-md-6">
											<TextFieldGroup
												label="Email Address"
												type="email"
												onChange={this.onChange}
												value={this.state.email}
												name="email"
												placeholder="e.g. luke@skywalker.com"
												error={errors.email}/>
										</div>
										<div className="col-md-6">
											<SelectFieldGroup
												label={'User Role'}
												type={'text'}
												onChange={this.onChange}
												value={this.state.role}
												options={[{key : 'Admin', title : 'Admin'}, {key : 'User' , title  : 'User'}]}
												name={'role'}/>
										</div>
										<div className="col-md-6">
											<TextFieldGroup label="Qlik Sense User Id" type="text" onChange={this.onChange} value={this.state.qsId} name="qsId" placeholder="e.g. luke.skywalker" error={errors.qsId}/>
										</div>
										<div className="col-md-6">
											<TextFieldGroup
												label="Qlik Sense User Directory"
												info="(QMS-GO) will be the default user directory if unchanged."
												type="text" onChange={this.onChange}
												value={this.state.directory} name="directory" placeholder="e.g. STARWARS" error={errors.directory}/>
										</div>
										<div className="col-md-6">
											<TextFieldGroup label="Password" type="password" onChange={this.onChange} value={this.state.password} name="password" placeholder="********" error={errors.password}/>
										</div>
										<div className="col-md-6">
											<TextFieldGroup label="Confirm Password" type="password" onChange={this.onChange} value={this.state.confirm_password} name="confirm_password" placeholder="********" error={errors.confirm_password}/>
										</div>
									</div>

									<button
										className="c-btn c-btn--warning">Create User
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

CreateUser.propsTypes = {
	createUser : PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors : PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth : state.auth,
	errors: state.errors,
	groups : state.groups
});
export default connect(mapStateToProps, {createUser, updateAuthToken})(withRouter(CreateUser));

