const express = require('express');
const passport = require('passport');

const router = express.Router();

const SecurityGroup = require('../../models/SecurityGroup');
const Page = require('../../models/Page');
const User = require('../../models/User');

const validateSecurityGroupsInput = require('../../validation/settings/security-groups');

/***
 * @type     CREATE
 * @method   POST
 * @route    /api/groups/create
 * @desc     CREATE a single group to add to the all available groups in the database
 * @access   Private
 ***/
router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = validateSecurityGroupsInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		const groupInput = {name, description} = req.body;

		//CHECK NAME EXISTS IN DATABSE
		SecurityGroup.findOne({name: groupInput.name})
		.then(group => {
			if (group) { //Group Name Exists Error
				errors.groupexists = 'Group with same name already exists.';
				res.status(400).json(errors);
			} else {
				group = new SecurityGroup(groupInput);
				group.save()
				.then(group => {
					res.json(group);
				}).catch(() => {
					errors.query = 'Failed to create new group.';
					res.status(400).json(errors);
				})
			}
		})
		.catch(() => {
			errors.query = 'Failed to check group name exists.';
			res.status(400).json(errors);
		})

	}
});

/***
 * @type     READ
 * @method   GET
 * @route    /api/groups/:id
 * @desc     READ a single group from all available groups in the database
 * @access   Private
 ***/
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
	const id = req.params.id;
	SecurityGroup.findById(id)
	.then(group => {
		if (group) {

			res.json(group);
		} else {
			return res.status(404).json({'errors': {'nogroup': `Security group with id  ${id} not found available.`}});
		}
	}).catch(() => {
		res.status(400).json({'errors': {'query': 'Failed to get group please try again.'}});
	})
});

/***
 * @type     READ
 * @method   GET
 * @route    /api/groups/pages/:id
 * @desc     READ a single group pages from all available groups in the database
 * @access   Private
 ***/
router.get('/pages/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
	const id = req.params.id;
	Page.find({'groups': {$all: {'_id': id}}})
	.then(pages => {
		if (pages) {
			res.json(pages);
		} else {
			return res.status(404).json({'errors': {'nogroup': `Security group with id  ${id} not found available.`}});
		}
	}).catch(() => {
		res.status(400).json({'errors': {'query': 'Failed to get group please try again.'}});
	})
});

/***
 * @type     READ
 * @method   GET
 * @route    /api/groups/users/:id
 * @desc     READ a single group users from all available groups in the database
 * @access   Private
 ***/
router.get('/users/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
	const id = req.params.id;
	User.find({'groups': {$all: {'_id': id}}})
	.then(users => {
		if (users) {
			res.json(users);
		} else {
			return res.status(404).json({'errors': {'nousers': `There are no users in this group`}});
		}
	}).catch(() => {
		res.status(400).json({'errors': {'query': 'Failed to get users for this group please try again.'}});
	})
});

/***
 * @type     READ
 * @method   GET
 * @route    /api/groups/
 * @desc     READ the list of all available groups in the database
 * @access   Private
 ***/
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	SecurityGroup.find()
	.then(groups => {
		res.json(groups);
	}).catch(() => {
		res.status(400).json({'errors': {'query': 'Failed to get group please try again.'}});
	})
});

/***
 * @type     UPDATE
 * @method   POST
 * @route    /api/groups/edit/:id
 * @desc     Update a group using id
 * @access   Private
 ***/
router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = validateSecurityGroupsInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	} else {
		const groupInput = {name, description} = req.body;
		const id = req.params.id;
		//CHECK NAME EXISTS IN DATABSE
		SecurityGroup.findById(id)
		.then(group => {
			group.name = groupInput.name;
			group.description = groupInput.description;

			//TODO : MAKE FUNCTION BELOW MORE EFFICIENT
			SecurityGroup.findOne({name: groupInput.name})
			.then(groupCheck => { //CHECK FOR OTHER GROUPS WITH SAME NAME AS NEW NAME
				if (groupCheck) { //YES THERE IS A GROUP THAT HAS THE SAME NAME
					if (groupCheck.id === group.id) { //THE GROUP TO CHECK IS THE SAME AS THE CURRENT GROUP --- IGNORE AND UPDATE
						//UPDATE GROUP
						group.save()
						.then(group => {
							res.json(group);
						}).catch(() => {
							errors.query = 'Failed to update group';
							return res.status(400).json(errors)
						})
					} else { //NOTIFY USER AND DO NOT UPDATE
						errors.query = 'Group with the same name already exists, Please change the group name and try again';
						return res.status(400).json(errors)
					}
				} else { // NO OTHER GROUPS WITH SAME NAME EXISTS JUST SAVE
					group.save()
					.then(group => {
						res.json(group);
					}).catch(() => {
						errors.query = 'Failed to update group';
						return res.status(400).json(errors)
					})
				}

			}).catch(() => {
				errors.query = 'Failed to check group name exists';
				return res.status(400).json(errors)
			})
		})
		.catch(() => {
			errors.query = `Failed to find group with id ${id}`;
			res.status(400).json(errors);
		})

	}
});

