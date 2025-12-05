import { body } from "express-validator";

export const updateProfileValidation = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("cigarettePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Cigarette price must be a positive number"),
  body("currency")
    .optional()
    .isLength({ min: 2, max: 3 })
    .withMessage("Currency should be 2-3 characters"),
];

export const changePasswordValidation = [
  body("oldPassword").exists().withMessage("Old password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];
