import React, {Component}         from 'react';
import PropTypes                  from 'prop-types';
import {connect}                  from "react-redux";
import {getQsServer, setQsServer} from "../../actions/qsServerActions";
import Header                     from "../layout/Header";
import Footer                     from "../layout/Footer";
import AccessDenied               from "../common/AccessDenied";
import TextFieldGroup             from "../common/TextFieldGroup";
import {Redirect, withRouter}     from 'react-router-dom';
import Loading                    from "../common/Loading";
import * as Icon                  from 'react-feather';
import SelectFieldGroup           from "../common/SelectFieldGroup";
import {updateAuthToken}                from "../../actions/authActions";

class QsServer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name    : '',
			hostname: '',
			prefix  : '',
			port    : '',
			secure  : '',
			app     : '',
			errors : {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState( {[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		const qsServerData = {
			name    : this.state.name,
			hostname: this.state.hostname,
			prefix  : this.state.prefix,
			port    : this.state.port,
			secure  : this.state.secure,
			app     : this.state.app,
		};

		this.props.setQsServer(qsServerData, this.props.history);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({errors: nextProps.errors});
		}
		if(nextProps.qsServer.qsServer){
			const qsServer = nextProps.qsServer.qsServer;

			const {name, hostname, prefix, port, secure, app} = qsServer;

			//SET COMPONENT FIELDS STATE
			this.setState({name, hostname, prefix, port, secure, app})
		}
	}

	componentDidMount() {
		if(!this.props.auth.isAuthenticated){
			this.props.history.push('/login');
		}
		this.props.getQsServer();
	}

	componentWillMount(){
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	render() {
		const {isAuthenticated , user} = this.props.auth;
		const {loading,errors} = this.props;

		return (
			<div className="o-page">
				<Header/>
				<div className="container">
					{isAuthenticated ?
						user.role === 'Admin' ?
							(loading) ?
								<Loading /> :
								<div>
									<div className="row u-justify-center">
										<div className="col-md-8 col-xl-8 u-m-auto u-mb-medium">
											<div className="c-alert c-alert--warning alert">

											    <span className="c-alert__icon">
												    <Icon.Info/>
											    </span>
												<div className="c-alert__content">
													<h4 className="c-alert__title">Qlik Sense Server Details</h4>
													<p>
														Qlik Sense details are required to define the Qlik engine connection
														used to
														open applications and get objects
														and to define where the Qlik Sense client side software and
														extensions should be
														loaded from.
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className="row">
										<div className="col-md-8 col-xl-8 u-m-auto">
											<div className="c-card is-animated">

												<div className="o-line">
													<span className="c-icon c-icon--large u-mb-small">
														<Icon.Server color={'#f19012'}/>
													</span>
													<h5 className="u-mb-xsmall">Qlik Sense Server</h5>
												</div>

												<hr className="u-mt-small u-mb-medium"/>

												<form noValidate onSubmit={this.onSubmit}>

													<div className="row">
														<div className="col-md-6">
															<TextFieldGroup
																label="Name"
																onChange={this.onChange}
																value={this.state.name}
																name="name"
																error={errors.name}/>
														</div>
														<div className="col-md-6">
															<TextFieldGroup
																label="Hostname"
																onChange={this.onChange}
																value={this.state.hostname}
																name="hostname"
																error={errors.hostname}/>
														</div>
													</div>
													<div className="row">
														<div className="col-md-6">
															<TextFieldGroup
																label="Virtual Proxy Prefix"
																onChange={this.onChange}
																value={this.state.prefix}
																name="prefix"
																info="use '/' for default or '/proxy/'"
																error={errors.proxy}/>
														</div>
														<div className="col-md-6">
															<TextFieldGroup
																label="Port"
																onChange={this.onChange}
																value={this.state.port}
																name="port"
																error={errors.port}/>
														</div>
													</div>
													<div className="row">
														<div className="col-md-6">
															<TextFieldGroup
																label="Default App ID"
																onChange={this.onChange}
																value={this.state.app}
																name="app"
																error={errors.app}/>
														</div>
														<div className="col-md-6">
															<SelectFieldGroup
																label={'Use Secure HTTPS'}
																type={'text'}
																onChange={this.onChange}
																value={this.state.secure}
																name='secure'
																options={[{key : 'YES' , title : 'YES'},{key : 'NO' , title : 'NO'}]}
																errors={errors.secure}
															/>
														</div>
													</div>
													<div className="o-line">
														<div className="">
															<button
																type="submit"
																className="c-btn c-btn--warning has-arrow u-text-center"> Save
																Details </button>
														</div>
														<div className="">
															<button
																type="button"
																onClick={(e) => {this.props.history.goBack();}}
																className="c-btn c-btn--secondary has-arrow u-text-center"> Cancel </button>
														</div>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div> :
							(<AccessDenied/>) :
						<Redirect to="/login" />
					}
				</div>

				<Footer/>
			</div>
		);
	}
};

QsServer.propTypes = {
	auth       : PropTypes.object.isRequired,
	getQsServer: PropTypes.func.isRequired,
	setQsServer: PropTypes.func.isRequired,
	qsServer   : PropTypes.object.isRequired,
	errors     : PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth    : state.auth,
	qsServer: state.qsServer,
	errors  : state.errors,
});

export default connect(mapStateToProps, {getQsServer, setQsServer, updateAuthToken})(withRouter(QsServer));
