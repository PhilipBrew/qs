const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//USER SCHEMA
const UserSchema = new Schema({
	                              directory            : {type: String, required: true, default: 'WEBMASHUP'},
	                              qsId                 : {type: String, required: true},
	                              role                 : {type: String, required: true, default: 'User'},
	                              active               : {type: Boolean, required: true, default: false},
	                              name                 : {type: String, required: true},
	                              email                : {type: String, required: true},
	                              password             : {type: String, required: true},
	                              date                 : {type: Date, default: Date.now},
	                              groups     : [
		                              {type: Schema.Types.ObjectId, ref : 'security-group'}
	                              ],
	                              changePasswordRequest: {
		                              token: {type: String},
		                              date : {type: Date, default: Date.now},
	                              }
                              });

module.exports = User = mongoose.model('users', UserSchema);
