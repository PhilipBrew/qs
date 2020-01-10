const express = require('express');
const router = express.Router();
const enigma = require('enigma.js');
const WebSocket = require('ws');
const schema = require('enigma.js/schemas/12.20.0.json');
const passport = require('passport');
const fs = require('fs');
const certKeyFile = __dirname + '/client_key.pem';
const certKey = fs.readFileSync(certKeyFile);
const certFile = __dirname + '/client.pem';
const cert = fs.readFileSync(certFile);
const rootCertFile = __dirname + '/root.pem';
const rootCert = fs.readFileSync(rootCertFile);
const QsServer = require('../../models/QSServer');
let config = null;

async function createSessionConfig() {
	const QsServerPromise = () => new Promise((resolve, reject) => {
		QsServer.findOne(function (err, data) {
			err ? reject(err) :
				resolve(data)
		});
	});

	const qsServer = await QsServerPromise();

	if(qsServer) {
		config = {
			schema,
			url         : `wss://${qsServer.hostname}:4747/app/${qsServer.app}`,
			createSocket: url => new WebSocket(url, {
				key               : certKey,
				cert              : cert,
				ca                : rootCert,
				headers           : {
					'X-Qlik-User': 'UserDirectory=internal; UserId=sa_repository'
				},
				rejectUnauthorized: false
			}),
		};
	}

	return enigma.create(config);
}

const session = createSessionConfig();
// const session = null;

router.get('/apps', passport.authenticate('jwt', {session: false}), (req, res) => {

	session.then(qlik => {
		qlik.open()
		.then((qix) => {
			qix.getDocList()
			.then(appList => {
				res.json(appList)
			}).catch(err => {res.status(400).json(err)})
			.then(() => qlik.close());
		}).catch(err => {res.status(400).json(err)});
	}).catch(() => { res.status(400).json({'erorrs': {'flash': 'failed to create Qlik Session'}})});
});

router.get('/app/:app_id', passport.authenticate('jwt', {session: false}), (req, res) => {
	var app_id = req.params.app_id;

	session.then(qlik => {
		qlik.open().then((global) => {
			// global === QIX global interface
			qGlobal = global;

			qGlobal.openDoc(app_id).then((app) => {
				currApp = app;
				app.getAppProperties().then(function (qProp) {
						res.json({msg: qProp})
					}
					, (err) => {
						console.log(err);
						res.json(err)
					});
			})
		})
	});

});

router.get('/app/:app_id/sheets', passport.authenticate('jwt', {session: false}), (req, res) => {
	var app_id = req.params.app_id;
	var qOptionsSheet = {
		"qOptions": {
			"qTypes"                : [
				"sheet"
			],
			"qIncludeSessionObjects": true,
			"qData"                 : {}
		}
	};

	session.then(qlik => {
		qlik.open().then((global) => {
			global.openDoc(app_id).then((app) => {
				app.getObjects(qOptionsSheet).then((sheets) => {
					res.json(sheets);
				}).catch(() => {res.status(400).json({'flash' : 'error getting sheets'})})
				.then(() => qlik.close());
			}).catch((err) => {res.status(400).json({'flash' : err})});
		})
		.catch(() => {res.status(400).json({'flash':'error connecting to qlik'})});
	}).catch(() => { res.status(400).json({'erorrs': {'flash': 'failed to create Qlik Session'}})});

});

router.get('/app/:app_id/sheet/:sheet_id/objects', passport.authenticate('jwt', {session: false}), (req, res) => {
	var app_id = req.params.app_id;
	var sheet_id = req.params.sheet_id;

	session.then(qlik => {
		qlik.open().then((global) => {
			global.openDoc(app_id).then((app) => {
				app.getObject(sheet_id).then((object) => {
					object.getLayout().then(layout => {
						res.json(layout.cells);
					})
				}).catch(err => {res.status(400).json(err)});
			}).catch(err => {res.status(400).json(err)});
		}).catch(err => {res.status(400).json(err)});
	}).catch(() => { res.status(400).json({'erorrs': {'flash': 'failed to create Qlik Session'}})});
});

router.get('/app/:app_id/object/:object_id', passport.authenticate('jwt', {session: false}), (req, res) => {
	var app_id = req.params.app_id;
	var object_id = req.params.object_id;

	session.then(qlik => {
		qlik.open().then((global) => {
			global.openDoc(app_id).then((app) => {
				app.getObject(object_id).then((object) => {
					object.getLayout().then(layout => {
						res.json(layout);
					})
				}).catch(err => {res.status(400).json(err)});
			}).catch(err => {res.status(400).json(err)});
		}).catch(err => {res.status(400).json(err)});
	}).catch(() => { res.status(400).json({'erorrs': {'flash': 'failed to create Qlik Session'}})});
});

module.exports = router;
