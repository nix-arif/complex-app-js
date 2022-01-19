const User = require('../models/User');

exports.login = (req, res) => {
	const user = new User(req.body);
	user
		.login()
		.then(() => {
			req.session.user = {
				username: user.data.username,
				avatar: user.avatar,
			};
			req.session.save(function () {
				res.redirect('/');
			});
		})
		.catch((e) => {
			req.flash('errors', e);
			req.session.save(() => {
				res.redirect('/');
			});
		});
};

exports.logout = (req, res) => {
	req.session.destroy(function () {
		res.redirect('/');
	});
};

exports.register = (req, res) => {
	const user = new User(req.body);
	user
		.register()
		.then(() => {
			req.session.user = { username: user.data.username, avatar: user.avatar };
			req.session.save(() => {
				res.redirect('/');
			});
		})
		.catch((regErrors) => {
			req.flash('regErrors', regErrors);
			req.session.save(() => {
				res.redirect('/');
			});
		});
};

exports.home = (req, res) => {
	if (req.session.user) {
		res.render('home-dashboard', {
			username: req.session.user.username,
			avatar: req.session.user.avatar,
		});
	} else {
		res.render('home-guest', {
			errors: req.flash('errors'),
			regErrors: req.flash('regErrors'),
		});
	}
};
