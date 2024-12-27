import { body } from "express-validator";
import ApiError from "../utils/ApiError.js";

const registrationValidationRules = [
  body("fullname").isString().trim(),
  body("email")
    .isEmail()
    .toLowerCase()
    .trim()
    .withMessage("Invalid email format."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("username")
    .isString()
    .trim()
    .toLowerCase()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long."),
];

const changePasswordValidationRules = [
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long."),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new ApiError(400, "New and confirm password do not match.");
    }
    return true;
  }),
];

const updateAccountDetailsValidationRules = [
  body("fullname").optional().isString().trim(),
  body("email")
    .optional()
    .isEmail()
    .toLowerCase()
    .trim()
    .withMessage("Invalid email format."),
  body("username")
    .optional()
    .isString()
    .trim()
    .toLowerCase()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long."),
];

export {
  registrationValidationRules,
  changePasswordValidationRules,
  updateAccountDetailsValidationRules,
};
