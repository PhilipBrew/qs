const isEmpty = require("../../validation/isEmpty");
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const validator =  require('validator');

const passport = require('passport');
const fs = require('fs');
const https = require('https');

const router = express.Router();
const nodemailer = require("nodemailer");
const Settings = require('../../models/Settings');
const randomstring = require('randomstring');
const Cryptr = require('cryptr');
const keys = require('../../config/keys');
const cryptr = new Cryptr(keys.cryptr);

const certKeyFile = __dirname + '/client_key.pem';
const certKey = fs.readFileSync(certKeyFile);
const certFile = __dirname + '/client.pem';
const key = keys.secretKey;

//LOAD USER MODEL
const User = require('../../models/User');

//LOAD SERVER DETAILS SCHEMA
const QsServerDetails = require('../../models/QSServer');

//LOAD INPUT VALIDATION
const validateCreateUserInput = require('../../validation/users/user');
const validateUpdateUserInput = require('../../validation/users/userUpdate');
const validatePasswordInput = require('../../validation/users/password');
const validateLoginInput = require('../../validation/users/login');

/***
 * @route    POST api/users/register
 * @desc     Register Users
 * @access   Public
 ***/
router.post('/register', (req, res) => {
	// Validate Input Fields
	const {errors, isValid} = validateCreateUserInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		let role = 'User';
		let qsId = req.body.qsId;
		let active = false;
		let email_verified = false;
		const email = req.body.email;
		const name = req.body.name;
		const directory = req.body.directory;
		const password = req.body.password;

		//check for existing Admin User
		//Okay maybe this is sill
		/*User
		 .countDocuments({role: 'Admin'})
		 .then(userscount => {
		 if (userscount > 0) {
		 role = '';
		 } else {
		 role = 'Admin'
		 }
		 */
		//check database for email
		User.findOne({email})
		.then(user => {
			if (user) { //Email already exists throw error
				errors.email = 'User account already exists';
				return res.status(400).json(errors);
			} else { //Email does not exist register user

				//create new user from submitted details
				const newUser =
					      new User(
						      {
							      email,
							      role,
							      active,
							      name,
							      qsId,
							      directory,
							      password,
							      email_verified
						      });

				//generate password hash and save user
				bcrypt.genSalt(10, (err, salt) => {
					if (err) {
						errors.flash = 'Unknown Error please contact administrator.';
						errors.err = err;
						res.status(400).json(errors);
					} else {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) {
								errors.flash = 'Unknown Error please contact administrator.';
								errors.err = err;
								res.status(400).json(errors);
							} else {
								newUser.password = hash;
								newUser
								.save()
								.then(user => {return res.json(user)})
								.catch(err => {return res.status(400).json(err)});
							}
						})
					}
				});
			}
		}).catch((err) => {
			errors.flash = 'Failed to check if users already exists';
			res.status(400).json(errors);  //failed to execute findOne user
		});
		// })

	}
});

/***
 * @route    POST api/users/login
 * @desc     Login a User to the Platform / Returning the JWT
 * @access   Public
 ***/
router.post('/login', (req, res) => {

	//Validate Input Fields
	const {errors, isValid} = validateLoginInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		const email = req.body.email;
		const password = req.body.password;

		User.findOne({email})
		.then((user) => {
			if (user) {
				//check password
				bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						//User matched

						//Create JWT Payload
						const payload = {
							userId : user.qsId,
							userDir: user.directory,
							id     : user.id,
							name   : user.name,
							role   : user.role
						};

						//assign token
						jwt.sign(
							payload,
							key,
							{expiresIn: 3600},
							(err, token) => {

								res.json({
									success: true,
									token  : 'Bearer ' + token
								})
							});
					} else {
						errors.password = 'Incorrect password or username';
						return res.status(400).json(errors);
					}
				})
			} else {
				errors.email = 'Account not found';
				return res.status(404).json(errors);
			}
		})
		.catch(err => {
		})
	}
});

