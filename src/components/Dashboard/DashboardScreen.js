import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform, Modal, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import { getMonthlySpend, getDashboardData, addTransaction, subscribeToStore } from '../../services/transactionService';
import { getUserStats } from '../../services/gamificationService';
import { getDailyTip } from '../../services/coachService';
import SMSExtractor from '../Tools/SMSExtractor';
import FintelVoiceCapture from '../Fintel/FintelVoiceCapture';
import CategoryPieChart from '../Analytics/CategoryPieChart';
import GoalSetting from '../Goals/GoalSetting';

const StatCard = ({ title, value, subtext, color }) => (
    <View style={[sharedStyles.card, styles.statCard]}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={[styles.statValue, { color: color || theme.colors.text }]}>{value}</Text>
        <Text style={styles.statSubtext}>{subtext}</Text>
    </View>
);

const FeatureCard = ({ title, icon, onPress, isActive }) => (
    <TouchableOpacity onPress={onPress} style={[sharedStyles.card, styles.featureCard, isActive && styles.activeFeatureCard]}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <Text style={[styles.featureTitle, isActive && styles.activeFeatureTitle]}>{title}</Text>
    </TouchableOpacity>
);

const ProgressBar = ({ progress }) => (
    <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress.toFixed(1)}% of Goal</Text>
    </View>
);

