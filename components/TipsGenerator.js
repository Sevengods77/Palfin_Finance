import React from 'react';
import { View, Text } from 'react-native';
import sharedStyles from './sharedStyles';

function generateTip(transactions) {
  if (!transactions.length) return "Start entering transactions to get finance tips!";
  const total = transactions.reduce((acc, tx) => acc + Number(tx.amount || 0), 0);
  if (total > 10000) return "You're spending a lot this month! Consider budgeting or saving more.";
  if (total > 5000) return "Watch your spending trends this month.";
  if (total < 1000) return "Great job keeping expenses low!";
  return "Keep reviewing your transactions for better financial decisions!";
}

export default function TipsGenerator({ transactions }) {
  const tip = generateTip(transactions);
  return (
    <View style={[sharedStyles.card, { marginVertical: 8 }]}>
      <Text style={sharedStyles.sectionTitle}>Personal Finance Tip:</Text>
      <Text style={{ marginTop: 4 }}>{tip}</Text>
    </View>
  );
}
