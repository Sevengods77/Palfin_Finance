import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import { getTransactions, subscribeToStore } from '../../services/transactionService';

const screenWidth = Dimensions.get('window').width;

export default function CategoryPieChart({ onClose }) {
    const [data, setData] = useState([]);
    const [totalSpend, setTotalSpend] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const updateData = (store) => {
            processTransactions(store.transactions);
        };

        const unsubscribe = subscribeToStore(updateData);
        return () => unsubscribe();
    }, []);

    const processTransactions = (transactions) => {
        const categoryTotals = {};
        let total = 0;

        transactions.forEach(tx => {
            // Only consider debits
            if (tx.type === 'debit') {
                const amount = parseFloat(tx.amount);
                const cat = tx.category || 'General';
                categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
                total += amount;
            }
        });

        setTotalSpend(total);

        // Format for PieChart
        // colors: custom palette
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
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

    const handleSliceClick = (entry) => {
        setSelectedCategory(entry);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Spending by Category</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.summaryContainer}>
                    <Text style={styles.totalLabel}>Total Spending</Text>
                    <Text style={styles.totalValue}>₹{totalSpend.toFixed(2)}</Text>
                </View>

                {data.length > 0 ? (
                    <View style={styles.chartContainer}>
                        <PieChart
                            data={data}
                            width={Math.min(screenWidth, 500) - 48} // Constrain to modal width (500) - padding
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
                            absolute // Shows absolute numbers on chart, optional
                            hasLegend={true}
                        />
                    </View>
                ) : (
                    <Text style={styles.noData}>No transactions found.</Text>
                )}

                <Text style={styles.sectionTitle}>Details</Text>
                <View style={styles.listContainer}>
                    {data.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.listItem}
                            onPress={() => handleSliceClick(item)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                <Text style={styles.catName}>{item.name}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.catAmount}>₹{item.population.toFixed(2)}</Text>
                                <Text style={styles.catPercent}>
                                    {totalSpend > 0 ? ((item.population / totalSpend) * 100).toFixed(1) : 0}%
                                </Text>
                            </View>
                        </TouchableOpacity>
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
