import dashboardData from '../../dashboardData.json';

// In-memory store initialized from JSON
let store = {
    ...dashboardData,
    transactions: [...dashboardData.transactions]
};

// Observers for real-time updates
const listeners = new Set();

const notifyListeners = () => {
    listeners.forEach(listener => listener(store));
};

export const subscribeToStore = (listener) => {
    listeners.add(listener);
    // current state immediate callback
    listener(store);
    return () => listeners.delete(listener);
};

export const getDashboardData = () => {
    return Promise.resolve({ ...store });
};

export const getTransactions = () => {
    return Promise.resolve([...store.transactions]);
};

export const getMonthlySpend = () => {
    // In a real app, we would recalculate this from transactions if they were exhaustive.
    // For this requirements, we trust the store's monthlyExpenses or recalculate specific period.
    // Let's return the store value directly for consistency with the prompt's "Expense" metric.
    return Promise.resolve(store.monthlyExpenses);
};

// Simple keyword-based auto-categorization logic
const categorizeTransaction = (description, merchant) => {
    const text = (description + ' ' + (merchant || '')).toLowerCase();

    if (text.includes('uber') || text.includes('ola') || text.includes('fuel') || text.includes('metro')) {
        return 'Transport';
    }
    if (text.includes('grocery') || text.includes('food') || text.includes('restaurant') || text.includes('swiggy') || text.includes('zomato') || text.includes('coffee')) {
        return 'Food';
    }
    if (text.includes('bill') || text.includes('electricity') || text.includes('recharge') || text.includes('wifi') || text.includes('mobile')) {
        return 'Utilities';
    }
    if (text.includes('movie') || text.includes('netflix') || text.includes('amazon') || text.includes('shopping')) {
        return 'Entertainment';
    }
    if (text.includes('salary') || text.includes('deposit') || text.includes('credit')) {
        return 'Income';
    }
    if (text.includes('upi') || text.includes('transfer')) {
        return 'Transfer';
    }

    return 'General';
};

export const addTransaction = (amount, description, type = 'debit') => {
    const newTransaction = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        merchant: description, // Mapping description to merchant for consistency
        type,
        date: new Date().toISOString().split('T')[0],
        category: categorizeTransaction(description),
        extractedAt: new Date().toISOString()
    };

    // Update store
    store.transactions = [newTransaction, ...store.transactions];
    store.transactionCount += 1;
    store.lastUpdated = new Date().toISOString();

    if (type === 'debit') {
        store.balance -= newTransaction.amount;
        store.monthlyExpenses += newTransaction.amount;
    } else {
        store.balance += newTransaction.amount;
        // Income doesn't usually reduce monthly expenses, but could affect savings rate logic
    }

    // Recalculate savings rate (mock logic: balance / (balance + expenses) * 100 or specific formula)
    // For simplicity, let's just keep the hardcoded one or update slightly if needed.
    // Let's just notify for now.

    notifyListeners();
    return Promise.resolve(newTransaction);
};

export const processExtractedData = (extractedData) => {
    // extractedData expects: { amount, merchant, type, date, category (optional), subText }
    const { amount, merchant, type, date, smsText } = extractedData;

    const newTransaction = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        amount,
        merchant: merchant || 'Unknown Merchant',
        type: type || 'debit',
        date: date || new Date().toISOString().split('T')[0],
        category: categorizeTransaction(merchant || 'General'),
        smsText,
        extractedAt: new Date().toISOString()
    };

    store.transactions = [newTransaction, ...store.transactions];
    store.transactionCount += 1;
    store.lastUpdated = new Date().toISOString();

    if (newTransaction.type === 'debit') {
        store.balance -= newTransaction.amount;
        store.monthlyExpenses += newTransaction.amount;
    } else if (newTransaction.type === 'credit') {
        store.balance += newTransaction.amount;
    }

    notifyListeners();
    return newTransaction;
};
