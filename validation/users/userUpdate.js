const validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = function validateUpdateUserInput(data){
	let errors = {};

	data.name               = !isEmpty(data.name) ? data.name : '';
	data.qsId				= !isEmpty(data.qsId) ? data.qsId : '';
    data.directory          = !isEmpty(data.directory) ? data.directory : '';
	data.email              = !isEmpty(data.email) ? data.email : '';

	//FIELD LENGTH
	if(!validator.isLength(data.directory, {min : 3, max : 34})){ errors.directory = "User Directory name  must be between 3 and 34 characters"; }
	if(!validator.isLength(data.name, {min : 3, max : 34})){ errors.name = "Full name must be between 3 and 34 characters"; }
	if(!validator.isLength(data.qsId, {min : 3, max : 34})){ errors.qsId = "Qlik Sense User ID must be between 3 and 34 characters"; }

	//VALID FIELDS
	if(!validator.isEmail(data.email)){errors.email = "Invalid Email";}

	//REQUIRED FIELDS
	if(validator.isEmpty(data.directory)){ errors.directory = "User Directory is required"; }
	if(validator.isEmpty(data.name)){ errors.name = "Full Name is required"; }
	if(validator.isEmpty(data.qsId)){ errors.qsId = "Qlik Sense User Id is required"; }
	if(validator.isEmpty(data.email)){errors.email = "Email is required";}

	return {
		errors,
		isValid: isEmpty(errors)
	}
};
