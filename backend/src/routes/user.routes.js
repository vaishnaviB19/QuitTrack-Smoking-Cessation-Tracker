// import express from "express";
// import {verifyToken} from "../middleware/auth.middleware.js";
// import { updateQuitDate,getProfile, updateProfile, changePassword } from "../controllers/user.controller.js";
// import {updateProfileValidation,changePasswordValidation,} from "../validations/user.validation.js";
// import { validateRequest } from "../validations/validateRequest.js";
// const router = express.Router();

// router.use(verifyToken);

// router.post("/quitDate", updateQuitDate);
// router.get("/profile", getProfile);
// router.put("/profile",updateProfileValidation, validateRequest,updateProfile);
// router.put("/password",changePasswordValidation,  validateRequest,  changePassword);

// export default router;

import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
  return res.json({ user: req.user });
});

export default router;
