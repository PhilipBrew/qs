import React, {Component}  from 'react';
import Header              from "../../layout/Header";
import Footer              from "../../layout/Footer";
import PropTypes           from 'prop-types';
import {connect}           from "react-redux";
import { withRouter, Link} from "react-router-dom";
import Loading             from "../../common/Loading";
import axios               from 'axios';
import {ToastsStore}       from "react-toasts";
import TextFieldGroup      from "../../common/TextFieldGroup";
import SelectFieldGroup    from "../../common/SelectFieldGroup";
import * as Icon           from "react-feather";
import {updateAuthToken}                from "../../../actions/authActions";

class EditUser extends Component {

	constructor(props) {
		super(props);
		this.state = {
			uid : this.props.match.params.id,
			name            : '',
			qsId            : '',
			role : '',
			directory       : '',
			email           : '',
			loading: true,
			errors : {},
		};
		this.getProfile = this.getProfile.bind(this);
		this.changePasswordRequest = this.changePasswordRequest.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.updateUser = this.updateUser.bind(this);

	}

	deleteUser(){
		ToastsStore.info('Delete user functionality currently not available');
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();
		this.updateUser();
	}

	updateUser(){
		const userData = {
			id : this.state.uid,
			name :  this.state.name,
			qsId : this.state.qsId,
			role : this.state.role,
			directory : this.state.directory,
			email : this.state.email
		};

		axios.post(`/api/users/edit/${userData.id}`, userData)
		     .then(() => {
		     	this.setState({errors : {}});
				ToastsStore.success(`User updated successfully`)
		     }).catch((err) => {
			this.setState({errors: err.response.data});
			ToastsStore.error('Error updating user ')
		});
	}

	getProfile() {
		axios.get(`/api/users/${this.props.match.params.id}`)
		     .then(res => {
		     	const {name,  qsId, directory, email , role} = res.data;
			     this.setState({name,  qsId, directory, email , role , loading: false});
		     }).catch(err => {
			this.setState({errors: err.response.data});
		});
	}

	changePasswordRequest(e) {
		e.preventDefault();
		const passwordData = {
			name : this.state.name,
			userId : this.state.uid,
			mailTo : this.state.email,
		};

		axios
			.post('/api/users/change-password-email', passwordData)
			.then(res => {
				ToastsStore.success('Password change successful');

			}).catch(err => {
			this.setState({errors : err.response.data})
		})


	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount() {
		this.getProfile();
	}

	render() {
		const {errors, loading} = this.state;
		return (
			<div className="o-page ">
				<Header/>
				{loading ? <Loading/> :
					<div className="container">
						<div className="row">
							<div className="col-md-9 u-m-auto">
								<div className="c-card">
									<div className="o-line">
										<h3>Edit Page</h3>

										<div
											className="c-dropdown dropdown">
											<span
											   className="c-btn c-btn--warning has-icon dropdown-toggle"
											   id="MoreActionsDropdown"
											   data-toggle="dropdown"
											   aria-haspopup="true"
											   aria-expanded="false">
												More <Icon.ChevronDown size={14} />
											</span>

											<div
												className="c-dropdown__menu dropdown-menu has-arrow dropdown-menu-right"
												aria-labelledby="MoreActionsDropdown">
												<span className="c-dropdown__item dropdown-item c-tooltip c-tooltip--top" onClick={(e) => this.changePasswordRequest(e)}  aria-label="Send password change email">Password Change</span>
												<Link to={`/settings/users/view/${this.state.uid}`} className="c-dropdown__item dropdown-item" >View User </Link>
												{this.state.uid === this.props.auth.user.id ? <Link className={'c-dropdown__item dropdown-item'} to={`/settings/users/delete/${this.state.uid}`}>Delete User</Link> : ''}
											</div>
										</div>
									</div>
									<form noValidate onSubmit={this.onSubmit}>
										<TextFieldGroup
											label="Name"
											type="text"
											onChange={this.onChange}
											value={this.state.name}
											name="name"
											placeholder="e.g. Luke Skywalker"
											error={errors.name}
										/>
										<TextFieldGroup
											label="Email Address"
											type="email"
											onChange={this.onChange}
											value={this.state.email}
											name="email"
											placeholder="e.g. luke@skywalker.com"
											error={errors.email}
										/>
										<TextFieldGroup
											label="Qlik Sense User Id"
											type="text"
											onChange={this.onChange}
											value={this.state.qsId}
											name="qsId" placeholder="e.g. luke.skywalker"
											error={errors.qsId}
										/>
										<SelectFieldGroup
											label={'User Role'}
											type={'text'}
											onChange={this.onChange}
											value={this.state.role}
											options={[{key : 'Admin', title : 'Admin'}, {key : 'User' , title  : 'User'}]}
											name={'role'}/>
										<TextFieldGroup
											label="Qlik Sense User Directory"
											type="text" onChange={this.onChange}
											value={this.state.directory} name="directory" placeholder="e.g. STARWARS"
											error={errors.directory}/>
											<div className="o-line">
												<button className="c-btn c-btn--warning">Update Account</button>
												<button type="button" onClick={(e) => {this.props.history.goBack()}} className="c-btn c-btn--secondary">Cancel</button>
											</div>
									</form>
								</div>
							</div>

						</div>
					</div>
				}
				<Footer/>
			</div>
		);
	}
}

EditUser.propTypes = {
	auth  : PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	errors: state.errors,
});
export default connect(mapStateToProps,{updateAuthToken})(withRouter(EditUser));
