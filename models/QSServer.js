const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//QLIK SENSE SERVER DETAILS SCHEMA
const QsServerSchema =
	      new Schema(
		      {
			      name    : {type: String, default: 'Default'},
			      hostname: {type: String, required: true, default: 'localhost'},
			      prefix  : {type: String, default: ''},
			      port    : {type: String, required: true, default: '4848'},
			      secure  : {type: String, required: true, default: false},
			      app     : {type: String, required: true}
		      });

module.exports = QsServer = mongoose.model('qsserver', QsServerSchema);
