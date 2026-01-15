import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import { getTransactions, subscribeToStore } from '../../services/transactionService';

const screenWidth = Dimensions.get('window').width;

const ToggleButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.toggleButton,
            isActive && styles.activeToggleButton
        ]}
    >
        <Text style={[
            styles.toggleText,
            isActive && styles.activeToggleText
        ]}>{title}</Text>
    </TouchableOpacity>
);

export default function CategoryPieChart({ onClose }) {
    const [data, setData] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [viewMode, setViewMode] = useState('expense'); // 'expense' or 'income'

    // Listen for mode changes to re-process current store data if needed, 
    // but subscribeToStore handles data updates. 
    // We need to store raw transactions to re-filter when mode changes.
    const [rawTransactions, setRawTransactions] = useState([]);

    useEffect(() => {
        const updateData = (store) => {
            setRawTransactions(store.transactions);
            processTransactions(store.transactions, viewMode);
        };

        const unsubscribe = subscribeToStore(updateData);
        return () => unsubscribe();
    }, []);

    // Re-process when viewMode changes
    useEffect(() => {
        if (rawTransactions.length > 0) {
            processTransactions(rawTransactions, viewMode);
        }
    }, [viewMode, rawTransactions]);

    const processTransactions = (transactions, mode) => {
        const categoryTotals = {};
        let total = 0;

        transactions.forEach(tx => {
            const isDebit = tx.type === 'debit';
            // Filter based on mode
            if ((mode === 'expense' && isDebit) || (mode === 'income' && !isDebit)) {
                const amount = parseFloat(tx.amount);
                const cat = tx.category || 'General';
                categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
                total += amount;
            }
        });

        setTotalValue(total);

        // Format for PieChart
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF',
            '#FF9F40', '#8AC926', '#1982C4', '#6A4C93'
        ];

        const chartData = Object.keys(categoryTotals).map((cat, index) => ({
            name: cat,
            population: categoryTotals[cat],
            color: colors[index % colors.length],
            legendFontColor: theme.colors.textSecondary,
            legendFontSize: 12,
        }));

        setData(chartData);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {viewMode === 'expense' ? 'Spending' : 'Income'} by Category
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.toggleContainer}>
                <ToggleButton
                    title="Expenses"
                    isActive={viewMode === 'expense'}
                    onPress={() => setViewMode('expense')}
                />
                <ToggleButton
                    title="Income"
                    isActive={viewMode === 'income'}
                    onPress={() => setViewMode('income')}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.summaryContainer}>
                    <Text style={styles.totalLabel}>
                        Total {viewMode === 'expense' ? 'Spending' : 'Income'}
                    </Text>
                    <Text style={[
                        styles.totalValue,
                        { color: viewMode === 'expense' ? theme.colors.primary : '#22C55E' }
                    ]}>
                        ₹{totalValue.toFixed(2)}
                    </Text>
                </View>

                {data.length > 0 ? (
                    <View style={styles.chartContainer}>
                        <PieChart
                            data={data}
                            width={Math.min(screenWidth, 500) - 48}
                            height={220}
                            chartConfig={{
                                backgroundColor: theme.colors.surface,
                                backgroundGradientFrom: theme.colors.surface,
                                backgroundGradientTo: theme.colors.surface,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"0"}
                            center={[0, 0]}
                            absolute
                            hasLegend={true}
                        />
                    </View>
                ) : (
                    <Text style={styles.noData}>No {viewMode} transactions found.</Text>
                )}

                <Text style={styles.sectionTitle}>Details</Text>
                <View style={styles.listContainer}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.listItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                <Text style={styles.catName}>{item.name}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.catAmount}>₹{item.population.toFixed(2)}</Text>
                                <Text style={styles.catPercent}>
                                    {totalValue > 0 ? ((item.population / totalValue) * 100).toFixed(1) : 0}%
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        fontFamily: 'Quintessential',
    },
    closeBtn: {
        padding: 8,
    },
    closeText: {
        fontSize: 24,
        color: theme.colors.textSecondary,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        padding: 4,
        marginBottom: 24,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeToggleButton: {
        backgroundColor: theme.colors.background,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    activeToggleText: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    summaryContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    totalLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
    },
    totalValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    noData: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 12,
    },
    listContainer: {
        paddingBottom: 40,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    catName: {
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '500',
    },
    catAmount: {
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: '600',
    },
    catPercent: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
});
