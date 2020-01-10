const express = require('express');
const passport = require('passport');
const router = express.Router();

//LOAD USER MODEL
const Pages = require('../../models/Page');
const qsObjects = require('../../models/object');
const User = require('../../models/User');

//PAGE - OBJECT - INPUT VALIDATION
const validatePageInput = require('../../validation/pages/page');
const validateObjectInput = require('../../validation/pages/object');

/***
 * @route    GET /api/pages
 * @desc     List Available Pages
 * @access   Private
 ***/
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	Pages.find()
	.then(pages => {
		return res.json(pages)
	})
	.catch(err => {
		res.status(400).json(err)
	});
});

/***
 * @route    GET /api/pages
 * @desc     List Available Pages
 * @access   Private
 ***/
router.get('/secured', passport.authenticate('jwt', {session: false}), (req, res) => {
	async function run() {
		///================== GET THE CURRENT USER
		const UsersPromise = () => new Promise((resolve, reject) => {
			User.findById(req.user.id, function (err, data) {
				err ? reject(err) :
					resolve(data)
			})
		});

		///================= GET ALL PAGES
		const user = await UsersPromise();

		const UserPagesPromise = () => new Promise((resolve, reject) => {
			Pages.find({
				$or: [
					{'groups': {$in: user.groups}},
					{'groups': {$size: 0}}
				]
			}, function (err, pages) {
				err ?
					reject(err) :
					resolve(pages)
			}).sort({parent: 1})
		});

		const userPages = await UserPagesPromise();

		res.json(userPages)
	}

	run();

});

/***
 * @route    POST /api/pages/create
 * @desc     CREATE new Page
 * @access   Private
 ***/
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = validatePageInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		//GET FIELDS
		const data = req.body;
		const pageInputFields = {};
		pageInputFields.createdBy = req.user.id;

		if (data.title) {
			pageInputFields.title = data.title;
		}
		if (data.status) {
			pageInputFields.status = data.status;
		}
		if (data.description) {
			pageInputFields.description = data.description;
		}
		if (data.qsApp) {
			pageInputFields.qsApp = data.qsApp;
		}
		if (data.menu) {
			pageInputFields.menu = data.menu;
		}
		if (data.template) {
			pageInputFields.template = data.template;
		}
		if (data.parent) {
			pageInputFields.parent = data.parent;
		}else{
			pageInputFields.parent = '';
		}

		//SAVE PAGE
		new Pages(pageInputFields)
		.save()
		.then(page => {
			return res.json(page)
		})
		.catch(err => {
			return res.status(400).json(err);
		})
	}
});

/***
 * @route    GET /api/pages/:
 * @desc     READ Page by ID
 * @access   Private
 ***/
router.get('/:pageid', passport.authenticate('jwt', {session: false}), (req, res) => {
	const errors = {};
	const page_id = req.params.pageid;

	Pages.findById(page_id)
	.populate('groups', ['_id', 'name'])
	.then(page => {
		if (page) {
			return res.json(page);
		} else {
			errors.nopage = "Page not available";
			return res.status(404).json(errors);
		}
	})
	.catch(err => {
		return res.status(400).json(err);
	})
});

/***
 * @route    POST /api/pages/:pageid
 * @desc     UPDATE Page by ID
 * @access   Private
 ***/
router.post('/:pageid', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = validatePageInput(req.body);
	const page_id = req.params.pageid;
	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		//GET FIELDS
		const data = req.body;

		//GET PAGE BY ID
		Pages.findById(page_id)
		.then(page => {
			if (page) {
				if (data.title) {
					page.title = data.title;
				}
				if (data.status) {
					page.status = data.status;
				}
				if (data.description) {
					page.description = data.description;
				}
				if (data.qsApp) {
					page.qsApp = data.qsApp;
				} else {
					page.qsApp = ''
				}
				if (data.menu) {
					page.menu = data.menu;
				}
				if (data.template) {
					page.template = data.template;
				}
				if (data.parent) {
					page.parent = data.parent;
				} else {
					page.parent = '';
				}

				//SAVE PAGE
				page.save()
				.then(page => {
					return res.json(page)
				})
				.catch(err => {
					return res.status(400).json(err);
				});

			} else {
				errors.nopage = "Page not found";
				return res.status(404).json(errors);
			}

		})
	}
});

/***
 * @route    DELETE /api/pages/create
 * @desc     DELETE page by ID
 * @access   Private
 ***/
