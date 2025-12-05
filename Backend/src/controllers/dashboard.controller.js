import User from "../models/user.model.js";
import Log from "../models/log.model.js";
import Goal from "../models/goal.model.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🟢 1. Fetch user & goal
    const user = await User.findById(userId);
    const goal = await Goal.findOne({ user: userId });

    // 🟢 2. Fetch all smoking logs (where smoked > 0)
    const logs = await Log.find({
      user: userId,
      quantity: { $gt: 0 }
    }).sort({ timestamp: 1 }); 

    // 🔵 3. If NO smoking logs → use quitDate for all metrics
    if (logs.length === 0) {
      const diff = Date.now() - new Date(user.quitDate).getTime();
      const daysSinceQuit = Math.floor(diff / 86400000);

      return res.json({
        name: user.name,
        daysSinceQuit,
        currentStreak: daysSinceQuit,
        longestStreak: daysSinceQuit,
        overall: {
          cigarettesLogged: 0,
          savings: 0,
          healthProgress: Math.min(daysSinceQuit * 2, 100)
        },
        logDates: [],
        cigarettesPerDay: [],
        goal: null,
        suggestion: "Amazing start! Keep building momentum."
      });
    }

    // 🟡 4. Current Smoke-Free Streak
    const lastSmoked = logs[logs.length - 1].timestamp;
    const diffCurrent = Date.now() - lastSmoked.getTime();

    const currentStreak =
      diffCurrent < 86400000
        ? 0
        : Math.floor(diffCurrent / 86400000);

    // 🔴 5. Longest Smoke-Free Streak (streak between logs)
    let longestStreak = 0;
    let streak = 0;

    for (let i = 1; i < logs.length; i++) {
      const prev = logs[i - 1].timestamp;
      const curr = logs[i].timestamp;

      const gap = Math.floor((curr - prev) / 86400000);

      if (gap >= 1) {
        streak = 0;
      } else {
        streak++;
      }

      longestStreak = Math.max(longestStreak, streak);
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    // 🟣 6. Days Since Quit (based on last smoked event)
    const diffQuit = Date.now() - lastSmoked.getTime();
    const daysSinceQuit = Math.floor(diffQuit / 86400000);

    // 🟠 7. Daily Pattern Graph Data
    const dailyMap = {};

    logs.forEach(log => {
      const date = log.timestamp.toISOString().slice(0, 10);
      dailyMap[date] = (dailyMap[date] || 0) + log.quantity;
    });

    const logDates = Object.keys(dailyMap);
    const cigarettesPerDay = Object.values(dailyMap);

    // 🟡 8. Savings Calculation (Assuming pricePerCig in User model)
    const totalCigarettes = logs.reduce((sum, log) => sum + log.quantity, 0);
    const savings = (user.pricePerCig || 15) * totalCigarettes;

    // 🟢 9. Health Progress (simple linear model)
    const healthProgress = Math.min(daysSinceQuit * 2, 100);

    // 🔵 10. Goal Progress Calculation
    let enrichedGoal = null;

    if (goal) {
      const today = new Date().toISOString().slice(0, 10);
      const todayCount = dailyMap[today] || 0;

      enrichedGoal = {
        title: goal.title,
        targetCigarettes: goal.targetCigarettes,
        targetDate: goal.targetDate,
        daysLeft: Math.max(
          0,
          Math.ceil(
            (new Date(goal.targetDate) - Date.now()) / 86400000
          )
        ),
        goalProgress: Math.min(
          100,
          ((goal.targetCigarettes - todayCount) / goal.targetCigarettes) * 100
        )
      };
    }

    // 🎯 11. AI Motivation Suggestion
    const suggestion =
      currentStreak === 0
        ? "It's okay! What matters is getting back on track. You can do this ❤️"
        : currentStreak < 3
        ? "Great progress! The first few days are the hardest — stay strong!"
        : currentStreak < 7
        ? "You're gaining momentum! Keep going 🚀"
        : "You're unstoppable! Keep pushing, you're doing amazing 💪";

    // ✅ 12. Final Response
    res.json({
      name: user.name,
      daysSinceQuit,
      currentStreak,
      longestStreak,
      overall: {
        cigarettesLogged: totalCigarettes,
        savings,
        healthProgress
      },
      logDates,
      cigarettesPerDay,
      goal: enrichedGoal,
      suggestion
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
