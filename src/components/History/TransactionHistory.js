import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import { getTransactions, subscribeToStore } from '../../services/transactionService';

// Helper to generate initials or icon bg color
const getAvatarColor = (name) => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const TransactionCard = ({ transaction }) => {
    const isCredit = transaction.type === 'credit' || transaction.category === 'Income';
    const amountColor = isCredit ? '#10B981' : theme.colors.text; // Green for credit, white for debit
    const sign = isCredit ? '+' : '';

    // Format date: "Oct 25" or "Today"
    const dateObj = new Date(transaction.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    // Avatar Initials
    const initials = transaction.merchant ? transaction.merchant.substring(0, 1).toUpperCase() : '?';

    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.leftSection}>
                <View style={[styles.avatar, { backgroundColor: getAvatarColor(transaction.merchant) }]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.merchant}>{transaction.merchant}</Text>
                    <Text style={styles.meta}>{dateStr} • {transaction.category}</Text>
                </View>
            </View>
            <View style={styles.rightSection}>
                <Text style={[styles.amount, { color: amountColor }]}>
                    {sign}₹{transaction.amount.toLocaleString('en-IN')}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Initial fetch
        getTransactions().then(setTransactions);

        // Subscribe for real-time updates
        const unsubscribe = subscribeToStore((store) => {
            setTransactions([...store.transactions]);
        });
        return () => unsubscribe();
    }, []);

    // Grouping logic (optional, but requested "nice way like gpay")
    // Simple chronological sort first
    const sortedTransactions = [...transactions].sort((a, b) => {
        // Sort by extractedAt if available (newer first), else date
        const timeA = a.extractedAt ? new Date(a.extractedAt).getTime() : new Date(a.date).getTime();
        const timeB = b.extractedAt ? new Date(b.extractedAt).getTime() : new Date(b.date).getTime();
        return timeB - timeA;
    });

    return (
        <ScrollView style={sharedStyles.container}>
            <View style={[sharedStyles.maxWidthContainer, styles.content]}>
                <View style={styles.header}>
                    <Text style={sharedStyles.title}>Transaction History</Text>
                    <Text style={sharedStyles.subtitle}>Your recent activity</Text>
                </View>

                {sortedTransactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No transactions found.</Text>
                        <Text style={styles.emptySubtext}>Use the TransExtract tool to add some!</Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {sortedTransactions.map((t) => (
                            <TransactionCard key={t.id} transaction={t} />
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingVertical: theme.spacing.l,
    },
    header: {
        marginBottom: theme.spacing.l,
        alignItems: 'center',
    },
    list: {
        gap: theme.spacing.s,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.m,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.l,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border, // Very subtle separator feel
        // GPay is often cleaner, maybe no background but just list items? 
        // Let's keep card bg for contrast against dark theme.
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.m,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    info: {
        justifyContent: 'center',
    },
    merchant: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    meta: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptySubtext: {
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.s,
    },
});

export default TransactionHistory;