router.post('/update-token', passport.authenticate('jwt', {session: false}), (req, res) => {
	const user = req.user;
	const oldToken = req.body.token;

	//decode token and get user info and exp
	const decoded = jwt_decode(oldToken);

	//check for expired token
	const currentTime = Date.now() / 1000;

	if (decoded.exp > currentTime) {
		const payload = {
			userId : user.qsId,
			userDir: user.directory,
			id     : user.id,
			name   : user.name,
			role   : user.role
		};

		//assign token
		jwt.sign(
			payload,
			key,
			{expiresIn: 360000},
			(err, token) => {
				res.json({
					success: true,
					token  : 'Bearer ' + token,
				})
		});

	}
});

/***
 * @route    POST api/users/postman-login
 * @desc     Login a User to the Platform / Returning the JWT
 * @access   Public
 ***/
router.post('/postman-login', (req, res) => {

	//Validate Input Fields
	const {errors, isValid} = validateLoginInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		const email = req.body.email;
		const password = req.body.password;

		User.findOne({email})
		.then((user) => {
			if (user) {
				//check password
				bcrypt.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						//User matched

						//Create JWT Payload
						const payload = {
							userId : user.qsId,
							userDir: user.directory,
							id     : user.id,
							name   : user.name,
							role   : user.role
						};

						//assign token
						jwt.sign(
							payload,
							key,
							{expiresIn: 360000},
							(err, token) => {

								res.json({
									success: true,
									token  : 'Bearer ' + token
								})
							});
					} else {
						errors.password = 'Incorrect password or username';
						return res.status(400).json(errors);
					}
				})
			} else {
				errors.email = 'Account not found';
				return res.status(404).json(errors);
			}
		})
		.catch(err => {
		})
	}
});

/***
 * @route    POST api/users/login
 * @desc     Login a User to the Platform / Returning the JWT
 * @access   Public
 ***/
router.post('/qlik-node-sso', passport.authenticate('jwt', {session: false}), (req, res) => {
	QsServerDetails
	.findOne()
	.then(details => {
		if (details) { //SEVER EXISTS : RETURN DETAILS

			const qHostname = details.hostname;
			// const qHostname = '34.241.100.71';
			const qPort = 4243;
			const qProxy = isEmpty(details.prefix) ? '/' : `/${details.prefix}/`;
			const xrfKey = 'qwertyuiopasdfgh';
			const endpoint = '/qps' + qProxy + 'ticket?';
			const xQlikUserName = 'sa_repository';
			const xQlikUserDir = 'Internal';

			const profile = {
				'UserDirectory': req.body.userDir,
				'UserId'       : req.body.userId,
				'Groups'       : []
			};

			const options = {
				hostname          : qHostname,
				port              : qPort,
				path              : endpoint + 'xrfkey=' + xrfKey, method: 'POST',
				headers           : {
					'x-qlik-xrfkey'              : xrfKey,
					'X-Qlik-User'                : 'UserDirectory=' + xQlikUserDir + '; UserId= ' + xQlikUserName,
					'Content-Type'               : 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				key               : fs.readFileSync(certKeyFile), cert: fs.readFileSync(certFile),
				rejectUnauthorized: false
			};

			// Set up the request
			const post_req = https.request(options, function (response) {
				response.setEncoding('utf8');
				response.on('data', function (chunk) {
					if (chunk) {
						try {
							qTicket = JSON.parse(chunk).Ticket;
							res.json({qTicket});
						} catch (e) {
							return res.status(400).json(e);
						}
					}
				});
			});

			// post the data
			post_req.write(JSON.stringify(profile));

			post_req.on('error', (e) => {
				res.status(400).json(e);
			});

			post_req.end();

		} else {      //SERVER DOES NOT EXIST : RETURN 404 ERROR
			res.status(404).json({message: 'Server details not found. Create a new Qlik Sense Server.'});
		}
	}).catch(err => {res.status(400).json(err.response.data)});
})

router.get('/jwt', passport.authenticate('jwt', {session: false}), (req, res) => {
	User.findById(req.user.id)
	.then(user => {
		//Create JWT Payload

		const payload = {
			userId : user.qsId,
			userDir: user.directory,
			id     : user.id,
			name   : user.name,
		};
		//assign token
		jwt.sign(
			payload,
			certKey,
			{
				algorithm: "RS256",
				expiresIn: 43200
			},
			(err, token) => {
				res.json({
					success: true,
					token  : 'Bearer ' + token
				})
			});
	}).catch(err => {return res.status(400).json(err)});
});

/**
 * @route   GET api/users
 * @desc    Get users for current company hassed on the user currently logged in
 * @type    {Router|router}
 * @access  Private
 **/
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	User.find()
	.then(users => res.json(users))
	.catch(err => res.status(400).json(err));
});

