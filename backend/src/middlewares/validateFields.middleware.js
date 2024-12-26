import fs from "fs";
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateFields = (rules) =>
  asyncHandler(async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.files) {
        for (const key in req.files) {
          if (Array.isArray(req.files[key])) {
            req.files[key].forEach((file) => {
              try {
                fs.unlinkSync(file.path); // Delete the file
                console.log(`Deleted file: ${file.path}`);
              } catch (err) {
                console.error(`Error deleting file: ${file.path}`, err);
              }
            });
          }
        }
      }

      throw new ApiError(400, "Validation error", errors.array());
    }

    next();
  });

export default validateFields;
