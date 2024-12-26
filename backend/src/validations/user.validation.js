import { body } from "express-validator";

const registrationValidationRules = [
  body("fullname")
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Fullname must be at least 3 characters long."),
  body("email").isEmail().withMessage("Invalid email format."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("username")
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long."),
];

const loginValidationRules = [
  body("username")
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

export { registrationValidationRules, loginValidationRules };
