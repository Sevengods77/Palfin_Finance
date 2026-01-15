import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import { processExtractedData } from '../../services/transactionService';
import { extractTransactionDetails } from '../../services/extractionService';

const SMSExtractor = () => {
    const [smsText, setSmsText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const parseSMS = (text) => {
        const result = extractTransactionDetails(text);
        if (!result || result.amount === 0) return null;

        return {
            ...result,
            smsText: text,
            date: new Date().toISOString().split('T')[0], // Default to today if date not parsed (service implementation to be checked)
            ref: '', // Ref extraction can be added to service if needed, or kept simple
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
