import { body } from "express-validator";

export const createLogValidation = [
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("mood")
    .optional()
    .isIn(["happy", "stressed", "sad", "bored", "anxious", "neutral"])
    .withMessage("Invalid mood value"),
];
