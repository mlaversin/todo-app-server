const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

/*
 * This function allows the user to sign up
 */
exports.signup = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "The account has been created." })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/*
 * This function allows the user to login
 */
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error:
            "The email and password you entered did not match our records. Please double-check and try again!",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error:
                "The email and password you entered did not match our records. Please double-check and try again!",
            });
          }
          res.status(200).json({
            userId: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            token: jwt.sign(
              { userId: user._id, userRole: user.role },
              process.env.JWT_SECRET,
              {
                expiresIn: "3 days",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