/***
 * @route    GET api/users/current
 * @desc     Return current user
 * @access   Public
 ***/
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
	User.findById(req.user.id)
	.then(user => {
		res.json(user);
	}).catch(err => {
		return res.status(400).json(err)
	});
});

/***
 * @route    GET api/users/current
 * @desc     Return current user
 * @access   Public
 ***/
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
	User.findById(req.params.id)
	.populate('groups', ['_id', 'name'])
	.then(user => {
		res.json(user);
	}).catch(err => {
		return res.status(400).json(err)
	});
});

/***
 * @route    POST api/users/edit/:id
 * @desc     Return edit user by id
 * @access   private
 ***/
router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = validateUpdateUserInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		User.findById(req.params.id)
		.then(user => {
			user.name = req.body.name;
			user.email = req.body.email;
			user.qsId = req.body.qsId;
			user.role = req.body.role;
			user.directory = req.body.directory;

			user.save()
			.then(user => {
				res.json(user);
			})
			.catch(err => {
				return res.status(400).json(err)
			});
		}).catch(err => {
			return res.status(400).json(err)
		});
	}
});

/***
 * @route    POST api/users/change-password
 * @desc     Return change the current users password
 * @access   Public
 ***/
router.post('/change-password', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = validatePasswordInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		User.findById(req.user.id)
		.then(user => {

			const {password, newPassword} = req.body;

			//check password
			bcrypt.compare(password, user.password)
			.then(isMatch => {
				if (isMatch) {
					//generate password hash and save user
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newPassword, salt, (err, hash) => {
							if (err) {
								throw err;
							}
							user.password = hash;
							user
							.save()
							.then(user => res.json(user))
							.catch(err => {return res.status(400).json(err)});
						});
					});

				}
			}).catch(err => {
				errors.invalidPassword = 'Invalid current password, please check and try again';
				return res.status(400).json(errors);
			})

		}).catch(err => {
			return res.status(400).json(err)
		});
	}
});

/***
 * @route    POST api/users/change-password
 * @desc     Return change the current users password
 * @access   Public
 ***/
router.post('/new-password-with-token', (req, res) => {

	const {errors, isValid} = validatePasswordInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	} else {

		User.findOne({email: req.body.email})
		.then(user => {
			if (user) {
				const {password, newPassword} = req.body;
				const userToken = user.changePasswordRequest.token;

				if (password === userToken) {
					//TODO : CHECK IF TOKEN HAS EXPIRED

					//generate password hash and save user
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newPassword, salt, (err, hash) => {
							if (err) {
								throw err;
							} else {
								//SET NEW PASSWORD
								user.password = hash;
								//CLEAR TOKEN AND DATE
								user.changePasswordRequest.token = null;
								user.changePasswordRequest.date = null;

								user
								.save()
								.then(user => res.json(user))
								.catch(err => {return res.status(400).json(err)});
							}
						});
					})
				} else {
					errors.token = 'Password reset failed, request password for a new change email';
					return res.status(400).json(errors);
				}
			} else {
				errors.email = 'Invalid email address! please check email and try again.';
				return res.status(400).json(errors);
			}

		}).catch(err => {
			return res.status(400).json(err)
		});
	}

});

