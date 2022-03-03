import { check } from "express-validator";

let validateRegister = [
  check("email", "Invalid email").isEmail().trim(),

  check(
    "password",
    "Invalid password. Password must be at least 6 characters long."
  ).isLength({ min: 6 }),

  check("passwordConfirmation", "Passwords do not match.").custom(
    (value, { req }) => {
      return value === req.body.password;
    }
  ),
];

let validateLogin = [
  check("email", "Invalid email").isEmail().trim(),

  check("password", "Invalid password").not().isEmpty(),
];

module.exports = {
  validateRegister: validateRegister,
  validateLogin: validateLogin,
};
