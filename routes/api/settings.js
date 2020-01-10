const express = require('express');
const router = express.Router();
const Cryptr = require('cryptr');
const keys = require('../../config/keys');
const cryptr = new Cryptr(keys.cryptr);

//LOAD SERVER DETAILS SCHEMA
const Settings = require('../../models/Settings');

//LOAD SERVER DETAILS INPUT VALIDATION
const validateEmailServerInput = require('../../validation/settings/emailserver');

// router.get('/', passport.authenticate('jwt', {session: false}),(req, res) => {
router.get('/', (req, res) => {
	Settings.findOne()
	.then(settings => {
		if (settings) {
			// settings.password = cryptr.decrypt(password);
			res.json(settings);
		} else {
			res.status(404).json({nosettings: 'There are no settings available'})
		}
	})
	.catch(err => {
		res.status(400).json(err);
	})
});

// router.get('/', passport.authenticate('jwt', {session: false}),(req, res) => {
router.post('/email-server', (req, res) => {
	const {errors, isValid} = validateEmailServerInput(req.body);
	if (isValid) {
		Settings.find()
		.then(settings => {
			const email = {
				host    : req.body.host,
				port    : req.body.port,
				secure  : req.body.secure,
				username: req.body.username,
				password: cryptr.encrypt(req.body.password),
				sender  : req.body.sender,
			};

			const settingsWithEmail = {};
			settingsWithEmail.email = email;

			if (settings.length === 0) {

				const newSettingsWithEmail = new Settings(settingsWithEmail);
				newSettingsWithEmail
				.save()
				.then(settings => res.json(settings.email))
				.catch(err => res.status(400).json(err));

			} else {
				Settings.findByIdAndUpdate(settings[0].id, settingsWithEmail, {new: true})
				.then(settings => {
					res.json(settings);
				}).catch(err => res.status(400).json(err));

			}

		}).catch(err => {
			res.status(400).json(err)
		})
	} else {
		res.status(400).json(errors);
	}
})

module.exports = router;
