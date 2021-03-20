const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const ejs = require("ejs");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const CategoryLink = require("./models/Categorylink");

//Load Config
dotenv.config({ path: "./config/config.env" });

//Passport config
require("./passport/passport")(passport);

require("./db/dbconnect");

const app = express();

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method Override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.set("view engine", "ejs");

//Sessions
app.use(
  session({
    secret: `${process.env.sessionsecret}`,
    resave: false,
    saveUninitialized: false,
    maxAge: 24 * 60 * 60 * 1000 * 10,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    unset: "destroy",
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Static files
app.use(express.static('public'))

const port = process.env.PORT || 5000;

//Routers
app.use("/",require("./routes/index"));

app.use('/auth',require('./routes/auth'))

app.use("/links", require("./routes/links"));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
