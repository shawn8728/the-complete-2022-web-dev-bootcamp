require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// const encrypt = require("mongoose-encryption");

/* md5 */
// const md5 = require("md5");

/* bcrypt */
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields: ["password"]});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("home");
});

app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })

  .post(function (req, res) {
    // const username = req.body.username;
    // const password = req.body.password;

    // User.findOne({ email: username }, function (err, results) {
    //   if (!results) {
    //     res.send("Failed to find user");
    //   } else {
    //     // Load hash from your password DB.
    //     bcrypt.compare(password, results.password, function (err, result) {
    //       if (result === true) {
    //         res.render("secrets");
    //       } else {
    //         res.send("Password incorrect.");
    //       }
    //     });

    //   }
    // });
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    req.login(user, function (err) {
      if (!err) {
        passport.authenticate("local")(req, res, function (err) {
          res.redirect("/secrets");
        });
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })

  .post(function (req, res) {
    // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    //   // Store hash in your password DB.
    //   const newUser = new User({
    //     email: req.body.username,
    //     password: hash,
    //   });

    //   User.findOne({ email: req.body.username }, function (err, results) {
    //     if (!results) {
    //       newUser.save(function (err) {
    //         if (!err) {
    //           res.render("secrets");
    //         } else {
    //           res.send(err);
    //         }
    //       });
    //     } else {
    //       res.send("User already exist.");
    //     }
    //   });
    // });
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err) {
        if (!err) {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/secrets");
          });
        } else {
          console.log(err);
          res.redirect("/login");
        }
      }
    );
  });

app.route("/secrets").get(function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.route("/logout").get(function (req, res) {
  req.logOut(function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      res.send(err);
    }
  });
});

app
  .route("/submit")
  .get(function (req, res) {
    res.render("submit");
  })
  .post(function (req, res) {});

app.listen(3000, function () {
  console.log("Server running on port 3000.");
});
