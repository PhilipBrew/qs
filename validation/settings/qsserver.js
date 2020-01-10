/**
 * SCHEMA
 * name                : {type : String, default : 'Default'},
 * hostname            : {type : String, required : true, default : 'localhost'},
 * prefix              : {type : String, default : ''},
 * port                : {type : Number, required : true, default : 4848},
 * secure              : {type : Boolean, required : true, default : false}
**/

const validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = function ValidateServerDetailsInput(data){
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : 'Default';
	data.hostname      = !isEmpty(data.hostname) ? data.hostname : 'localhost';
    data.port   = !isEmpty(data.port) ? data.port : '4848';
    data.secure   = !isEmpty(data.secure) ? data.secure : 'NO';
    data.app   = !isEmpty(data.app) ? data.app : '';

	//REQUIRED FIELDS
	if(validator.isEmpty(data.hostname)){ errors.hostname = "Qlik Sense hostname is required"};
	if(validator.isEmpty(data.port.toString())){ errors.port = "Qlik sense port is required"};
    if(validator.isEmpty(data.secure)){ errors.secure = "Qlik Sense connection protocol is required"};
    if(validator.isEmpty(data.app)){ errors.app = "A default Qlik Sense App is required"};

	return {
		errors,
		isValid : isEmpty(errors)
	}
}
