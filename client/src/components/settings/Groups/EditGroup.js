import React, {Component}                            from 'react';
import PropTypes                                     from 'prop-types';
import {withRouter}                                  from "react-router-dom";
import {connect}                                     from "react-redux";
import { editGroup, getGroup, getGroups} from "../../../actions/groupsActions";
import {updateAuthToken}                             from "../../../actions/authActions";
import TextFieldGroup                                from "../../common/TextFieldGroup";
import Header                                        from "../../layout/Header";
import Footer                                        from "../../layout/Footer";
import Loading                                       from "../../common/Loading";
import * as Icon                                     from "react-feather";
import TextAreaFieldGroup                            from "../../common/TextAreaFieldGroup";

class EditGroup extends Component {
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

		if (nextProps.groups.group) {
			const group = nextProps.groups.group;

			this.setState({
	              name     : group.name,
	              description: group.description,

              })
		}
	}

	componentDidMount() {
		this.props.getGroup(this.props.match.params.id);

	//	TODO : ADD GROUPS DROPDOWN OPTIONS
	}

	onChange(e) {
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();

		const groupData = {
			owner  : this.props.auth.user.id,
			name    : this.state.name,
			description: this.state.description,
		};

		this.props.editGroup(this.props.match.params.id, groupData, this.props.history);
	}

	render() {
		const {errors} = this.state;
		const {groups} = this.props;

		return (
			<div className="o-group">
				<Header/>
				<div className="container">
					{groups.loading || groups.group === null ? <Loading/> :
						<div className="row">
							<div className="col-md-8 col-xl-8 u-m-auto">
								<div className="c-card is-animated">
									<div className="o-line">
													<span className="c-icon c-icon--large u-mb-small">
														<Icon.ShieldOff color="#f19012"/>
													</span>
										<h5 className="u-mb-xsmall">Edit Group</h5>
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
												<button className="c-btn c-btn--fullwidth c-btn--warning">Update Group</button>
											</div>
											<div className="col-md-6 u-mt-xsmall">
												<button type={'button'} onClick={(e) => {this.props.history.goBack()}} className="c-btn c-btn--fullwidth c-btn--secondary">Cancel</button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					}

				</div>
				<Footer/>
			</div>
		);
	}
}

EditGroup.propTypes = {
	auth    : PropTypes.object.isRequired,
	groups   : PropTypes.object.isRequired,
	editGroup: PropTypes.func.isRequired,
	getGroup : PropTypes.func.isRequired,
	updateAuthToken : PropTypes.func.isRequired,
	errors  : PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
	groups  : state.groups,
	errors: state.errors
});

export default connect(mapStateToProps, {editGroup, updateAuthToken, getGroups, getGroup})(withRouter(EditGroup));
