import React      from 'react';
import classnames from 'classnames';
import PropTypes  from 'prop-types';

const TextFieldGroup = ({
	                        name,
	                        placeholder,
	                        value,
	                        label,
	                        error,
	                        info,
	                        type,
	                        onChange,
	                        disabled
                        }) => {
	return (
		<div className="c-field u-pb-small">
			{label && <label className="c-field__label">{label}</label>}
			<input className={classnames('c-input u-mb-small', {' c-input--danger': error})}
			       type={type}
			       name={name}
			       value={value}
			       onChange={onChange}
			       placeholder={placeholder}
			       autoComplete={'none'}
			       disabled={disabled}
			></input>
			{info && <small className="c-field__message">
                    <i className="fa fa-info-circle"></i>{info}</small>}
			{error && (
					<small className="c-field__message u-color-danger">
						<i className="fa fa-times-circle"></i> {error}</small>
			)}
		</div>
	);
};

TextFieldGroup.propTypes = {
	name : PropTypes.string.isRequired,
	placeholder  : PropTypes.string,
	value : PropTypes.string.isRequired,
	label : PropTypes.string.isRequired,
	error : PropTypes.string,
	info : PropTypes.string,
	type : PropTypes.string.isRequired,
	onChange : PropTypes.func.isRequired,
	disabled : PropTypes.bool
};

TextFieldGroup.defaultProps = {
	type : 'text'
};
export default TextFieldGroup;