router.delete('/:pageid', passport.authenticate('jwt', {session: false}), (req, res) => {
	const page_id = req.params.pageid;
	qsObjects
	.deleteMany({page: page_id})
	.then(objects => {
		Pages.findByIdAndDelete(page_id)
		.then(page => {
			res.json({message: `page ${page.id} deleted successfully`})
		})
		.catch(err => {
			res.status(400).json(err)
		});

	})
});

/********************          PAGE OBJECTS       *****************************/

/***
 * @route    GET /api/pages/objects/:pageid
 * @desc     List all objects for a page
 * @access   Private
 ***/
router.get('/objects/:pageid', passport.authenticate('jwt', {session: false}), (req, res) => {
	const errors = {};
	const page_id = req.params.pageid;

	qsObjects.find({page: page_id})
	.then(objects => {
		if (objects && objects.length > 0) {
			return res.json(objects);
		} else {
			errors.noobjects = "There are no objects on this page.";
			return res.status(404).json(errors);
		}
	})
	.catch(err => {
		return res.status(400).json(err)
	});
});

/***
 * @route    POST /api/pages/objects/:pageid
 * @desc     CREATE new object for a page by id
 * @access   Private
 ***/
router.post('/objects/:pageid', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = validateObjectInput(req.body);
	const page_id = req.params.pageid;

	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		Pages.findById(page_id).then(page => { // Find Page
			if (page && page != null) { //Check Page Exists
				const objectInputFields = {
					qsId       : req.body.qsId,
					type       : req.body.type,
					app        : req.body.app,
					page       : page_id,
					title      : req.body.title,
					height     : req.body.height,
					width	   : req.body.width,	
					description: req.body.description
				};

				new qsObjects(objectInputFields)
				.save()
				.then(object => {
					return res.json(object)
				})
				.catch(err => {
					return res.status(400).json(err)
				});
			} else {
				errors.nopage = 'Page not found';
				return res.status(404).json(errors);
			}
		});
	}
});

/***
 * @route    GET /api/pages/objects/:pageid/:objectid
 * @desc     READ object by id and page id
 * @access   Private
 ***/
router.get('/objects/:pageid/:objectid', passport.authenticate('jwt', {session: false}), (req, res) => {
	const errors = {};
	const page_id = req.params.pageid;
	const object_id = req.params.objectid;

	//GET PAGE OBJECT
	Pages.findById(page_id)
	.then(page => {
		if (page && page !== null) {
			qsObjects.findById(object_id)
			.then(object => {
				if (object && object !== null) {
					return res.json(object);
				} else {
					errors.noobject = 'Object not found';
					return res.status(404).json();
				}
			}).catch(err => {
				errors.noobject = 'Object not found';
				return res.status(404).json(err)
			})
		} else {
			errors.nopage = 'Page not found';
			return res.status(404).json();
		}
	}).catch(err => {
		return res.status(400).json(err)
	});
});

/***
 * @route    POST /api/pages/objects/:pageid/:objectid
 * @desc     UPDATE object by id and page id
 * @access   Private
 ***/
router.post('/objects/:pageid/:objectid', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = validateObjectInput(req.body);
	const page_id = req.params.pageid;
	const object_id = req.params.objectid;

	if (!isValid) {
		return res.status(400).json(errors);
	} else {

		qsObjects
		.findById(object_id)
		.then(object => {
			object.qsId = req.body.qsId;

			object.type = req.body.type;
			object.title = req.body.title;
			object.height = req.body.height;
			object.width  = req.body.width;
			object.description = req.body.description;

			object.save()
			.then(object => {res.json(object)})
			.catch(err => {res.status(400).json(err)});

		}).catch(err => {res.status(404).json(err)})
	}
});

/***
 * @route    DELETE /api/pages/objects/:pageid
 * @desc     DELETE object from page by id
 * @access   Private
 ***/
router.delete('/objects/:pageid/:objectid', passport.authenticate('jwt', {session: false}), (req, res) => {
	const errors = {};
	const page_id = req.params.pageid;
	const object_id = req.params.objectid;

	//GET PAGE OBJECT
	Pages.findById(page_id)
	.then(page => {
		if (page && page != null) {

			qsObjects.findByIdAndDelete(object_id)
			.then(object => {res.json({message: `Object id ${object.id} deleted successfully`})})
			.catch(err => {res.status(400).json(err)});

		} else {
			errors.nopage = 'Page not found';
			return res.status(404).json();
		}
	}).catch(err => {
		return res.status(400).json(err)
	});
});
module.exports = router;
