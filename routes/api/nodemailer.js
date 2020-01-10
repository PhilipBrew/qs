const isEmpty = require("../../validation/isEmpty");
const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const Settings = require('../../models/Settings');

const Cryptr = require('cryptr');
const keys = require('../../config/keys');
const cryptr = new Cryptr(keys.cryptr);

router.post('/', (req, res) => {
	Settings.findOne()
	        .then(settings => {
		        let smtp = settings.email;

		        if (
			        !isEmpty(smtp.port) &&
			        !isEmpty(smtp.secure) &&
			        !isEmpty(smtp.host) &&
			        !isEmpty(smtp.username) &&
			        !isEmpty(smtp.password)
		        ) {

			        let transporter =
				        nodemailer
					        .createTransport(
						        {
							        host  : smtp.host,
							        port  : parseInt(smtp.port),
							        secure: (smtp.secure.toLowerCase() === 'yes') ? true : false, // true for 465, false for other ports
							        auth  : {
								        user: smtp.username,
								        pass: cryptr.decrypt(smtp.password)
							        }
						        });


			        // setup email data with unicode symbols
			        let mailOptions = {
				        from   : !isEmpty(smtp.sender) ? smtp.sender : smtp.username, // sender address
				        to     : req.body.emailTo, // list of receivers
				        subject: req.body.subject, // Subject line
				        text   : req.body.message, // plain text body
				        // html   : "<b>Hello world?</b>" // html body
			        };

			        // send mail with defined transport object
			        transporter.sendMail(mailOptions).then(info => {
				        res.json(info);
			        }).catch(() => {
				        res.status(400).json({email : 'Unknown error ! email not send.'})
			        })

		        }else{
		        	res.status(400).json({smtp : 'some missing smtp details.'})
		        }
	        })

});
module.exports = router;
