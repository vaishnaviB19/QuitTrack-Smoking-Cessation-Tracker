import { body } from "express-validator";

export const createOrUpdateGoalValidation = [
  body("targetCigarettes")
    .exists()
    .withMessage("Target cigarettes is required")
    .isInt({ min: 1 })
    .withMessage("Target cigarettes must be at least 1"),
  body("targetDate")
    .optional()
    .isISO8601()
    .withMessage("Target date must be a valid date"),
];
