
const validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = function validatePasswordInput(data){
	let errors = {};
	
	data.password           = !isEmpty(data.password) ? data.password : '';
	data.newPassword           = !isEmpty(data.newPassword) ? data.newPassword : '';
	data.confirmPassword   = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';
	
	//FIELD LENGTH
	if(!validator.isLength(data.password, {min : 8, max : 34})){errors.password = "Password must be at least 8 characters";}
	if(!validator.isLength(data.newPassword, {min : 8, max : 34})){errors.newPassword = "Password must be at least 8 characters";}
	if(!validator.isLength(data.confirmPassword, {min : 8, max : 34})){errors.confirmPassword = "Password must be at least 8 characters";}
	
	//VALID FIELDS
	if(!validator.equals(data.confirmPassword, data.newPassword)){errors.confirmPassword = "New passwords and confirm must match";}
	
	//REQUIRED FIELDS
	if(validator.isEmpty(data.password)){errors.password = "Password is required";}
	if(validator.isEmpty(data.confirmPassword)){errors.confirmPassword = "Confirm password is required";}
	if(validator.isEmpty(data.newPassword)){errors.newPassword = "New password is required";}
	
	return {
		errors,
		isValid: isEmpty(errors)
	}
};
