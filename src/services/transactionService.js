// Mock transaction data
let transactions = [
    { id: 1, amount: 450, description: 'Uber Ride', date: '2023-10-25', category: 'Transport' },
    { id: 2, amount: 1200, description: 'Grocery Store', date: '2023-10-24', category: 'Food' },
    { id: 3, amount: 3000, description: 'Electricity Bill', date: '2023-10-20', category: 'Utilities' },
    { id: 4, amount: 150, description: 'Coffee Shop', date: '2023-10-26', category: 'Food' },
];

// Simple keyword-based auto-categorization logic
const categorizeTransaction = (description) => {
    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes('uber') || lowerDesc.includes('ola') || lowerDesc.includes('fuel') || lowerDesc.includes('metro')) {
        return 'Transport';
    }
    if (lowerDesc.includes('grocery') || lowerDesc.includes('food') || lowerDesc.includes('restaurant') || lowerDesc.includes('swiggy') || lowerDesc.includes('zomato') || lowerDesc.includes('coffee')) {
        return 'Food';
    }
    if (lowerDesc.includes('bill') || lowerDesc.includes('electricity') || lowerDesc.includes('recharge') || lowerDesc.includes('wifi')) {
        return 'Utilities';
    }
    if (lowerDesc.includes('movie') || lowerDesc.includes('netflix') || lowerDesc.includes('amazon') || lowerDesc.includes('shopping')) {
        return 'Entertainment';
    }
    if (lowerDesc.includes('salary') || lowerDesc.includes('deposit')) {
        return 'Income';
    }

    return 'General';
};

export const getTransactions = () => {
    return Promise.resolve([...transactions]);
};

export const addTransaction = (amount, description) => {
    const newTransaction = {
        id: Date.now(),
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString().split('T')[0],
        category: categorizeTransaction(description),
    };
    transactions = [newTransaction, ...transactions];
    return Promise.resolve(newTransaction);
};

export const getMonthlySpend = () => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const total = transactions
        .filter(t => t.date.startsWith(currentMonth) && t.category !== 'Income')
        .reduce((sum, t) => sum + t.amount, 0);
    return Promise.resolve(total);
};
