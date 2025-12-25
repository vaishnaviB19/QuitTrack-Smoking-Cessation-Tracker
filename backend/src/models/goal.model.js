import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    // 🧍 Reference to user who owns the goal
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // 🏁 Goal title (like “Reduce to 5/day”)
    title: { type: String, required: true },

    // 🧩 Baseline for this stage (user’s average/day before setting goal)
    currentBaseline: { type: Number, required: true },

    // 🎯 Goal target and duration
    targetCigarettes: { type: Number, required: true },
    targetDate: { type: Date, required: true },

    // 🕓 Goal lifecycle
    startDate: { type: Date, default: Date.now }, // when this goal began
    isActive: { type: Boolean, default: true },   // only one active goal per user

    // 📊 Progress tracking (for quick dashboard reads)
    progress: { type: Number, default: 0 },       // % progress (auto-calculated)
    completed: { type: Boolean, default: false }, // true if goal reached or expired
  },
  { timestamps: true }
);

// Ensure only one active goal per user
goalSchema.index({ user: 1, isActive: 1 });

// Export model
const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
