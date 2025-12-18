import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { sharedStyles } from '../../theme/sharedStyles';
import { theme } from '../../theme/theme';
import { getTransactions } from '../../services/transactionService';

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <ScrollView
      style={sharedStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
      }
    >
      <View style={[sharedStyles.maxWidthContainer, styles.content]}>
        <Text style={sharedStyles.title}>Parsed Transactions</Text>
        <Text style={sharedStyles.subtitle}>
          This is the data Finize uses to understand your spending.
        </Text>

        <View style={styles.list}>
          {transactions.map((t) => (
            <View key={t.id} style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.rowTitle}>{t.description}</Text>
                <Text style={styles.rowMeta}>
                  {t.date} • {t.category || 'General'}
                </Text>
              </View>
              <Text style={styles.rowAmount}>₹{Number(t.amount || 0).toFixed(2)}</Text>
            </View>
          ))}
          {transactions.length === 0 && (
            <Text style={styles.emptyText}>No transactions yet. Try simulating one from the dashboard.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: theme.spacing.l,
  },
  list: {
    marginTop: theme.spacing.l,
    gap: theme.spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowMain: {
    flex: 1,
    marginRight: theme.spacing.s,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  rowMeta: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  rowAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  emptyText: {
    marginTop: theme.spacing.m,
    color: theme.colors.textSecondary,
  },
});

export default TransactionsScreen;


