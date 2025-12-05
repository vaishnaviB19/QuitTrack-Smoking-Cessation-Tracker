import Goal from "../models/goal.model.js";
import Log from "../models/log.model.js";
import User from "../models/user.model.js";

// ======================================================
// GET CURRENT ACTIVE GOAL
// ======================================================
export const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      user: req.user._id,
      isActive: true,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not set yet" });
    }

    res.json(goal);
  } catch (err) {
    console.log("GET GOAL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveGoal = async (req, res) => {
  try {
    const { title, targetCigarettes, targetDate } = req.body;

    if (!title || !targetCigarettes || !targetDate) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // --- Auto calculate baseline from last 7 logs ---
    const logs = await Log.find({ user: req.user._id }).sort({ timestamp: 1 });

    let currentBaseline = 0;

    if (logs.length >= 7) {
      const last7 = logs.slice(-7);
      currentBaseline = last7.reduce((a, b) => a + b.quantity, 0) / 7;
    } else if (logs.length > 0) {
      currentBaseline = logs.reduce((a, b) => a + b.quantity, 0) / logs.length;
    } else {
      currentBaseline = 5; // default fallback
    }

    // --- Create/Update Active Goal ---
    const goal = await Goal.findOneAndUpdate(
      { user: req.user._id, isActive: true },
      {
        user: req.user._id,
        title,
        currentBaseline: parseFloat(currentBaseline.toFixed(1)),
        targetCigarettes,
        targetDate,
        isActive: true
      },
      { new: true, upsert: true }
    );

    res.json(goal);

  } catch (err) {
    console.log("SAVE GOAL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
