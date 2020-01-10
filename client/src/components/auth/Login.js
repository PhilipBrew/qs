import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import {Link}             from 'react-router-dom';
import {connect}          from "react-redux";
import {loginUser}        from '../../actions/authActions';
import logo               from '../../img/LogoIconLight.png';
import TextFieldGroup     from '../common/TextFieldGroup';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email   : '',
			password: '',
			errors  : {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/');
		}
	}

	componentWillReceiveProps(nextProps) {
		// this.setState({errors: null});

		if (nextProps.auth.isAuthenticated) {
			this.props.history.push('/')
		}

		if (nextProps.errors) {
			// console.log(nextProps.errors.email);
			this.setState({errors: nextProps.errors})
		}
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		const userData = {
			email   : this.state.email,
			password: this.state.password,
		};

		this.props.loginUser(userData)
	}

	render() {
		const {errors} = this.state;

		return (
			<div className="o-page o-page--center">
				<div className="o-page__card">
					<div className="c-card c-card--center">
				          <span className="c-icon c-icon--large u-mb-small">
					          <Link to="/">
				                <img src={logo} alt="cap logo" width={52}/>
					          </Link>
				          </span>

						<h4 className="u-mb-medium">Welcome Back :)</h4>
						<form noValidate onSubmit={this.onSubmit}>
							<TextFieldGroup label="Email Address"
							                type="email"
							                name="email"
							                error={errors.email}
							                value={this.state.email}
							                onChange={this.onChange}
							/>

							<TextFieldGroup label="Password"
							                type="password"
							                name="password"
							                error={errors.password}
							                onChange={this.onChange}
							                value={this.state.password}
							/>

							<button
								className="c-btn c-btn--fullwidth c-btn--warning">Login
							</button>
							<div className="row">
								{/*<div className={'u-pt-medium col-xs-12 col-sm-6'}>*/}
								{/*	<Link className='c-btn--fullwidth c-btn c-btn--warning' to={'/register'}> Create Account</Link>*/}
								{/*</div>*/}
								<div className={'u-pt-medium col-xs-12 col-sm-12 u-m-auto'}>
									<Link className='c-btn--fullwidth c-btn c-btn--secondary' to={'/forgot-password'}>Reset Password</Link>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
};

Login.protoTypes = {
	loginUser: PropTypes.func.isRequired,
	auth     : PropTypes.object.isRequired,
	errors   : PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, {loginUser})(Login);

