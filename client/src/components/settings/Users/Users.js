import React, {Component}            from 'react';
import axios                         from "axios";
import {Link, withRouter}            from "react-router-dom";
import * as Icon                     from 'react-feather';
import Header                        from '../../layout/Header';
import Footer                        from '../../layout/Footer';
import Loading                       from '../../common/Loading';
import {updateAuthToken} from "../../../actions/authActions";
import PropTypes                     from "prop-types";
import {connect}                     from "react-redux";

class Users extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			users  : null,
			loading: false,
			errors : {},
		};
		this.getUsers = this.getUsers.bind(this);
	}

	getUsers() {
		axios.get('/api/users').then(users => {
			this.setState({users: users.data});
		}).catch(err => {
			this.setState({errors: err});
		})
	}

	componentWillMount() {
		this.props.updateAuthToken(localStorage.getItem('jwtToken'));
	}


	componentDidMount() {
		this.getUsers();
	}

	render() {
		const users = this.state.users;
		const loading = this.state.loading;
		return (
			<div className="o-page">
				<Header/>
				<div className="container">
					{
						(loading || users === null) ?
							<div className="u-text-center u-m-auto">
								<Loading/>
							</div> :
							<div className="c-card u-p-zero">
								<div className=" o-line u-p-medium">
									<h3 className="c-card__title u-color-secondary">Users</h3>
									<Link to={'/settings/users/create'}
									      className="c-btn c-btn--warning">Create User
									</Link>
								</div>
								<div className="c-table-responsive@wide">
									<table className="c-table">
										<thead className="c-table__head">
										<tr className="c-table__row">
											<th className="c-table__cell c-table__cell--head">Name</th>
											<th className="c-table__cell c-table__cell--head">Qlik Directory</th>
											<th className="c-table__cell c-table__cell--head">Qlik User Id</th>
											<th className="c-table__cell c-table__cell--head">Email</th>
											<th className="c-table__cell c-table__cell--head">Action</th>
										</tr>
										</thead>
										<tbody>
										{users !== null ?
											users.map(user =>
											           <tr className="c-table__row" key={user._id}>
												           <td className="c-table__cell u-text-capitalize">{user.name}</td>
												           <td className="c-table__cell u-text-uppercase">{user.directory}</td>
												           <td className="c-table__cell u-text-uppercase">{user.qsId}</td>
												           <td className="c-table__cell">{user.email}</td>
												           <td className="c-table__cell">
													           <Link to={`/settings/users/view/${user._id}`}
													                 className="c-btn c-btn--warning u-m-xsmall c-btn--small has-arrow u-text-center">
														           <Icon.Eye size={14}/>
													           </Link>
													           {/*TODO : RESOLVE EDIT DELETE FUNCTION*/}
													           <Link to={`/settings/users/edit/${user._id}`}
													                 className="c-btn c-btn--info u-m-xsmall c-btn--small has-arrow u-text-center"><Icon.Edit3
														           size={14}/></Link>

													           <Link to={`/settings/users/delete/${user._id}`}
														           className="c-btn c-btn--danger u-m-xsmall c-btn--small has-arrow u-text-center"><Icon.Slash
														           size={14}/></Link>

												           </td>
											           </tr>
										) : ''}
										</tbody>
									</table>
								</div>
							</div>
					}
				</div>
				<Footer/>
			</div>
		);
	}
}

Users.propTypes = {
	auth  : PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth  : state.auth,
});
export default connect(mapStateToProps, {updateAuthToken})(withRouter(Users));
