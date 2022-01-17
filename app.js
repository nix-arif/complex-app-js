const express = require("express");
const session = require("express-session");
const router = require("./router");

const app = express();

let sessionOptions = session({
  secret: "AE Equipment",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

app.use(sessionOptions);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

app.use("/", router);

module.exports = app;
