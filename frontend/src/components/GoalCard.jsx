const GoalCard = ({ goal, cigarettesLogged }) => {
  if (!goal) return null;

  const progress = Math.min(
    Math.round((cigarettesLogged / goal.targetCigarettes) * 100),
    100
  );

  return (
    <div className="bg-amber-50 p-6 rounded-2xl shadow-lg mb-6">
      <h3 className="font-bold text-lg mb-2">{goal.title}</h3>
      <p className="text-gray-700 mb-2">
        Target: {goal.targetCigarettes} cigarettes by {new Date(goal.targetDate).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mb-2">
        Progress: {cigarettesLogged} / {goal.targetCigarettes}
      </p>
      <div className="w-full bg-gray-300 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{progress}% completed</p>
    </div>
  );
};
