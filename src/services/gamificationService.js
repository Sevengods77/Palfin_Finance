// Mock gamification state
let userStats = {
    streak: 2, // days
    points: 50,
    level: 'Saver Scout',
    badges: [],
};

export const getUserStats = () => {
    return Promise.resolve({ ...userStats });
};

export const checkStreak = () => {
    // In a real app, check last login date vs today
    // For demo, we'll just increment streak randomly to simulate activity
    const today = new Date().toISOString().split('T')[0];
    // Logic to update streak would go here
    return Promise.resolve(userStats.streak);
};

export const awardPoints = (points) => {
    userStats.points += points;
    return Promise.resolve(userStats.points);
};
