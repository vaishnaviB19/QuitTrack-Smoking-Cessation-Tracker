import User from "../models/user.model.js";
import Log from "../models/log.model.js";
import Goal from "../models/goal.model.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    /* ================= USER & GOAL ================= */
    const user = await User.findById(userId);
    const goal = await Goal.findOne({ user: userId, isActive: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* ================= LOGS ================= */
    const logs = await Log.find({ user: userId }).sort({ timestamp: 1 });

    /* ================= DAILY MAP ================= */
    const dailyMap = {};
    logs.forEach((log) => {
      const date = log.timestamp.toISOString().slice(0, 10);
      dailyMap[date] = (dailyMap[date] || 0) + log.quantity;
    });

    const sortedDatesAsc = Object.keys(dailyMap).sort();
    const todayStr = new Date().toISOString().slice(0, 10);
    const todaySmoked = dailyMap[todayStr] || 0;

    const getPrevDate = (dateStr) => {
      const d = new Date(dateStr);
      d.setDate(d.getDate() - 1);
      return d.toISOString().slice(0, 10);
    };

    const getDateRange = (startStr, endStr) => {
      const dates = [];
      let d = new Date(startStr);
      while (d.toISOString().slice(0, 10) <= endStr) {
        dates.push(d.toISOString().slice(0, 10));
        d.setDate(d.getDate() + 1);
      }
      return dates;
    };

    /* ================= DATE RANGE ================= */
    const goalStartDateStr = goal?.createdAt
      ? new Date(goal.createdAt).toISOString().slice(0, 10)
      : sortedDatesAsc[0];

    const dateRange = goalStartDateStr
      ? getDateRange(goalStartDateStr, todayStr)
      : [];

    /* ================= CURRENT STREAK ================= */
    let currentStreak = 0;

    if (goal?.targetCigarettes !== undefined) {
      let dateCursor = todayStr;

      while (dateCursor >= goalStartDateStr) {
        const smoked = dailyMap[dateCursor]; // undefined = no log

        if (smoked === undefined || smoked <= goal.targetCigarettes) {
          currentStreak++;
          dateCursor = getPrevDate(dateCursor);
        } else {
          break; // streak breaks ONLY if exceeded target
        }
      }
    }

    /* ================= LONGEST STREAK ================= */
    let longestStreak = 0;
    let streak = 0;

    if (goal?.targetCigarettes !== undefined) {
      dateRange.forEach((date) => {
        const smoked = dailyMap[date];

        if (smoked === undefined || smoked <= goal.targetCigarettes) {
          streak++;
          longestStreak = Math.max(longestStreak, streak);
        } else {
          streak = 0;
        }
      });
    }

    /* ================= SMOKE-FREE DAYS ================= */
    let smokeFreeDays = 0;

    dateRange.forEach((date) => {
      const smoked = dailyMap[date];
      if (smoked === undefined || smoked === 0) {
        smokeFreeDays++;
      }
    });

    /* ================= LAST SMOKE ================= */
    const lastSmokeLog = logs.filter((l) => l.quantity > 0).at(-1);
    const lastSmokeTime = lastSmokeLog
      ? lastSmokeLog.timestamp
      : user.quitDate;

    /* ================= HEALTH PROGRESS ================= */
    const hoursSinceLastSmoke = lastSmokeTime
      ? (Date.now() - new Date(lastSmokeTime)) / 3600000
      : 0;

    const healthProgress = Math.min((hoursSinceLastSmoke / 720) * 100, 100);

    let todayHealthImprovement = 0;
    if (lastSmokeTime) {
      const now = Date.now();
      const yesterday = now - 24 * 3600000;

      const healthNow = Math.min((hoursSinceLastSmoke / 720) * 100, 100);
      const healthYesterday = Math.max(
        Math.min(
          ((yesterday - new Date(lastSmokeTime)) / 3600000 / 720) * 100,
          100
        ),
        0
      );

      todayHealthImprovement = Math.max(0, healthNow - healthYesterday);
    }

           

    /* ================= SAVINGS (DYNAMIC) ================= */
let cigarettesAvoided = 0;
let savings = 0;

const baseline = Math.ceil(Number(goal?.currentBaseline));

if (baseline > 0) {
  logs.forEach((log) => {
    const avoided = Math.max(0, baseline - log.quantity);
    cigarettesAvoided += avoided;
    savings += avoided * (log.pricePerCigarette || 0);
  });
}


    /* ================= TODAY PROGRESS ================= */
    const dailyProgress =
      goal?.targetCigarettes > 0
        ? Math.min(100, (todaySmoked / goal.targetCigarettes) * 100)
        : 0;

    /* ================= GOAL ================= */
    const enrichedGoal = goal
      ? {
          title: goal.title,
          targetCigarettes: goal.targetCigarettes,
          targetDate: goal.targetDate,
          currentBaseline: goal.currentBaseline,
          completed: goal.completed,
        }
      : null;

    /* ================= RESPONSE ================= */
    res.json({
      name:user.fullName || user.username,
      smokeFreeDays,
      currentStreak,
      longestStreak,
      today: {
        smoked: todaySmoked,
        progress: dailyProgress,
      },
      overall: {
        healthProgress,
        cigarettesAvoided,
        savings,
      },
      todayHealthImprovement,
      logDates: dateRange,
      cigarettesPerDay: dateRange.map((d) => dailyMap[d] || 0),
      goal: enrichedGoal,
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