/***
 * @type     DELETE
 * @method   DELETE
 * @route    /api/groups/delete/:id
 * @desc     Delete a group using id
 * @access   Private
 ***/
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
	const id = req.params.id;

	//FIND ALL USERS WITH THE SECURITY GROUP AND REMOVE THEM
	User.find({'groups': {$all: {'_id': id}}})
	.then(users => {
		//FOR EACH OF THE USERS REMOVE THE GROUP FROM THEIR LIST
		users.forEach(function (user) {
			resource_id = user.id;
			User.findByIdAndUpdate(resource_id,
				{$pull: {groups: id}},
				{safe: true, upsert: true})
			.then( () => {return;})
			.catch(() => {
				return res.status(400).json({'errors': {'query': 'Failed to remove user from group.'}})
			});
		});
		//END FOR EACH

		//FIND ALL PAGES WITH THE SECURITY GROUP AND REMOVE THEM
		Page.find({'groups': {$all: {'_id': id}}})
		.then(pages => {
			//FOR EACH OF THE USERS REMOVE THE GROUP FROM THEIR LIST
			pages.forEach(function (page) {
				resource_id = page.id;
				Page.findByIdAndUpdate(resource_id,
					{$pull: {groups: id}},
					{safe: true, upsert: true})
				.then(() => {
					return;
				})
				.catch(() => {
					return res.status(400).json({'errors': {'query': 'Failed to remove page from group.'}})
				});
			});

			//TODO: FIND ALL OBJECTS WITH THE SECURITY GROUP AND REMOVE THEM

			//REMOVE THE SECURITY GROUP
			SecurityGroup.findByIdAndDelete(id)
			.then(() => {
				res.json('security group removed successfully.')
			})
			.catch(() => {res.status(400).json({'errors': {'query': 'Failed to delete group'}})})

		})


		}).catch(() => {
			res.status(400).json({'errors': {'query': 'Failed to get users for this group please try again.'}});
		});
	});

	/***
	 * @type     CREATE
	 * @method   POST
	 * @route    /api/groups/resource/:id
	 * @desc     Add Pages, Objects and Users to a group using id
	 * @access   Private
	 ***/
	router.post('/resources/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
		const id = req.params.id;
		const {type, resource_id} = req.body;

		if (type === 'pages') {
			Page.findByIdAndUpdate(resource_id,
				{$addToSet: {groups: id}},
				{safe: true, upsert: true}
			)
			.then(page => {
				return res.json(page)
			})
			.catch(() => {
				res.status(400).json({'errors': {'query': 'Failed to add page group'}})
			});
		} else
			if (type === 'users') {
				User.findByIdAndUpdate(resource_id,
					{$addToSet: {groups: id}},
					{safe: true, upsert: true}
				)
				.then(page => {
					return res.json(page)
				})
				.catch(() => {
					res.status(400).json({'errors': {'query': 'Failed to add page group'}})
				});
			} else {
				res.status(400).json({'errors': {'query': 'Failed adding resource to group'}})
			}

	});

	/***
	 * @type     DELETE
	 * @method   DELETE
	 * @route    /api/groups/resource/:type/:group_id/:resource_id
	 * @desc     Delete a resource from group using id
	 * @access   Private
	 ***/
	router.delete('/resources/:type/:group_id/:resource_id', passport.authenticate('jwt', {session: false}), (req, res) => {
		const {group_id, type, resource_id} = req.params;

		if (type === 'pages') {
			Page.findByIdAndUpdate(resource_id,
				{$pull: {groups: group_id}},
				{safe: true, upsert: true}
			)
			.then(page => {
				return res.json(page)
			})
			.catch(() => {
				res.status(400).json({'errors': {'query': 'Failed to remove page from group.'}})
			});
		} else
			if (type === 'users') {
				User.findByIdAndUpdate(resource_id,
					{$pull: {groups: group_id}},
					{safe: true, upsert: true})
				.then(group => {
					return res.json(group)
				})
				.catch(() => {
					res.status(400).json({'errors': {'query': 'Failed to remove users from group.'}})
				});
			} else {
				res.status(400).json({'errors': {'query': 'Failed adding resource to group'}})
			}
	});

	module.exports = router;
