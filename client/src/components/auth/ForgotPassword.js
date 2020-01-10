import React, {Component} from 'react';
import {Link}             from "react-router-dom";
import logo               from "../../img/LogoIconLight.png";
import {connect}          from "react-redux";
import {forgotPassword}        from '../../actions/authActions';
import TextFieldGroup     from "../common/TextFieldGroup";
import PropTypes          from "prop-types";

class ForgotPassword extends Component{
	constructor(props) {
		super(props);
		this.state = {
			errors: {},
			success : false,
			email : '',
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		const userData = {
			email   : this.state.email,
			baseUrl : `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
		};

		this.props.forgotPassword(userData)
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if(nextProps.auth.passwordReset){
			if(nextProps.auth.passwordReset === 'success'){
				this.setState({success:true});
			}
		}

		if (nextProps.errors.email) {
			this.setState({errors: nextProps.errors})
		}

	}

	render() {
		const {errors} = this.state;
		return (
			<div className="o-page o-page--center">
				<div className="o-page__card">
					<div className="c-card c-card--center">
				          <span className="c-icon c-icon--large u-mb-small">
					          <Link to="/">
				                <img src={logo} width={34} alt="cat logo"/>
					          </Link>
				          </span>

						<h4 className="u-mb-medium">Reset Password</h4>
						{
							this.state.success ?
								<div>
									<h5 className="u-color-secondary">Instructions to reset your password have been send. Please check your email to reset your password.</h5>

									<Link to="/" className="u-mt-medium c-btn c-btn--warning">Return to start page</Link>
								</div>:

								<form noValidate onSubmit={this.onSubmit}>
									<TextFieldGroup label="Email Address"
									                type="email"
									                name="email"
									                error={errors.email}
									                value={this.state.email}
									                onChange={this.onChange}
									/>

									<button
										className="c-btn c-btn--fullwidth c-btn--warning">Receive a new reset Link
									</button>
									<div className="row">
										{/*<div className={'col-xs-6 col-sm-6 u-pt-medium'}>*/}
										{/*	<Link className='c-btn--fullwidth c-btn c-btn--warning' to={'/register'}>Register</Link>*/}
										{/*</div>*/}
										<div className={'col-xs-12 col-sm-12 u-pt-medium'}>
											<Link className='c-btn--fullwidth c-btn c-btn--secondary' to={'/login'}>Cancel</Link>
										</div>
									</div>
								</form>
						}

					</div>
				</div>
			</div>
		);
	}
};

ForgotPassword.protoTypes = {
	forgotPassword : PropTypes.func.isRequired,
	auth     : PropTypes.object.isRequired,
	errors   : PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, {forgotPassword})(ForgotPassword);

