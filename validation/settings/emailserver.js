/**
 * SCHEMA
 * name                : {type : String, default : 'Default'},
 * host            : {type : String, required : true, default : 'localhost'},
 * prefix              : {type : String, default : ''},
 * port                : {type : Number, required : true, default : 4848},
 * secure              : {type : Boolean, required : true, default : false}
**/

const validator = require('validator');
const isEmpty = require('../isEmpty');

module.exports = function ValidateEmailServerInput(data){
    let errors = {};
    
	data.host      = !isEmpty(data.host) ? data.host : '';
    data.port   = !isEmpty(data.port) ? data.port : '';
    data.secure   = !isEmpty(data.secure) ? data.secure : '';
    data.sender   = !isEmpty(data.sender) ? data.sender : '';
    data.username   = !isEmpty(data.username) ? data.username : '';
    data.password   = !isEmpty(data.sender) ? data.password : '';
    
	//REQUIRED FIELDS
	if(validator.isEmpty(data.host)){ errors.host = "Email SMTP hostname is required"}
	if(validator.isEmpty(data.port.toString())){ errors.port = "SMTP port is required"}
    if(validator.isEmpty(data.secure)){ errors.secure = "Email SMTP protocol is required"}
    if(validator.isEmpty(data.sender)){ errors.sender = "A default email Sender is required"}
    if(validator.isEmpty(data.username)){ errors.username = "SMTP username is required"}
    if(validator.isEmpty(data.password)){ errors.password = "SMTP password is required"}
    
	return {
		errors,
		isValid : isEmpty(errors)
	}
}
