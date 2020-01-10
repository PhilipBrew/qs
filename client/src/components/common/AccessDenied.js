import React  from 'react';
import {Link} from "react-router-dom";
import * as Icon from 'react-feather';


const AccessDenied = () => {
	return (
		<div className="row u-mt-xlarge">
			<div className="col-md-6  u-pt-xlarge u-pb-xlarge offset-3 u-text-center col-xl-6 u-mr-auto">
				<div className="c-card is-animated">
									<span className="c-icon c-icon--large u-mb-small">
										<Icon.lock/>
									</span>
					
					<h5 className="u-mb-xsmall u-text-center">Access Denied</h5>
					<p className="u-mb-medium u-text-center">
						Opps it seems like you have no access to this page.
					</p>
					<Link to="/"
					      className="c-btn c-btn--warning has-arrow u-text-center"> Dashboard <Icon.ChevronRight/>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AccessDenied;
