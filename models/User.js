const userCollection = require("../db").collection("users");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (typeof this.data.username !== "string") {
    this.data.username = "";
  }
  if (typeof this.data.email !== "string") {
    this.data.email = "";
  }
  if (typeof this.data.password !== "string") {
    this.data.password = "";
  }

  this.data = {
    username: this.data.username,
    email: this.data.email,
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  if (this.data.username === "") {
    this.errors.push("Please enter your username");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("Please enter a valid email address");
  }
  if (this.data.password === "") {
    this.errors.push("Please enter a password");
  }

  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("Username must be at least 3 characters");
  }
  if (!validator.isAlphaNumeric(this.data.username)) {
    this.errors.push("Username must only contains letters and numbers");
  }
  if (this.data.password.length > 0 && this.data.password.length < 6) {
    this.errors.push("Password must be at least 6 characters");
  }
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
          resolve(attemptedUser);
        } else {
          reject("You are not authorised");
        }
      })
      .catch((error) => {
        reject("You are not authorised");
      });
  });
};

User.prototype.register = function () {
  this.cleanUp();
  this.validate();

  if (!this.errors.length) {
    const salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    userCollection.insertOne(this.data);
  }
};

module.exports = User;
