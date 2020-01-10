const validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = function validateCreateUserInput(data){
	let errors = {};

	data.name               = !isEmpty(data.name) ? data.name : '';
	data.qsId				= !isEmpty(data.qsId) ? data.qsId : '';
    data.directory          = !isEmpty(data.directory) ? data.directory : '';
	data.email              = !isEmpty(data.email) ? data.email : '';
	data.password           = !isEmpty(data.password) ? data.password : '';
	data.confirm_password   = !isEmpty(data.confirm_password) ? data.confirm_password : '';

	//FIELD LENGTH
	if(!validator.isLength(data.directory, {min : 3, max : 34})){ errors.directory = "User Directory name  must be between 3 and 34 characters"; }
	if(!validator.isLength(data.name, {min : 3, max : 34})){ errors.name = "Full name must be between 3 and 34 characters"; }
	if(!validator.isLength(data.qsId, {min : 3, max : 34})){ errors.qsId = "Qlik Sense User ID must be between 3 and 34 characters"; }
	if(!validator.isLength(data.email, {min : 3, max : 64})){ errors.email = "Name must be between 3 and 64 characters"; }
	if(!validator.isLength(data.password, {min : 8, max : 34})){errors.password = "Password must be at least 8 characters";}

	//VALID FIELDS
	if(!validator.isEmail(data.email)){errors.email = "Invalid Email";}
	if(!validator.equals(data.confirm_password, data.password)){errors.confirm_password = "Passwords must match";}

	//REQUIRED FIELDS
	if(validator.isEmpty(data.directory)){ errors.directory = "User Directory is required"; }
	if(validator.isEmpty(data.name)){ errors.name = "Full Name is required"; }
	if(validator.isEmpty(data.qsId)){ errors.qsId = "Qlik Sense User Id is required"; }
	if(validator.isEmpty(data.directory)){ errors.directory = "Qlik Sense User Directory is required"; }
	if(validator.isEmpty(data.email)){errors.email = "Email is required";}
	if(validator.isEmpty(data.password)){errors.password = "Password is required";}
	if(validator.isEmpty(data.confirm_password)){errors.confirm_password = "Confirm password is required";}

	return {
		errors,
		isValid: isEmpty(errors)
	}
};
