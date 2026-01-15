import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import { processExtractedData } from '../../services/transactionService';

const SMSExtractor = () => {
    const [smsText, setSmsText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const parseSMS = (text) => {
        // Regex patterns for extraction
        const amountRegex = /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{2})?)/i;
        const merchantRegex = /(?:at|to|from)\s+([a-zA-Z0-9\s]+?)(?:\s+(?:on|via|ref|txn)|$)/i;
        const dateRegex = /(\d{2}[-/]\d{2}(?:[-/]\d{2,4})?)/;
        const refRegex = /(?:ref|txn|id)[:\s]+([a-z0-9]+)/i;
        const typeRegex = /(debited|credited|deducted|payment|sent|received)/i;

        const amountMatch = text.match(amountRegex);
        const merchantMatch = text.match(merchantRegex);
        const dateMatch = text.match(dateRegex);
        const refMatch = text.match(refRegex);
        const typeMatch = text.match(typeRegex);

        if (!amountMatch) return null;

        const amountStr = amountMatch[1].replace(/,/g, '');
        const amount = parseFloat(amountStr);
        let type = 'debit';

        if (typeMatch) {
            const t = typeMatch[1].toLowerCase();
            if (['credited', 'received'].includes(t)) type = 'credit';
        }

        // Infer merchant/category if not clear
        let merchant = merchantMatch ? merchantMatch[1].trim() : 'Unknown';
        if (merchant.toLowerCase() === 'your account') merchant = 'Bank Transfer'; // Fix common mis-capture

        return {
            amount,
            merchant,
            date: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0],
            ref: refMatch ? refMatch[1] : '',
            type,
            smsText: text
        };
    };

    const handleExtract = async () => {
        setResult(null); // Clear previous result first
        if (!smsText.trim()) {
            setError('Please paste an SMS message first.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const data = parseSMS(smsText);

            if (data) {
                const transaction = processExtractedData(data);
                setResult(transaction);
                setSmsText(''); // Clear input on success
            } else {
                setError('Could not extract transaction details. Please check the format.');
            }
        } catch (err) {
            setError('Extraction failed due to an error.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (text) => {
        setSmsText(text);
        if (error) setError('');
        if (result) setResult(null);
    };

    return (
        <View style={[sharedStyles.card, styles.container]}>
            <Text style={styles.title}>📱 SMS Transaction Extractor</Text>
            <Text style={styles.subtitle}>Paste your bank SMS below to automatically add it to your dashboard.</Text>

            <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                placeholder="e.g., Your A/C XXXX1234 debited with ₹500..."
                placeholderTextColor={theme.colors.textSecondary}
                value={smsText}
                onChangeText={handleTextChange}
            />

            <TouchableOpacity
                style={[sharedStyles.button, loading && styles.disabledButton]}
                onPress={handleExtract}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.background} />
                ) : (
                    <Text style={sharedStyles.buttonText}>Extract & Add Transaction</Text>
                )}
            </TouchableOpacity>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
            ) : null}

            {result && (
                <View style={styles.successContainer}>
                    <Text style={styles.successTitle}>✅ Transaction Added!</Text>
                    <View style={styles.resultRow}>
                        <Text style={styles.label}>Amount:</Text>
                        <Text style={styles.value}>₹{result.amount.toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.label}>Merchant:</Text>
                        <Text style={styles.value}>{result.merchant}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.label}>Category:</Text>
                        <Text style={styles.value}>{result.category}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.l,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.s,
    },
    subtitle: {
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.m,
        fontSize: 14,
    },
    input: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    disabledButton: {
        opacity: 0.7,
    },
    errorContainer: {
        marginTop: theme.spacing.m,
        padding: theme.spacing.s,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: theme.borderRadius.s,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
    },
    successContainer: {
        marginTop: theme.spacing.m,
        padding: theme.spacing.m,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderRadius: theme.borderRadius.m,
        borderLeftWidth: 4,
        borderLeftColor: '#22C55E',
    },
    successTitle: {
        fontWeight: 'bold',
        color: '#15803D', // Darker green
        marginBottom: theme.spacing.s,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    label: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    value: {
        fontWeight: '600',
        color: theme.colors.text,
    },
});

export default SMSExtractor;
