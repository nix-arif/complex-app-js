const User = require("../models/User");

exports.login = (req, res) => {
  const user = new User(req.body);
  console.log(user);
  user
    .login()
    .then((user) => {
      req.session.user = user;
      res.send("Successfully login");
    })
    .catch((error) => res.send(error));
};

exports.logout = (req, res) => {};

exports.register = (req, res) => {
  const user = new User(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("Thanks for register");
  }
};

exports.home = (req, res) => {
  if (req.session.user) {
    res.send("You are login");
  } else {
    res.render("home-guest");
  }
};
