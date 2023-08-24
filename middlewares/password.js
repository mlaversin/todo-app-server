const passwordValidator = require("password-validator");

const schema = new passwordValidator();

schema
  .is()
  .min(
    8,
    "The password must contain at least 8 characters.The password must contain at least 8 characters."
  )
  .is()
  .max(100, "The password must contain a maximum of 100 characters.")
  .has()
  .uppercase(1, "The password must contain at least one capital letter.")
  .has()
  .lowercase(1, "The password must contain at least one lowercase letter.")
  .has()
  .digits(1, "The password must contain at least one digit.")
  .is()
  .not()
  .oneOf(
    [
      "123",
      "1234",
      "123456",
      "Passw0rd",
      "Pa55word",
      "Pa55w0rd",
      "Password123",
      "M0tdepasse",
      "Motdepass3",
      "Motd3passe",
      "M0tdepasse",
    ],
    "Mot de passe interdit."
  ); // Blacklist these values

module.exports = (req, res, next) => {
  if (schema.validate(req.body.password)) {
    next();
  } else {
    const error = schema.validate(req.body.password, { details: true })[0]
      .message;
    return res.status(400).json({ error });
  }
};
