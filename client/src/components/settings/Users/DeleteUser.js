import React, {Component}  from 'react';
import Header              from "../../layout/Header";
import Footer              from "../../layout/Footer";
import PropTypes           from 'prop-types';
import {connect}           from "react-redux";
import { withRouter} from "react-router-dom";
import Loading             from "../../common/Loading";
import axios               from 'axios';
import {ToastsStore}       from "react-toasts";
import TextFieldGroup      from "../../common/TextFieldGroup";
// import * as Icon           from "react-feather";
import {updateAuthToken}                from "../../../actions/authActions";

class DeleteUser extends Component {

	constructor(props) {
		super(props);
		this.state = {
			uid : this.props.match.params.id,
			name            : '',
			qsId            : '',
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
			axios.delete(`/api/users/${this.props.match.params.id}/`)
			     .then(res => {
				     ToastsStore.success('User deleted successfully');
				     this.props.history.push(`/settings/users`);
			     }).catch(err => {
				ToastsStore.error('Error deleting User');

			})
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();
		this.deleteUser();
	}

	updateUser(){
		const userData = {
			id : this.state.uid,
			name :  this.state.name,
			qsId : this.state.qsId,
			directory : this.state.directory,
			email : this.state.email
		};

		axios.post(`/api/users/edit/${userData.id}`, userData)
		     .then(res => {
		     });
	}

	getProfile() {
		axios.get(`/api/users/${this.props.match.params.id}`)
		     .then(res => {
			     const {name,  qsId, directory, email } = res.data;
			     this.setState({name,  qsId, directory, email , loading: false});
		     }).catch(err => {
			this.setState({errors: err});
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
										<h3>Delete Page</h3>
										<button type="button" onClick={(e) => {this.props.history.goBack()}} className="c-btn c-btn--secondary">Cancel</button>

									</div>
									<form noValidate onSubmit={this.onSubmit}>
										<TextFieldGroup
											label="Name"
											type="text"
											onChange={this.onChange}
											value={this.state.name}
											name="name"
											disabled={true}
											placeholder="e.g. Luke Skywalker"
											error={errors.name}
										/>
										<TextFieldGroup
											label="Email Address"
											type="email"
											onChange={this.onChange}
											value={this.state.email}
											name="email"
											disabled={true}
											placeholder="e.g. luke@skywalker.com"
											error={errors.email}
										/>
										<TextFieldGroup
											label="Qlik Sense User Id"
											type="text"
											onChange={this.onChange}
											value={this.state.qsId}
											name="qsId" placeholder="e.g. luke.skywalker"
											disabled={true}
											error={errors.qsId}
										/>
										<TextFieldGroup
											label="Qlik Sense User Directory"
											type="text" onChange={this.onChange}
											value={this.state.directory} name="directory" placeholder="e.g. STARWARS"
											disabled={true}
											error={errors.directory}/>
										<div className="o-line">
											<button className="c-btn c-btn--danger">Delete User</button>
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

DeleteUser.propTypes = {
	auth  : PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	errors: state.errors,
});
export default connect(mapStateToProps, {updateAuthToken})(withRouter(DeleteUser));
