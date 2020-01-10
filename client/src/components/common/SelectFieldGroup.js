import React      from 'react';
import classnames from 'classnames';
import PropTypes  from 'prop-types';
import * as Icon from 'react-feather';


const SelectFieldGroup = ({
	                        name,
	                        placeholder,
	                        value,
	                        label,
	                        error,
	                        info,
							options,
	                        type,
	                        onChange,
	                        disabled
                        }) => {

	return (
		<div className="c-field u-pb-small">
			{label && <label className="c-field__label">{label}</label>}
			<div className="c-select u-mb-xsmall">
				<select
					className={classnames('c-select__input', {' c-select--danger': error})}
					type={type}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					disabled={disabled}
				>
					<option value="">Select One</option>
					{
						options ?
							options.map(item => <option
								key={item.key}
								value={item.key}>{item.title}</option>) : null
					}
				</select>
			</div>
			{info && <small className="c-field__message">
                    <i className="fa fa-info-circle"></i>{info}</small>}
			{error && (
					<small className="c-field__message u-color-danger">
						<Icon.Slash/>  {error}</small>
			)}
		</div>
	);
};

SelectFieldGroup.propTypes = {
	name : PropTypes.string.isRequired,
	placeholder  : PropTypes.string,
	options : PropTypes.array,
	value : PropTypes.string.isRequired,
	label : PropTypes.string.isRequired,
	error : PropTypes.string,
	info : PropTypes.string,
	type : PropTypes.string.isRequired,
	onChange : PropTypes.func.isRequired,
	disabled : PropTypes.bool
};

SelectFieldGroup.defaultProps = {
	type : 'text',
	options : {'' : 'Select One'},
	value : ''
};
export default SelectFieldGroup;
