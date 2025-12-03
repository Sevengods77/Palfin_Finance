import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { assignCategory } from './CategoryAssigner';
import sharedStyles from './sharedStyles';

export default function TransactionList({ transactions }) {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={sharedStyles.sectionTitle}>Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item }) => (
          <View style={[sharedStyles.card, sharedStyles.cardBorder]}>
            <Text style={{ fontWeight: '600' }}>Merchant: {item.merchant}</Text>
            <Text style={sharedStyles.mutedText}>Date: {item.date || '?'}</Text>
            <Text>Amount: {item.currency} {item.amount}</Text>
            <Text style={{ marginTop: 6 }}>Category: {assignCategory(item)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={sharedStyles.mutedText}>No transactions.</Text>}
      />
    </View>
  );
}
