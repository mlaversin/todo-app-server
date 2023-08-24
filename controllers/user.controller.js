const User = require("../models/User");
const fs = require("fs");

/*
 * This function allows you to retrieve the information of all users
 */
exports.getAllUsers = (req, res) => {
  User.find()
    .select("-password")
    .then((users) => {
      if (req.auth.userRole === "admin") {
        res.status(200).json(users);
      } else {
        res.status(403).json({
          message: "Vous n'êtes pas autorisé à effectuer cette requête.",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/*
 * This function allows you to retrieve the information of a single user from his token
 */
exports.getUserInfo = (req, res) => {
  User.findOne({
    _id: req.auth.userId,
  })
    .select("-password")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(401).json({ message: "Invalid token." });
    });
};

/*
 * This function allows you to retrieve the information of a single user from his id
 */
exports.getOneUser = (req, res) => {
  User.findOne({
    _id: req.params.id,
  })
    .select("-password")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).json({ message: "This user doesn't exist." });
    });
};

/*
 * This function allows you to update the information of a single user
 */
exports.updateUser = (req, res) => {
  if (req.auth.userRole !== "admin" && req.auth.userId !== req.params.id) {
    res.status(403).json({
      message: "You are not authorized to make this request.",
    });
  } else {
    User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
        },
      }
    )
      .then(() =>
        res.status(200).json({ message: "Your information has been updated." })
      )
      .catch((error) => res.status(400).json({ error }));
  }
};

/*
 * This function allows you to update the profile picture of a user
 */
exports.updateUserPic = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (req.auth.userRole !== "admin" && req.auth.userId !== req.params.id) {
        res.status(403).json({
          message: "You are not authorized to make this request.",
        });
      } else {
        // the user wants to delete the old image without adding a new one
        if (user.pictureUrl && req.body.deleteFile === "true" && !req.file) {
          const filename = user.pictureUrl.split("/uploads/")[1];
          fs.unlink(`uploads/${filename}`, (error) => {
            if (error) console.error("ignored", error.message);
          });
          user.pictureUrl = undefined;
          user.save();
          res.status(200).json({ message: "Your image has been deleted" });
        }
        // the user sends an image
        else if (req.file) {
          // delete the old image if it exists
          if (user.pictureUrl) {
            const filename = user.pictureUrl.split("/uploads/")[1];
            fs.unlink(`uploads/${filename}`, (error) => {
              if (error) console.error("ignored", error.message);
            });
          }
          User.updateOne(
            { _id: req.params.id },
            {
              $set: {
                pictureUrl: `${req.protocol}://${req.get("host")}/uploads/${
                  req.file.filename
                }`,
              },
            }
          )
            .then(() =>
              res
                .status(200)
                .json({ message: "Your profile picture has been updated." })
            )
            .catch((error) => res.status(400).json({ error }));
        } else {
          res.status(500).json({
            message: "An error has occurred. Please try again later.",
          });
        }
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

/*
 * This function is used to delete a user from the database
 */
exports.deleteUser = (req, res) => {
  if (req.auth.userRole === "admin" || req.auth.userId === req.params.id) {
    User.deleteOne({ _id: req.params.id })
      .then(() =>
        res.status(200).json({ message: "Your account has been deleted." })
      )
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(403).json({
      message: "You are not authorized to make this request.",
    });
  }
};
