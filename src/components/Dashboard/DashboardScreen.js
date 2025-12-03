import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import { getMonthlySpend, getTransactions, addTransaction } from '../../services/transactionService';
import { getUserStats } from '../../services/gamificationService';
import { getDailyTip } from '../../services/coachService';

const StatCard = ({ title, value, subtext, color }) => (
    <View style={[sharedStyles.card, styles.statCard]}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={[styles.statValue, { color: color || theme.colors.text }]}>{value}</Text>
        <Text style={styles.statSubtext}>{subtext}</Text>
    </View>
);

const FeatureCard = ({ title, icon, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[sharedStyles.card, styles.featureCard]}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <Text style={styles.featureTitle}>{title}</Text>
    </TouchableOpacity>
);

const ProgressBar = ({ progress }) => (
    <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}% of monthly budget</Text>
    </View>
);

const DashboardScreen = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [monthlySpend, setMonthlySpend] = useState(0);
    const [stats, setStats] = useState({ streak: 0, points: 0 });
    const [dailyTip, setDailyTip] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [spend, userStats, tip] = await Promise.all([
                getMonthlySpend(),
                getUserStats(),
                getDailyTip(),
            ]);
            setMonthlySpend(spend);
            setStats(userStats);
            setDailyTip(tip);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleSimulateTransaction = async () => {
        // Simulate adding a transaction for demo purposes
        await addTransaction(Math.floor(Math.random() * 500) + 50, 'Coffee & Snacks');
        loadData();
        alert('Simulated transaction added! Dashboard updated.');
    };

    return (
        <ScrollView
            style={sharedStyles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
            }
        >
            <View style={[sharedStyles.maxWidthContainer, styles.content]}>
                <View style={styles.welcomeSection}>
                    <Text style={sharedStyles.title}>Hi, {user?.email?.split('@')[0]}</Text>
                    <Text style={sharedStyles.subtitle}>Here's your financial snapshot.</Text>
                </View>

                {/* Behavioral Coach Tip */}
                <View style={[sharedStyles.card, styles.tipCard]}>
                    <Text style={styles.tipTitle}>💡 Behavioral Coach</Text>
                    <Text style={styles.tipText}>{dailyTip}</Text>
                </View>

                <View style={styles.statsGrid}>
                    <StatCard
                        title="Monthly Spend"
                        value={`₹${monthlySpend.toLocaleString('en-IN')}`}
                        subtext="▼ 12% from last month"
                        color={theme.colors.primary}
                    />
                    <StatCard
                        title="Total Savings"
                        value="₹8,500"
                        subtext="On track for goal"
                        color={theme.colors.accent}
                    />
                    <StatCard
                        title="Streak"
                        value={`${stats.streak} Days`}
                        subtext="Tracking expenses"
                        color="#F59E0B"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Budget Progress</Text>
                    <View style={sharedStyles.card}>
                        <ProgressBar progress={65} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Quick Actions</Text>
                    <View style={styles.featuresGrid}>
                        <FeatureCard
                            title="Simulate SMS"
                            icon="📱"
                            onPress={handleSimulateTransaction}
                        />
                        <FeatureCard title="View Categories" icon="🏷️" onPress={() => { }} />
                        <FeatureCard title="Behavioral Coach" icon="🤖" onPress={() => { }} />
                        <FeatureCard title="Savings Goals" icon="🎯" onPress={() => { }} />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingVertical: theme.spacing.l,
    },
    welcomeSection: {
        marginBottom: theme.spacing.xl,
    },
    tipCard: {
        marginBottom: theme.spacing.xl,
        backgroundColor: 'rgba(34, 197, 94, 0.1)', // Light green tint
        borderColor: theme.colors.primary,
    },
    tipTitle: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginBottom: theme.spacing.s,
    },
    tipText: {
        color: theme.colors.text,
        fontStyle: 'italic',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.m,
        marginBottom: theme.spacing.xl,
    },
    statCard: {
        flex: 1,
        minWidth: 200,
    },
    statTitle: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        marginBottom: theme.spacing.xs,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
    },
    statSubtext: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        ...theme.typography.h3,
        marginBottom: theme.spacing.m,
    },
    progressContainer: {
        padding: theme.spacing.s,
    },
    progressBackground: {
        height: 12,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.round,
        marginBottom: theme.spacing.s,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.round,
    },
    progressText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        textAlign: 'right',
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.m,
    },
    featureCard: {
        width: '48%',
        minWidth: 140,
        alignItems: 'center',
        padding: theme.spacing.l,
        aspectRatio: 1.2,
        justifyContent: 'center',
    },
    featureIcon: {
        fontSize: 32,
        marginBottom: theme.spacing.m,
    },
    featureTitle: {
        color: theme.colors.text,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default DashboardScreen;
