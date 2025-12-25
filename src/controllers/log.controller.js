import ApiError from "../lib/ApiError.js";
import Log from "../models/log.model.js";
import { getDominantMood } from "../lib/moodUtils.js"; // shared utility

// Create a new cigarette log
export const createLog = async (req, res, next) => {
  try {
    const { quantity, mood, pricePerCigarette } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity < 1) {
      return next(new ApiError("Quantity must be at least 1", 400));
    }

    if (pricePerCigarette === undefined || pricePerCigarette < 0) {
      return next(
        new ApiError("Price per cigarette must be provided", 400)
      );
    }

    const newLog = new Log({
      user: userId,
      quantity,
      mood,
      pricePerCigarette,
    });

    await newLog.save();

    res.status(201).json({
      message: "Cigarette log created",
      log: newLog,
    });
  } catch (error) {
    next(error);
  }
};
// Get all logs of a user with mood stats
export const getLogs = async (req, res, next) => {
  try {
    const userId = req.user._id; 

    const logs = await Log.find({ user: userId }).sort({ timestamp: -1 });

    // Use shared utility to get dominant mood and suggestion
    const { dominantMood, suggestion, moodCounts } = getDominantMood(logs);

    res.status(200).json({ logs, moodCounts, dominantMood, suggestion });
  } catch (error) {
    next(error); 
  }
};

export const deleteLog = async (req, res) => {
  try {
    const log = await Log.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,  // ensure user owns the log
    });

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json({ message: "Log deleted" });
  } catch (error) {
    console.error("DELETE LOG ERROR:", error);
    res.status(500).json({ message: "Server error deleting log" });
  }
};