const DashboardScreen = (props) => {
    // Destructure props but keep access to others if needed, mostly we need user, scrollToSection, onScrollHandled, and onOpenChat
    const { user, scrollToSection, onScrollHandled, onOpenChat } = props;
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        balance: 0,
        monthlyExpenses: 0,
        daysTracked: 0,
        transactionCount: 0,
        savingsRate: 0,
    });
    const [stats, setStats] = useState({ streak: 0, points: 0 });
    const [dailyTip, setDailyTip] = useState('');

    const [refreshing, setRefreshing] = useState(false);
    const [showExtractor, setShowExtractor] = useState(false);
    const [showFintel, setShowFintel] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [showGoals, setShowGoals] = useState(false);

    // Scrolling refs
    const scrollViewRef = useRef(null);
    const toolsRef = useRef(null);
    const sectionLayouts = useRef({});

    useEffect(() => {
        // Subscribe to store updates
        const unsubscribe = subscribeToStore((data) => {
            setDashboardData(data);
        });

        // Initial Data Load (Gamification/Coach services are still mock/async)
        const loadExtras = async () => {
            try {
                const [userStats, tip] = await Promise.all([
                    getUserStats(),
                    getDailyTip(),
                ]);
                setStats(userStats);
                setDailyTip(tip);
            } catch (error) {
                console.error('Error loading extra dashboard data:', error);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

        loadExtras();

        return () => {
            unsubscribe();
        };
    }, []);

    // Handle Scrolling
    useEffect(() => {
        if (scrollToSection && scrollViewRef.current) {
            const y = sectionLayouts.current[scrollToSection];
            if (y !== undefined) {
                scrollViewRef.current.scrollTo({ y, animated: true });
                if (onScrollHandled) onScrollHandled();
            } else {
                // If layout not ready or section not found, maybe wait?
                // For now, retry once or just ignore. 
                // A small timeout helps if layout hasn't measured yet on first render
                setTimeout(() => {
                    const retryY = sectionLayouts.current[scrollToSection];
                    if (retryY !== undefined && scrollViewRef.current) {
                        scrollViewRef.current.scrollTo({ y: retryY, animated: true });
                        if (onScrollHandled) onScrollHandled();
                    }
                }, 500);
            }
        }
    }, [scrollToSection]);

    const onRefresh = async () => {
        setRefreshing(true);
        // Re-fetch extras
        const [userStats, tip] = await Promise.all([
            getUserStats(),
            getDailyTip(),
        ]);
        setStats(userStats);
        setDailyTip(tip);
        setRefreshing(false);
    };

    const handleSimulateTransaction = async () => {
        // Simulate adding a transaction for demo purposes
        await addTransaction(Math.floor(Math.random() * 500) + 50, 'Coffee & Snacks Test');
        alert('Simulated transaction added! Dashboard updated.');
    };

    const toggleExtractor = () => {
        setShowExtractor(!showExtractor);
    };

    const handleLayout = (sectionName, event) => {
        sectionLayouts.current[sectionName] = event.nativeEvent.layout.y;
    };

    return (
        <ScrollView
            ref={scrollViewRef}
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
                        title="Current Balance"
                        value={`₹${(dashboardData.balance || 0).toLocaleString('en-IN')}`}
                        subtext="Available to spend"
                        color={theme.colors.text}
                    />
                    <StatCard
                        title="Monthly Spend"
                        value={`₹${(dashboardData.monthlyExpenses || 0).toLocaleString('en-IN')}`}
                        subtext="▼ 12% from last month"
                        color={theme.colors.primary}
                    />
                    <StatCard
                        title="Savings Rate"
                        value={`${dashboardData.savingsRate}%`}
                        subtext="On track for goal"
                        color={theme.colors.accent}
                    />
                    <StatCard
                        title="Streak"
                        value={`${dashboardData.streak || 0} Days`}
                        subtext="Tracking expenses"
                        color="#F59E0B"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Goal Progress: {dashboardData.goalName || 'Savings'}</Text>
                    <View style={sharedStyles.card}>
                        <ProgressBar progress={Math.min(((dashboardData.balance || 0) / (dashboardData.goalTarget || 1)) * 100, 100)} />
                    </View>
                </View>

                {/* Tools Section - Target for scrolling */}
                <View
                    style={styles.section}
                    onLayout={(e) => handleLayout('tools', e)}
                    ref={toolsRef} // Also keeping ref just in case
                >
                    <Text style={styles.sectionHeader}>Tools</Text>

                    <View style={styles.featuresGrid}>
                        <FeatureCard
                            title="Fintel Voice"
                            icon="🎙️"
                            onPress={() => setShowFintel(true)}
                            isActive={showFintel}
                        />
                        <FeatureCard
                            title="TransExtract"
                            icon="📱"
                            onPress={() => setShowExtractor(true)}
                            isActive={showExtractor}
                        />
                        <FeatureCard
                            title="View Categories"
                            icon="🏷️"
                            onPress={() => setShowCategories(true)}
                            isActive={showCategories}
                        />
                        <FeatureCard
                            title="Behavioral Coach"
                            icon="🤖"
                            onPress={onOpenChat}
                        />
                        <FeatureCard
                            title="Goal Setting"
                            icon="🎯"
                            onPress={() => setShowGoals(true)}
                            isActive={showGoals}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.lastUpdated}>Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}</Text>
                </View>

                {/* SMS Extractor Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showExtractor}
                    onRequestClose={() => setShowExtractor(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Extract Transaction</Text>
                                <TouchableOpacity onPress={() => setShowExtractor(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            <SMSExtractor />
                        </View>
                    </View>
                </Modal>

                {/* Fintel Voice Capture Modal (Built-in Modal) */}
                <FintelVoiceCapture
                    visible={showFintel}
                    onClose={() => setShowFintel(false)}
                />

                {/* Categories Wrapper Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showCategories}
                    onRequestClose={() => setShowCategories(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <CategoryPieChart onClose={() => setShowCategories(false)} />
                        </View>
                    </View>
                </Modal>

                {/* Goal Setting Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showGoals}
                    onRequestClose={() => setShowGoals(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <GoalSetting onClose={() => setShowGoals(false)} />
                        </View>
                    </View>
                </Modal>

            </View >
        </ScrollView >
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
        borderColor: theme.colors.border,
        borderWidth: 1,
    },
    activeFeatureCard: {
        borderColor: theme.colors.primary,
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
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
    activeFeatureTitle: {
        color: theme.colors.primary,
    },
    lastUpdated: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        fontSize: 12,
        fontStyle: 'italic',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.m,
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.l, // Removed padding to let children control it or keep it? SMSExtractor has its own padding/card style.
        // Actually SMSExtractor is a Card. Let's make it fit well.
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    closeButton: {
        padding: theme.spacing.s,
    },
    closeButtonText: {
        fontSize: 24,
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
});

export default DashboardScreen;
