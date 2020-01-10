const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//USER SCHEMA
const SecurityGroupSchema = new Schema({
	                                       owner      : {type: Schema.Types.ObjectId, ref: 'users'},
	                                       name       : {type: String, required: true},
	                                       description: {type: String, required: true},
	                                       date       : {type: Date, default: Date.now}
                                       });

module.exports = SecurityGroup = mongoose.model('security-group', SecurityGroupSchema);
