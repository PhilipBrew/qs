const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
	                                  email: {
		                                  host    : {type: String, required: true},
		                                  port    : {type: String, required: true, default: 465},
		                                  secure  : {type: String, default: true},
		                                  username: {type: String, required: true},
		                                  password: {type: String, required: true},
		                                  sender  : {type: String},
	                                  }
                                  });
module.exports = Settings = mongoose.model('settings', SettingsSchema);
