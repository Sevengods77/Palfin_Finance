const tips = [
    "You've spent 20% less on dining out this week compared to last week. Great job!",
    "Consider setting a daily limit for 'Entertainment' to save an extra ₹500 this month.",
    "You are on a 12-day streak! Keep tracking to unlock the 'Consistency King' badge.",
    "Did you know? Saving just ₹50 a day adds up to ₹18,250 a year!",
    "Your 'Utilities' bill seems higher than usual. Check for any appliances left on.",
];

export const getDailyTip = () => {
    // Randomly select a tip for now
    const randomIndex = Math.floor(Math.random() * tips.length);
    return Promise.resolve(tips[randomIndex]);
};

export const analyzeSpendingBehavior = (transactions) => {
    // Simple analysis logic
    const foodSpend = transactions
        .filter(t => t.category === 'Food')
        .reduce((sum, t) => sum + t.amount, 0);

    if (foodSpend > 5000) {
        return "It looks like you're spending a lot on food. Try cooking at home more often!";
    }
    return "Your spending looks balanced this week.";
};
