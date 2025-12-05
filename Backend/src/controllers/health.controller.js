import ApiError from "../lib/ApiError.js";
import User from "../models/user.model.js";
import Log from "../models/log.model.js";
import { healthMilestones } from "../lib/healthMilestones.js";

export const getHealthProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.quitDate) {
      return next(new ApiError("Quit date not found. Please set it first.", 400));
    }

    const quitDate = new Date(user.quitDate);
    const hoursSinceQuit = (Date.now() - quitDate.getTime()) / (1000 * 60 * 60);

    const achieved = healthMilestones.filter((m) => hoursSinceQuit >= m.time);
    const upcoming = healthMilestones.filter((m) => hoursSinceQuit < m.time);

    res.json({
      quitDate: user.quitDate,
      hoursSinceQuit,
      achieved,
      upcoming,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new ApiError("User not found", 404));

    const { cigarettePrice = 15 } = req.query;

    const logs = await Log.find({ user: req.user._id }).sort({ timestamp: 1 });

    if (!logs.length) {
      return res.status(200).json({
        totalSaved: 0,
        message: "No cigarette logs found",
      });
    }

    const initialCount = logs[0].quantity;
    const totalDays = Math.ceil(
      (Date.now() - new Date(logs[0].timestamp)) / (1000 * 60 * 60 * 24)
    );

    const expectedSpent = initialCount * cigarettePrice * totalDays;
    const actualSpent = logs.reduce((sum, log) => sum + log.quantity * cigarettePrice, 0);

    const totalSaved = expectedSpent - actualSpent;

    res.status(200).json({
      cigarettePrice,
      totalSaved: totalSaved > 0 ? totalSaved : 0,
      currency: "INR",
    });
  } catch (error) {
    next(error);
  }
};
