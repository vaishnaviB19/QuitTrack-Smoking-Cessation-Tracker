import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import ApiError from "../lib/ApiError.js";
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, email, cigarettePrice, currency } = req.body;

    const user = await User.findById(userId);
    if (!user) return next(new ApiError("User not found", 404));

    if (name) user.name = name;
    if (email) user.email = email;
    if (cigarettePrice !== undefined) user.cigarettePrice = cigarettePrice;
    if (currency) user.currency = currency;

    try {
      await user.save();
      res.json({ message: "Profile updated successfully" });
    } catch (err) {
      if (err.code === 11000 && err.keyValue.email) {
        return next(new ApiError("Email already exists", 400));
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};


export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return next(new ApiError("User not found", 404));

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return next(new ApiError("Old password incorrect", 400));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateQuitDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { quitDate } = req.body;

    if (!quitDate) {
      return res.status(400).json({ message: "Quit date is required" });
    }

    // Validate quitDate format if needed here

    await User.findByIdAndUpdate(userId, { quitDate });

    res.status(200).json({ message: "Quit date updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