router.post('/forgot-password-email', (req, res) => {
	let errors = {};

	if (isEmpty(req.body.email) || req.body.email === undefined) {
		errors.email = 'Email Address is Required';
		res.status(400).json(errors);
		// res.json('success');
	} else {
		if(!validator.isEmail(req.body.email)){
			errors.email = 'Invalid Email Address';
			res.status(400).json(errors);

		}else {
			Settings.findOne()
			.then(settings => {
				if (!settings) {
					res.json('success')
				} else {
					let smtp = settings.email;

					if (
						!isEmpty(smtp.port) &&
						!isEmpty(smtp.secure) &&
						!isEmpty(smtp.host) &&
						!isEmpty(smtp.username) &&
						!isEmpty(smtp.password)
					) {

						let transporter = nodemailer
						.createTransport(
							{
								host  : smtp.host,
								port  : parseInt(smtp.port),
								secure: (smtp.secure.toLowerCase() === 'yes') ? true : false, // true for 465,
							                                                                  // false for
							                                                                  // other ports
								auth  : {
									user: smtp.username,
									pass: cryptr.decrypt(smtp.password)
								}
							});

						User.findOne({email: req.body.email})
						.then(user => {

							const token = randomstring.generate();
							user.changePasswordRequest.token = token;

							const host = req.body.baseUrl;

							user.save()
							.then(user => {
								const email_html = `<b>Hi ${user.name} <br /></b>
									<p>You have requested a password change for the portal. Use the link below to reset your password. </p>
									<a href="${host}/users/new-password/${user.changePasswordRequest.token}">Reset Password</a>`;

								// TODO setup email data with unicode symbols
								let mailOptions = {
									from   : !isEmpty(smtp.sender) ? smtp.sender : smtp.username, // sender address
									to     : user.email, // list of receivers
									subject: 'Password Reset', // Subject line
									//text   : user.toString(), // plain text body
									html   : email_html // html body
								};

								// send mail with defined transport object
								transporter.sendMail(mailOptions).then(info => {
									res.json('success');
								}).catch(() => {
									errors.email = 'Internal Server Error : Failed to send reset password email. ';
									res.status(500).json(errors);
								})
							})
						}).catch(() => {
							// errors.email = 'User account does not exist.';
							// res.status(404).json(errors);
							res.json('success');
						})
					} else {
						errors.email = 'Internal Server Error : Failed to send reset password email. ';
						res.status(500).json(errors);
					}
				}
			})
		}
	}

});

