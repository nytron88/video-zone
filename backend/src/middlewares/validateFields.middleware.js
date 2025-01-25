import fs from "fs/promises";
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const validateFields = (rules) =>
  asyncHandler(async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(
        400,
        errors.array()?.[0]?.msg || "Validation Error",
        errors.array()
      );
    }

    next();
  });

export default validateFields;
