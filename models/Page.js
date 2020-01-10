const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//TODO: ADD PAGE HANDLES IN MODEL

//PAGE SCHEMA
const PageSchema = new Schema({
	                              createdBy  : {type: Schema.Types.ObjectId, ref: 'users'},
	                              parent     : {type: String, required : false},
	                              title      : {type: String, required: true},
	                              status     : {type: String, required: true, default: 'draft'},
	                              description: {type: String},
	                              qsApp      : {type: String},
	                              menu       : {type: String, required: true, default: 'no'},
	                              template   : {type: String, required: true, default: 'analysis'},
	                              groups     : [
		                              {type: Schema.Types.ObjectId, ref : 'security-group'}
	                              ],
                              });

module.exports = Page = mongoose.model('pages', PageSchema);