router.post('/test-html-email', (req, res) => {
	let errors = {};

	if (isEmpty(req.body.email) || req.body.email === undefined) {
		errors.email = 'Email Address is Required';
		res.status(400).json(errors);
	} else {
		Settings.findOne()
		.then(settings => {
			if (!settings) {
				res.status(400).json({'errors': {'email': 'Email server details not set. Password can not be reset'}})
			} else {
				let smtp = settings.email;

				if (
					!isEmpty(smtp.port) &&
					!isEmpty(smtp.secure) &&
					!isEmpty(smtp.host) &&
					!isEmpty(smtp.username) &&
					!isEmpty(smtp.password)
				) {

					let transporter = nodemailer
					.createTransport(
						{
							host  : smtp.host,
							port  : parseInt(smtp.port),
							secure: (smtp.secure.toLowerCase() === 'yes') ? true : false, // true for 465,
						                                                                  // false for
						                                                                  // other ports
							auth  : {
								user: smtp.username,
								pass: cryptr.decrypt(smtp.password)
							}
						});

					User.findOne({email: req.body.email})
					.then(user => {

						const token = randomstring.generate();
						user.changePasswordRequest.token = token;

						const host = req.body.baseUrl;

						user.save()
						.then(user => {
							// const email_html = `<b>Hi ${user.name} <br /></b>
							{/*<p>You have requested a password change for the portal. Use the link below to reset your password. </p>*/
							}
							{/*<a href="${host}/users/new-password/${user.changePasswordRequest.token}">Reset Password</a>`;*/
							}

							const email_html = ` <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" />
<title>Nimce</title>

<style type="text/css">

body{width:100%;margin:0px;padding:0px;background:#222222;text-align:center; -webkit-font-smoothing: antialiased;mso-margin-top-alt:0px; mso-margin-bottom-alt:0px; mso-padding-alt: 0px 0px 0px 0px;}
html{width: 100%; }
img {border:0px;text-decoration:none;display:block; outline:none;}
a,a:hover{text-decoration:none;}.ReadMsgBody{width: 100%; background-color: #ffffff;}.ExternalClass{width: 100%; background-color: #ffffff;}
table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
p,h1,h2,h3,h4{margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0;}
.main-bg{ background:#323030;}
.footer-border{border-top: solid 1px #f5666e; }


@media only screen and (max-width:640px)

{
\tbody{width:auto!important;}
\ttable[class=main] {width:440px !important;}
\ttable[class=inner-part]{width:400px !important;}
\ttable[class=inner-full]{width:100% !important;}
\ttable[class=inner-center]{width:400px !important; text-align:center;}
\ttable[class=inner-service]{width:80% !important;}
\t.alaine{ text-align:center;}

\t}

@media only screen and (max-width:479px)
{
\tbody{width:auto!important;}
\ttable[class=main] {width:280px !important;}
\ttable[class=inner-part]{width:260px !important;}
\ttable[class=inner-full]{width:100% !important;}
\ttable[class=inner-center]{width:260px !important; text-align:center;}
\ttable[class=inner-service]{width:185px !important;}
\t.alaine{ text-align:center;}


}


</style></head><body>



<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" id="backgroundTable" module="Menu">
      <tbody><tr>
        <td align="center" valign="top">

        <table width="650" border="0" align="center" cellpadding="0" cellspacing="0" class="main">
          <tbody><tr>
            <td height="60" align="left" valign="top">&nbsp;</td>
          </tr>
        </tbody></table>

        </td>
      </tr>
    </tbody></table>


<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" id="backgroundTable" module="Menu">
      <tbody><tr>
        <td align="center" valign="top">

        <table width="650" border="0" align="center" cellpadding="0" cellspacing="0" class="main">
          <tbody><tr>
            <td align="left" valign="top"><img src="images/header-top-image.png" width="650" height="37" alt="" style="display:block;width:100% !important; height:auto !important; "></td>
          </tr>
        </tbody></table>

        </td>
      </tr>
    </tbody></table>

<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" id="backgroundTable" module="Menu">
      <tbody><tr>
        <td align="center" valign="top">

        <table width="650" border="0" align="center" cellpadding="0" cellspacing="0" class="main">
          <tbody><tr>
            <td align="left" valign="top" bgcolor="#FFFFFF" style="background:#FFF;"><table border="0" align="center" cellpadding="0" cellspacing="0" class="imageUpload">
              <tbody><tr>
                <td height="25" align="center" valign="top">&nbsp;</td>
              </tr>
              <tr>
                <td align="center" valign="top" style="position: relative;">


<a href="#"><img class="imgUp" src="images/logo.png" width="140" height="48" alt=""></a>


</td>
              </tr>
              <tr>
                <td height="25" align="center" valign="top">&nbsp;</td>
              </tr>
            </tbody></table>
              </td>
          </tr>
        </tbody></table>

        </td>
      </tr>
    </tbody></table>

<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" id="backgroundTable" module="Menu">
      <tbody><tr>
        <td align="center" valign="top">

        <table width="650" border="0" align="center" cellpadding="0" cellspacing="0" class="main">
          <tbody><tr>
            <td align="left" valign="top" bgcolor="#FFFFFF" style="background:#FFF;"><table width="525" border="0" align="center" cellpadding="0" cellspacing="0" class="inner-part">
              <tbody><tr>
                <td height="72" align="center" valign="top">&nbsp;</td>
              </tr>
              <tr>
                <td align="center" valign="top"><table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                  <tbody><tr>
                    <td align="center" valign="top" style="font: 28px Arial, Helvetica, sans-serif; color: rgb(104, 102, 102); padding-bottom: 12px; position: relative;" class="editor mce-content-body" id="mce_6"><p>we are created design Recipes</p></td>
                  </tr>
                  <tr>
                    <td align="center" valign="top" style="font: 13px/22px Arial, Helvetica, sans-serif; color: rgb(135, 135, 135); position: relative;" class="editor mce-content-body" id="mce_7"><p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humoureven slightly believable.</p></td>
                  </tr>
                  <tr>
                    <td align="center" valign="top"><table width="165" border="0" align="center" cellpadding="0" cellspacing="0">
                      <tbody><tr>
                        <td width="99" align="center" valign="top">&nbsp;</td>
                      </tr>
                      <tr>
                        <td height="40" align="center" valign="middle" bgcolor="#e74c3c" style="background: rgb(242, 155, 42); font: 16px Arial, Helvetica, sans-serif; color: rgb(255, 255, 255); text-transform: uppercase; position: relative;" class="editor inner-bgcolor mce-content-body" id="mce_8"><p><a style="color:#FFF; text-decoration:none;" href="#" data-mce-href="#" data-mce-style="color: #fff; text-decoration: none;">Learn More</a></p></td>
                      </tr>
                    </tbody></table></td>
                  </tr>
                </tbody></table></td>
              </tr>
            </tbody></table></td>
          </tr>
        </tbody></table>

        </td>
      </tr>
    </tbody></table>

<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" id="backgroundTable" module="Menu">
      <tbody><tr>
        <td align="center" valign="top">

        <table width="650" border="0" align="center" cellpadding="0" cellspacing="0" class="main">
          <tbody><tr>
            <td height="50" align="left" valign="top" bgcolor="#FFFFFF" style="background:#FFF; border-bottom:#eae9e9 solid 1px;">&nbsp;</td>
          </tr>
        </tbody></table>

        </td>
      </tr>
    </tbody></table>

<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" id="backgroundTable" module="Menu">
      <tbody><tr>
        <td align="center" valign="top">

        <table width="650" border="0" align="center" cellpadding="0" cellspacing="0" class="main">
          <tbody><tr>
            <td align="left" valign="top" bgcolor="#040404" style="background:#444444;"><table width="80%" border="0" align="center" cellpadding="0" cellspacing="0">
              <tbody><tr>
                <td height="25" align="center" valign="top">&nbsp;</td>
              </tr>
              <tr>
                <td align="center" valign="top" style="font: bold 12px Arial, Helvetica, sans-serif; color: rgb(255, 255, 255); padding-bottom: 8px; position: relative;" class="editor mce-content-body" id="mce_74"><p>Copyright © 2014 Nimce. All Rights Reserved.</p></td>
              </tr>
              <tr>
                <td align="center" valign="top" style="font: bold 12px Arial, Helvetica, sans-serif; color: rgb(255, 255, 255);  padding-bottom: 20px; position: relative;" class="editor mce-content-body" id="mce_75"><p>Support / unsubscribe</p></td>
              </tr>
            </tbody></table></td>
          </tr>
        </tbody></table>

        </td>
      </tr>
    </tbody></table>


<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" id="backgroundTable" module="Menu">
      <tbody><tr>
        <td align="center" valign="top">

        <table width="650" border="0" align="center" cellpadding="0" cellspacing="0" class="main">
          <tbody><tr>
            <td align="left" valign="top"><img src="images/header-bottom-image.png" width="650" height="37" alt="" style="display:block;width:100% !important; height:auto !important; "></td>
          </tr>
        </tbody></table>

        </td>
      </tr>
    </tbody></table>


<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" id="backgroundTable" module="Menu">
      <tbody><tr>
        <td align="center" valign="top">

        <table width="650" border="0" align="center" cellpadding="0" cellspacing="0" class="main">
          <tbody><tr>
            <td height="60" align="left" valign="top">&nbsp;</td>
          </tr>
        </tbody></table>

        </td>
      </tr>
    </tbody></table>

</body></html>
`;

							// TODO setup email data with unicode symbols
							let mailOptions = {
								from   : !isEmpty(smtp.sender) ? smtp.sender : smtp.username, // sender address
								to     : user.email, // list of receivers
								subject: 'Password Reset', // Subject line
								//text   : user.toString(), // plain text body
								html   : email_html // html body
							};

							// send mail with defined transport object
							transporter.sendMail(mailOptions).then(info => {
								res.json(info);
							}).catch(() => {
								errors.email = 'Failed to send send password reset email. ';
								res.status(400).json(errors);
							})
						})
					}).catch(() => {
						errors.email = 'User account does not exist.';
						res.status(404).json(errors);
					})
				} else {
					errors.email = 'Some missing smtp details.';
					res.status(400).json(errors);
				}
			}
		})
	}

});

