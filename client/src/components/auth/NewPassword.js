import React, {Component} from 'react';
import {Link}             from 'react-router-dom';
import logo               from '../../img/LogoIconLight.png';
import TextFieldGroup     from '../common/TextFieldGroup';
import axios              from "axios";
import {ToastsStore}      from "react-toasts";

//TODO : USER Actions and Reducers for new-password-with-token

class NewPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email   : '',
			newPassword: '',
			confirmPassword : '',
			errors : {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

	}

	//TODO USE COMPONENT MOUNT TO CHECK ID TOKEN VALID
	componentDidMount() {}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		const passwordData = {
			email   : this.state.email,
			password : this.props.match.params.token,
			newPassword: this.state.newPassword,
			confirmPassword: this.state.confirmPassword
		};

		this.ResetUserPassword(passwordData);
	}

	ResetUserPassword(passwordData){
		axios.post('/api/users/new-password-with-token', passwordData)
		     .then(res => {
		        ToastsStore.success('Password updated successfully,  please login');
		        this.props.history.push('/login');
		     })
			.catch(err => {
				const errors = err.response.data;
				this.setState({errors});
			});
	}

	render() {
		const {errors} = this.state;

		return (
			<div className="o-page o-page--center">
				<div className="o-page__card">
					<div className="c-card c-card--center">
				          <span className="c-icon c-icon--large u-mb-small">
					          <Link to="/">
				                <img src={logo} alt="Neat"/>
					          </Link>
				          </span>

						<h4 className="u-mb-medium">Password Reset</h4>

						{errors.token ?
							<p className='u-pb-small u-text-center u-text-danger u-text-bold'>
								{errors.token}
						</p> : ''}

						<form noValidate onSubmit={this.onSubmit}>
							<TextFieldGroup label="Email Address"
							                type="email"
							                name="email"
							                error={errors.email}
							                value={this.state.email}
							                onChange={this.onChange}
							/>

							<TextFieldGroup label="New Password"
							                type="password"
							                name="newPassword"
							                error={errors.newPassword}
							                onChange={this.onChange}
							                value={this.state.newPassword}
							/>

							<TextFieldGroup label="Confirm Password"
							                type="password"
							                name="confirmPassword"
							                error={errors.confirmPassword}
							                onChange={this.onChange}
							                value={this.state.confirmPassword}
							/>

							<button
								className="c-btn c-btn--fullwidth c-btn--warning">New Password
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
};

export default NewPassword;

