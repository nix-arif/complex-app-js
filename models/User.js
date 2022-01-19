const userCollection = require('../db').db().collection('users');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const md5 = require('md5');

const User = function (data) {
	this.data = data;
	this.errors = [];
};

User.prototype.cleanUp = function () {
	if (typeof this.data.username !== 'string') {
		this.data.username = '';
	}
	if (typeof this.data.email !== 'string') {
		this.data.email = '';
	}
	if (typeof this.data.password !== 'string') {
		this.data.password = '';
	}

	this.data = {
		username: this.data.username,
		email: this.data.email,
		password: this.data.password,
	};
};

User.prototype.validate = function () {
	return new Promise(async (resolve, reject) => {
		if (this.data.username === '') {
			this.errors.push('Please enter your username');
		}
		if (!validator.isEmail(this.data.email)) {
			this.errors.push('Please enter a valid email address');
		}

		if (
			this.data.username !== '' &&
			!validator.isAlphanumeric(this.data.username)
		) {
			this.errors.push('Username must only contains letters and numbers');
		}

		if (this.data.password === '') {
			this.errors.push('Please enter a password');
		}

		if (this.data.username.length > 0 && this.data.username.length < 3) {
			this.errors.push('Username must be at least 3 characters');
		}

		if (this.data.username.length > 30) {
			this.errors.push('Password cannot exceed 30 characters');
		}

		if (this.data.password.length > 0 && this.data.password.length < 6) {
			this.errors.push('Password must be at least 6 characters');
		}

		if (this.data.password.length > 50) {
			this.errors.push('Password cannot exceed 50 characters');
		}

		if (
			this.data.username.length > 2 &&
			this.data.username.length < 31 &&
			validator.isAlphanumeric(this.data.username)
		) {
			let usernameExists = await userCollection.findOne({
				username: this.data.username,
			});
			if (usernameExists) {
				this.errors.push('That username is already exist');
			}
		}

		if (validator.isEmail(this.data.email)) {
			let emailExists = await userCollection.findOne({
				email: this.data.email,
			});
			if (emailExists) {
				this.errors.push('Email is already exists');
			}
		}
		resolve();
	});
};

User.prototype.login = function () {
	return new Promise((resolve, reject) => {
		this.cleanUp();
		userCollection
			.findOne({ username: this.data.username })
			.then((attemptedUser) => {
				if (
					attemptedUser &&
					bcrypt.compareSync(this.data.password, attemptedUser.password)
				) {
					this.data = attemptedUser;
					this.getAvatar();
					resolve('Congrat!!!');
				} else {
					reject('Invalid username / password');
				}
			})
			.catch((error) => {
				reject('Please try again later');
			});
	});
};

User.prototype.register = function () {
	return new Promise(async (resolve, reject) => {
		this.cleanUp();
		await this.validate();

		if (!this.errors.length) {
			const salt = bcrypt.genSaltSync(10);
			this.data.password = bcrypt.hashSync(this.data.password, salt);
			await userCollection.insertOne(this.data);
			this.getAvatar();
			resolve();
		} else {
			reject(this.errors);
		}
	});
};

User.prototype.getAvatar = function () {
	this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`;
};

module.exports = User;
