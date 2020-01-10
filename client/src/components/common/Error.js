import React     from 'react';
import PropTypes from 'prop-types';
import {Link}    from "react-router-dom";
import * as Icon from 'react-feather';

const Error = ({error, link}) => {
	
	return (

		<div className="c-alert c-alert--danger alert">
										
									    <span className="c-alert__icon">
										    <Icon.Slash/>
									    </span>
			<div className="c-alert__content">
				<h4 className="c-alert__title">Nothing to show</h4>
				<p>
					{error}
				</p>
				{link ?
					<div className="u-pt-medium">
						<Link to={link.url}
						      className="c-btn c-btn--warning has-arrow u-text-center"> {link.title} </Link>
					</div> : ''
				}
				
			</div>
		</div>
	);
};

Error.propTypes = {
	error : PropTypes.string.isRequired,
	link  : PropTypes.object,
};

export default Error;