router.post('/change-password-email', passport.authenticate('jwt', {session: false}), (req, res) => {
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

			let transporter = nodemailer
			.createTransport(
				{
					host  : smtp.host,
					port  : parseInt(smtp.port),
					secure: (smtp.secure.toLowerCase() === 'yes') ? true : false, // true for 465,
				                                                                  // false for
				                                                                  // other ports
					auth  : {
						user: smtp.username,
						pass: cryptr.decrypt(smtp.password)
					}
				});

			User.findById(req.body.userId)
			.then(user => {
				const token = randomstring.generate();
				user.changePasswordRequest.token = token;
				const host = req.body.baseUrl;

				user.save()
				.then(user => {
					const email_html = `<b>Hi ${user.name} <br /></b>
										<p>Your Portal Administrator ${req.user.name} is requiring you to change your password. </p>
										<a href="${host}/users/new-password/${user.changePasswordRequest.token}">Update Password</a>`;
					// setup email data with unicode symbols
					let mailOptions = {
						from   : !isEmpty(smtp.sender) ? smtp.sender : smtp.username, // sender address
						to     : req.body.mailTo, // list of receivers
						subject: 'Password Reset', // Subject line
						//text   : user.toString(), // plain text body
						html   : email_html // html body
					};

					// send mail with defined transport object
					transporter.sendMail(mailOptions).then(info => {
						res.json(info);
					}).catch(() => {
						res.status(400).json({errors: {email: 'Unknown error!!! Password reset email not send'}});
					})
				})
			}).catch(() => { res.status(404).json({errors: {email: 'Error getting user email.'}})});
		} else {
			res.status(400).json({smtp: 'some missing smtp details.'})
		}
	})
});

