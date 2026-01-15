import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import { subscribeToStore, setGoal } from '../../services/transactionService';

export default function GoalSetting({ onClose }) {
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [balance, setBalance] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const unsubscribe = subscribeToStore((store) => {
            setBalance(store.balance);
            // Only update local input if not focused? Or just sync simple
            // Ideally we'd separate edit state from store state, but for simplicity:
            if (!goalName) setGoalName(store.goalName || 'My Goal');
            if (!targetAmount) setTargetAmount(store.goalTarget?.toString() || '100000');

            calculateProgress(store.balance, store.goalTarget);
        });
        return () => unsubscribe();
    }, []);

    // Re-calc when inputs change
    useEffect(() => {
        calculateProgress(balance, targetAmount);
    }, [balance, targetAmount]);

    const calculateProgress = (currentBalance, target) => {
        const t = parseFloat(target) || 1;
        const p = Math.min(Math.max((currentBalance / t) * 100, 0), 100);
        setProgress(p);
    };

    const handleTargetChange = (text) => {
        setTargetAmount(text);
        calculateProgress(balance, text);
    };

    const getProgressColor = () => {
        if (progress < 33) return '#EF4444'; // Red
        if (progress < 66) return '#F59E0B'; // Yellow
        return '#10B981'; // Green
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🎯 Set Savings Goal</Text>
                <TouchableOpacity onPress={onClose}><Text style={styles.closeText}>✕</Text></TouchableOpacity>
            </View>

            <ScrollView>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Goal Name</Text>
                    <TextInput
                        style={styles.input}
                        value={goalName}
                        onChangeText={setGoalName}
                        placeholder="e.g. Vacation, Emergency Fund"
                        placeholderTextColor={theme.colors.textSecondary}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Target Amount (₹)</Text>
                    <TextInput
                        style={styles.input}
                        value={targetAmount}
                        onChangeText={handleTargetChange}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={theme.colors.textSecondary}
                    />
                </View>

                {/* Progress Section */}
                <View style={styles.progressSection}>
                    <Text style={styles.progressLabel}>Progress towards {goalName}</Text>

                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${progress}%`, backgroundColor: getProgressColor() }
                            ]}
                        />
                    </View>

                    <View style={styles.progressStats}>
                        <Text style={styles.statText}>Current: ₹{balance.toLocaleString('en-IN')}</Text>
                        <Text style={[styles.statText, { fontWeight: 'bold', color: getProgressColor() }]}>
                            {progress.toFixed(1)}%
                        </Text>
                        <Text style={styles.statText}>Target: ₹{parseFloat(targetAmount || 0).toLocaleString('en-IN')}</Text>
                    </View>
                </View>

                {!targetAmount || parseFloat(targetAmount) <= 0 ? null : (
                    <Text style={styles.motivationalText}>
                        {progress >= 100 ? "🎉 Goal Achieved! Amazing job!" :
                            progress > 50 ? "👍 You're halfway there! Keep going!" :
                                "🚀 Start saving to reach your goal!"}
                    </Text>
                )}

                <TouchableOpacity style={styles.saveButton} onPress={() => {
                    setGoal(goalName, targetAmount);
                    onClose();
                }}>
                    <Text style={styles.saveButtonText}>Save Goal</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        padding: 16,
        borderRadius: 20,
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        fontFamily: 'Quintessential',
    },
    closeText: {
        fontSize: 24,
        color: theme.colors.textSecondary,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: theme.colors.textSecondary,
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 14,
        color: theme.colors.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    progressSection: {
        marginTop: 10,
        marginBottom: 24,
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: 16,
    },
    progressLabel: {
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    progressBarBg: {
        height: 16,
        backgroundColor: theme.colors.background,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 8,
    },
    progressStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statText: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    motivationalText: {
        textAlign: 'center',
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 24,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: theme.colors.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
