const User = require("../models/User");

exports.login = (req, res) => {
  const user = new User(req.body);
  user
    .login()
    .then(() => {
      console.log(user);
      req.session.user = { username: user.data.username };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch((error) => {
      res.send(error.message);
    });
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
    res.render("home-dashboard", { username: req.session.user.username });
  } else {
    res.render("home-guest");
  }
};