/***
 * @route    POST api/users/register
 * @desc     Create a New User under the current user's company
 * @access   Private
 ***/
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) => {
	//Validate Input Fields
	const {errors, isValid} = validateCreateUserInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		let role = req.body.role;
		let qsId = req.body.qsId;
		let active = true;
		let email_verified = false;
		const email = req.body.email;
		const name = req.body.name;
		const directory = req.body.directory;
		const password = req.body.password;
		//check database for email
		User.findOne({email})
		.then(user => {
			if (user) { //Email already exists throw error
				errors.email = 'User account already exists';
				return res.status(400).json(errors);
			} else { //Email does not exist register user

				//create new user from submitted details
				const newUser = new User({
					email,
					role,
					qsId,
					active,
					name,
					directory,
					password,
					email_verified
				});

				//generate password hash and save user
				bcrypt.genSalt(10, (err, salt) => {
					if (err) {
						throw err;
						console.log(err);
					} else {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) {
								throw err;
								console.log(err);
							} else {
								newUser.password = hash;
								newUser
								.save()
								.then(user => {return res.json(user)})
								.catch(err => {return res.status(400).json(err)});
							}
						})
					}
				})
			}
		}).catch((err) => {
			res.send(err);  //failed to execute findOne user
		});
	}
});

/***
 * @route    DELETE /api/users/:id
 * @desc     DELETE user by ID
 * @access   Private
 ***/
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
	const id = req.params.id;

	User.findByIdAndDelete(id)
	.then(user => {
		res.json(user)
	})
	.catch(err => {
		res.status(400).json(err)
	});
});

module.exports = router;
