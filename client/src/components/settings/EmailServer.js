import React, {Component}         from 'react';
import axios                      from 'axios';
import TextFieldGroup             from '../common/TextFieldGroup';
import Loading                    from "../common/Loading";
import * as Icon                  from "react-feather";
import Header                     from "../layout/Header";
import {ToastsStore}              from "react-toasts";
import classnames                 from "classnames";
import {withRouter}               from "react-router-dom";
import {updateAuthToken}          from "../../actions/authActions";
import PropTypes                  from "prop-types";
import {connect}                  from "react-redux";

class EmailServer extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			host    : '',
			port    : '',
			secure  : '',
			username: '',
			password: '',
			sender  : '',
			loading : true,
			errors  : {}
		};

		this.getEmailServerSettings = this.getEmailServerSettings.bind(this);
		this.setEmailServerSettings = this.setEmailServerSettings.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {

		e.preventDefault();
		this.setState({loading: true});
		const smtpDetails = {
			host    : this.state.host,
			port    : this.state.port,
			secure  : this.state.secure,
			username: this.state.username,
			password: this.state.password,
			sender  : this.state.sender
		};

		this.setEmailServerSettings(smtpDetails);
	}

	getEmailServerSettings() {
		axios.get('/api/settings/').then(settings => {
			const {host, port, secure, username, sender} = settings.data.email;
			this.setState({host, port, secure, username, sender, loading: false})
		}).catch(err => {
			this.setState({errors: err.response.data, loading: false});
		});

	}

	setEmailServerSettings(smtpDetails) {
		axios.post('/api/settings/email-server', smtpDetails)
		.then(() => {
			ToastsStore.success("SMTP Server details updated");
			this.getEmailServerSettings();
		}).catch(err => {
			this.setState({errors: err.response.data, loading: false});

		})
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount() {
		this.getEmailServerSettings();
	}

	render() {
		const {loading, errors} = this.state;

		return (
			<div className="o-page">
				<Header/>
				<div className="container"> {
					loading ?
						<Loading/> :
						<div>
							<div className="row u-justify-center">
								<div className="col-md-8 col-xl-8 u-m-auto u-mb-medium">
									<div className="c-alert c-alert--warning alert">
										<span className="c-alert__icon"><Icon.Info/></span>
										<div className="c-alert__content">
											<h4 className="c-alert__title">Email SMTP Server Details</h4>
											<p>
												Setup your outgoing mail transfer protocol for sending emails from the
												portal.
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
												<Icon.Mail color={'#f19012'}/>
											</span>
											<h5 className="u-mb-xsmall">SMTP Server Details</h5>
										</div>

										<hr className="u-mt-small u-mb-medium"/>

										<form noValidate onSubmit={this.onSubmit}>
											<div className="row">
												<div className="col-md-6">
													<TextFieldGroup
														label="Hostname"
														onChange={this.onChange}
														value={this.state.host}
														name="host"
														error={errors.host}/>
												</div>
												<div className="col-md-6">
													<TextFieldGroup
														label="Port"
														onChange={this.onChange}
														value={this.state.port}
														name="port"
														error={errors.port}/>
												</div>
												<div className="col-md-6">
													<label className="c-field__label">Require SSL</label>
													<div className="c-select u-mb-xsmall">
														<select className={classnames('c-select__input', {' c-select--danger': errors.secure})}
														        name="secure"
														        onChange={this.onChange}
														        value={this.state.secure}
														        placeholder="Select">
															<option value="NO">NO</option>
															<option value="YES">YES</option>
														</select>

														{errors.secure && (
															<small className="c-field__message u-color-danger">
																{errors.secure}</small>
														)}
													</div>
												</div>
												<div className="col-md-6">
													<TextFieldGroup
														label="Username"
														type="email"
														onChange={this.onChange}
														value={this.state.username}
														name="username"
														error={errors.username}/>
												</div>
												<div className="col-md-6">
													<TextFieldGroup
														label="Password"
														type="password"
														onChange={this.onChange}
														value={this.state.password}
														name="password"
														error={errors.password}/>
												</div>
												<div className="col-md-6">
													<TextFieldGroup
														label="Send From"
														onChange={this.onChange}
														value={this.state.sender}
														name="sender"
														error={errors.sender}/>
												</div>
											</div>
											<div className="o-line">
												<div className="">
													<button
														type="submit"
														className="c-btn c-btn--warning has-arrow u-text-center"> Save
														Details
													</button>
												</div>
												<div className="">
													<button
														type="button"
														onClick={(e) => {this.props.history.goBack();}}
														className="c-btn c-btn--secondary has-arrow u-text-center"> Cancel
													</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>

				}
				</div>
			</div>
		);
	}
}

EmailServer.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {updateAuthToken})(withRouter(EmailServer));
