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

    if (!title || targetCigarettes == null || !targetDate) {
      return res.status(400).json({ message: "Missing fields" });
    }

    /* ===============================
       1. CALCULATE BASELINE (LAST 7 DAYS)
    =============================== */
    const logs = await Log.find({ user: req.user._id })
      .sort({ timestamp: -1 })
      .limit(7);

    let currentBaseline;

    if (logs.length > 0) {
      const avg =
        logs.reduce((sum, log) => sum + log.quantity, 0) /
        logs.length;

      // IMPORTANT: baseline must be integer
      currentBaseline = Math.ceil(avg);
    } else {
      currentBaseline = 5; // safe fallback
    }

    /* ===============================
       2. VALIDATION (CRITICAL)
    =============================== */
    if (targetCigarettes >= currentBaseline) {
      return res.status(400).json({
        message:
          "Target must be less than your current smoking baseline",
      });
    }

    /* ===============================
       3. DEACTIVATE OLD GOALS
    =============================== */
    await Goal.updateMany(
      { user: req.user._id, isActive: true },
      { isActive: false }
    );

    /* ===============================
       4. CREATE NEW GOAL (NEW TIMESTAMP)
    =============================== */
    const goal = await Goal.create({
      user: req.user._id,
      title,
      currentBaseline,
      targetCigarettes,
      targetDate,
      isActive: true,
      completed: false,
    });

    res.json(goal);

  } catch (err) {
    console.error("SAVE GOAL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
