// utils/moodUtils.js

/**
 * Calculate dominant mood from logs
 * @param {Array} logs - Array of log objects with a 'mood' field
 * @returns {Object} { dominantMood, suggestion, moodCounts }
 */
export const getDominantMood = (logs) => {
  const moodCounts = {};

  logs.forEach((log) => {
    moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
  });

  const dominantMood = Object.keys(moodCounts).reduce(
    (a, b) => (moodCounts[a] > moodCounts[b] ? a : b),
    "neutral"
  );

  const suggestions = {
    stressed: "Take deep breaths or walk for 5 minutes.",
    bored: "Try a small activity to distract yourself.",
    anxious: "Relax your shoulders and take 3 deep breaths.",
    sad: "Reach out to someone you trust.",
    tired: "Drink water and stretch for 30 seconds.",
    happy: "Great job! Keep the positive vibe!",
    neutral: "Stay mindful and consistent.",
  };

  return { dominantMood, suggestion: suggestions[dominantMood], moodCounts };
};
