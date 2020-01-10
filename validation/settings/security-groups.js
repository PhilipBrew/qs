/***
 * SCHEMA
 * owner  : {type: Schema.Types.ObjectId, ref: 'users'},
 * name       : {type: String, required: true},
 * description: {type: String, required: true},
 * date       : {type: Date, default: Date.now},
 */

const validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = function validateSecurityGroupInput(data){
	let errors = {};

	data.name      = !isEmpty(data.name) ? data.name : '';
	data.description      = !isEmpty(data.description) ? data.description : '';

	if(!validator.isLength(data.name, {min : 3, max : 34})){ errors.name = "Security group name must be between 3 and 34 characters"; }
	// if(!validator.isLength(data.description, {min : 8})){ errors.description = "Security group description must be at least 8 characters"; }

	if(validator.isEmpty(data.name)){ errors.name = "Security group name is required"};
	// if(validator.isEmpty(data.description)){ errors.description = "Security group description is required"};

	return {
		errors,
		isValid : isEmpty(errors)
	}
}
