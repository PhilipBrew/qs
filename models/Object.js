const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qsObjectSchema = new Schema({
	                                  page       : {type: Schema.Types.ObjectId, ref: 'pages'},
	                                  title      : {type: String},
	                                  qsId       : {type: String, required: true},
	                                  height     : {type: String, required: true, default: '400px'},
									  width		 : {type: String, required: true, default: '12'}, 
									  type       : {type: String, required: true},
	                                  description: {type: String}
                                  });

module.exports = qsObject = mongoose.model('objects', qsObjectSchema);
