import React, {Component} from 'react';
import {connect}          from "react-redux";
import PropTypes          from 'prop-types';
import {Link}             from "react-router-dom";
import Loader             from "react-loader-spinner";
import {getGroups}         from "../../../actions/groupsActions";
import Header             from "../../layout/Header";
import Footer             from "../../layout/Footer";
import * as Icon          from 'react-feather';
import {ToastsStore}      from "react-toasts";
import axios from 'axios';
import {updateAuthToken}                from "../../../actions/authActions";

class Groups extends Component {
	constructor(prop){
		super(prop);
		this.deleteGroup = this.deleteGroup.bind(this);
	}

	deleteGroup(group_id){
		axios.delete(`/api/groups/delete/${group_id}`).then(res => {
			ToastsStore.success('Group and all associated objects deleted successfully');
			this.props.getGroups();
		})
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}

	componentDidMount() {
		this.props.getGroups();
	}

	render() {
		const {groups} = this.props;
		const loading = groups.loading;
		const groupList = groups.groups;

		return (
			<div className="o-group">
				<Header/>
				<div className="container">
					{
						(loading) ?
						<div className="u-text-center u-m-auto">
							<Loader
								type="Triangle"
								color="#f19012"
								height="250"
								width="250"
							/>
						</div> :
								(groupList !== null) ?
									<div className="c-card u-p-zero">
										<div className=" o-line u-p-medium">
											<h3 className="c-card__title u-color-secondary">Site Security Groups</h3>
											<Link to={'/settings/groups/create'}
											      className="c-btn c-btn--warning">Create Group
											</Link>
										</div>
										{
											groupList.length > 0 ?
												<div className="c-table-responsive@wide">
													<table className="c-table">
														<thead className="c-table__head">
															<tr className="c-table__row">
																<th className="c-table__cell c-table__cell--head">Name</th>
																<th className="c-table__cell c-table__cell--head">Description</th>
																<th className="c-table__cell c-table__cell--head">Action</th>
															</tr>
														</thead>
														<tbody>
														{groupList.map(group =>
															               <tr className="c-table__row u-text-capitalize"
															                   key={group._id}>
																               <td className="c-table__cell">{group.name}</td>
																               <td className="c-table__cell">{group.description.substr(0, 80)}...</td>
																               <td width="90" className="c-table__cell">
																	               <Link
																		               to={`/settings/groups/view/${group._id}`}
																		               className="c-btn c-btn--warning u-m-xsmall c-btn--small has-arrow u-text-center">
																		               <Icon.Eye size={14}/>
																	               </Link>
																	               <Link
																		               to={`/settings/groups/edit/${group._id}`}
																		               className="c-btn c-btn--info u-m-xsmall c-btn--small has-arrow u-text-center"><Icon.Edit3
																		               size={14}/></Link>
																	               {/**TODO : RESOLVE DELETE FUNCTION**/}
																	               <button type={'button'}
																	                       onClick={(e) => this.deleteGroup(group._id, e)}
																	                       className="c-btn c-btn--danger u-m-xsmall c-btn--small has-arrow u-text-center">
																		               <Icon.Slash size={14}/></button>
																               </td>
															               </tr>
														)}
														</tbody>
													</table>
												</div>:

												<div className="c-alert c-alert--warning u-mb-medium">
										            <span className="c-alert__icon">
											            <Icon.Triangle size={14}/>
										            </span>

													<div className="c-alert__content">
														<h4 className="c-alert__title">Nothing to Show</h4>
														<p>Add your first Group!</p>
													</div>
												</div>

										}
							</div>
						: ''
					}
				</div>
				<Footer/>
			</div>
		);
	}
}

Groups.propTypes = {
	auth    : PropTypes.object.isRequired,
	getGroups: PropTypes.func.isRequired,
	updateAuthToken : PropTypes.func.isRequired,
	errors  : PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
	auth  : state.auth,
	groups : state.groups,
	errors: state.errors
})
export default connect(mapStateToProps, {getGroups	, updateAuthToken})(Groups);
