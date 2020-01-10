import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import {withRouter}       from "react-router-dom";
import logo               from '../../img/LogoIconLight.png';
import {connect}          from "react-redux";
import {Link}             from 'react-router-dom';
import {registerUser}     from "../../actions/authActions";
import TextFieldGroup     from "../common/TextFieldGroup";
import axios              from "axios";
import {ToastsStore}      from "react-toasts";

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name            : '',
			email           : '',
			qsId            : '',
			directory           : 'QMS-GO',
			password        : '',
			confirm_password: '',
			errors          : {},
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		if(this.props.auth.isAuthenticated){
			this.props.history.push('/');
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.errors){
			this.setState({errors : nextProps.errors});
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
			directory       : this.state.directory,
			email           : this.state.email,
			password        : this.state.password,
			confirm_password: this.state.confirm_password
		};

		axios.post('/api/users/register', newUser)
		.then(res => {
			ToastsStore.success('Account created successfully, please login.');
			this.props.history.push('/login');
		})
		.catch(err => {
			this.setState({errors : err.response.data});
		});
	}

	render() {
		const {errors} = this.state;

		return (
			<div className="o-page o-page--center">
				<div className="o-page__card">
					<div className="c-card c-card--center">
						<span className="c-icon c-icon--large u-mb-small">
							<Link to="/"><img src={logo} alt="cap logo" width={34}/></Link></span>
						<h4 className="u-mb-medium">Sign Up to Get Started </h4>

						<form noValidate onSubmit={this.onSubmit}>
							<TextFieldGroup label="Name" type="text" onChange={this.onChange} value={this.state.name} name="name" placeholder="e.g. Luke Skywalker" error={errors.name}/>
							<TextFieldGroup label="Email Address" type="email" onChange={this.onChange} value={this.state.email} name="email" placeholder="e.g. luke@skywalker.com" error={errors.email}/>
							<TextFieldGroup label="Qlik Sense User Id" type="text" onChange={this.onChange} value={this.state.qsId} name="qsId" placeholder="e.g. luke.skywalker" error={errors.qsId}/>
							<TextFieldGroup label="Qlik Sense User Directory" type="text" onChange={this.onChange} value={this.state.directory} name="directory" placeholder="e.g. STARWARS" error={errors.directory}/>
							<TextFieldGroup label="Password" type="password" onChange={this.onChange} value={this.state.password} name="password" placeholder="********" error={errors.password}/>
							<TextFieldGroup label="Confirm Password" type="password" onChange={this.onChange} value={this.state.confirm_password} name="confirm_password" placeholder="********" error={errors.confirm_password}/>

							{/*<button*/}
							{/*	className="c-btn c-btn--fullwidth c-btn--warning">Register*/}
							{/*</button>*/}
							<p className="u-pt-small">
								Already have an account ? <Link to="/login">Login </Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		);
	}
};

Register.propsTypes = {
	registerUser : PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors : PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth : state.auth,
	errors: state.errors
});
export default connect(mapStateToProps, {registerUser})(withRouter(Register));

