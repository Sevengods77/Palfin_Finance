import AsyncStorage from '@react-native-async-storage/async-storage';
import dashboardData from '../../dashboardData.json';

const STORAGE_KEY = '@palfin_dashboard_data';

// In-memory store initialized from JSON
const defaultStore = {
    ...dashboardData,
    transactions: [...dashboardData.transactions],
    totalIncome: 150000,
    goalTarget: 100000,
    goalName: 'Savings Goal',
    streak: 0,
    lastTransactionDate: null
};

let store = { ...defaultStore };

const saveStore = async () => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
        console.error('Failed to save store', e);
    }
};

const loadStore = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
            store = JSON.parse(jsonValue);
            notifyListeners();
        }
    } catch (e) {
        console.error('Failed to load store', e);
    }
};

// Auto-load on module import
setTimeout(loadStore, 0);

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

// Helper to update streak based on today vs last date
const updateStreak = (currentStreak, lastDateStr) => {
    if (!lastDateStr) return 1;

    const today = new Date();
    const lastDate = new Date(lastDateStr);

    // Reset hours to compare dates only
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return currentStreak; // Same day, no change
    if (diffDays === 1) return currentStreak + 1; // Consecutive day
    return 1; // Broken streak, reset to 1 (today)
};

const calculateSavingsRate = (income, expense) => {
    if (income <= 0) return 0;
    return Math.max(0, Math.round(((income - expense) / income) * 100));
};

export const setGoal = (name, target) => {
    store.goalName = name;
    store.goalTarget = parseFloat(target) || 0;
    saveStore();
    notifyListeners();
};

export const getMonthlySpend = () => {
    return Promise.resolve(store.monthlyExpenses);
};

// Simple keyword-based auto-categorization logic
// Robust categorization logic
// Reusing robust categorization from extraction service
import { getCategoryFromKeywords } from './extractionService';

export const categorizeTransaction = (description, merchant) => {
    return getCategoryFromKeywords(description, merchant);
};

export const addTransaction = (amount, description, type = 'debit', manualCategory = null) => {
    const newTransaction = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        merchant: description, // Mapping description to merchant for consistency
        type,
        date: new Date().toISOString().split('T')[0],
        // Use manualCategory if provided, else check description object, else re-categorize
        category: manualCategory || ((description?.category && description.category !== 'General') ? description.category : categorizeTransaction(description)),
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
        store.totalIncome += newTransaction.amount;
    }

    // Update Streak
    store.streak = updateStreak(store.streak || 0, store.lastTransactionDate);
    store.lastTransactionDate = newTransaction.date;

    // Update Savings Rate
    store.savingsRate = calculateSavingsRate(store.totalIncome, store.monthlyExpenses);

    // Recalculate savings rate (mock logic: balance / (balance + expenses) * 100 or specific formula)
    // For simplicity, let's just keep the hardcoded one or update slightly if needed.
    // Let's just notify for now.

    saveStore();
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
        category: extractedData.category || categorizeTransaction(merchant || 'General'),
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
        store.totalIncome += newTransaction.amount;
    }

    // Update Streak
    store.streak = updateStreak(store.streak || 0, store.lastTransactionDate);
    store.lastTransactionDate = newTransaction.date;

    // Update Savings Rate
    store.savingsRate = calculateSavingsRate(store.totalIncome, store.monthlyExpenses);

    saveStore();
    notifyListeners();
    return newTransaction;
};
