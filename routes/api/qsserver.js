const express = require('express');
const passport = require('passport');

const router = express.Router();

//LOAD SERVER DETAILS SCHEMA
const QsServerDetails = require('../../models/QSServer');

//LOAD SERVER DETAILS INPUT VALIDATION
const ValidateServerDetailsInput = require('../../validation/settings/qsserver');

/**
 * @route           GET /api/qsserver
 * @description     Get the details of the Qlik Sense Server for the mashup application
 * @access          Private
 */
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	QsServerDetails.findOne()
	               .then(details => {
		               if (details) { //SEVER EXISTS : RETURN DETAILS
			               res.json(details)
		               } else {      //SERVER DOES NOT EXIST : RETURN 404 ERROR
			               res.status(404).json({message: 'Server details not found. Create a new Qlik Sense Server.'});
		               }
	               })
	               .catch(err => res.status(400).json(err));
});


/**
 * @route           POST /api/qsserver
 * @description     CREATE and UPDATE the details of the Qlik Sense Server for the mashup application
 * @access          Private
 */
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = ValidateServerDetailsInput(req.body);
	if (isValid) {
		QsServerDetails
			.find()
			.then(details => {
				const {name,hostname, port,prefix,secure,app} = req.body;

				const serverDetails = {name,hostname, port,prefix,secure,app };

				if (!details[0]) {
					//CREATE NEW SERVER INFORMATION
					newServerDetails = new QsServerDetails(serverDetails);
					newServerDetails.save()
					                .then(details => {res.json(details)})
					                .catch(err => {res.status(400).json(err)});
				} else {
					//UPDATE AN ALREADY EXISTING APP
					details = details[0];

					QsServerDetails
						.findByIdAndUpdate(details.id, serverDetails, {new : true})
						.then(qsServer => {
							 res.json(qsServer)
						})
					.catch(err => res.status(400).json(err));

				}

			})
			.catch(err => res.status(400).json(err));
	} else { // ERRORS FROM VALIDATOR
		res.status(404).json(errors);
	}
});

module.exports = router;
