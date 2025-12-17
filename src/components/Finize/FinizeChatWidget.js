import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Platform, Image } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import botAvatar from '../../../assets/Finize_bot.png';
import { getTransactions, getMonthlySpend } from '../../services/transactionService';
import { getUserStats } from '../../services/gamificationService';
import { getResponse as getFinizeResponse } from '../../../components/finizeService';

const FinizeChatWidget = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Finize, your financial assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text || isSending) return;

        const userMsg = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsSending(true);

        try {
            // Get latest transactions + dashboard-style metrics as context
            const [transactions, monthlySpend, userStats] = await Promise.all([
                getTransactions(),
                getMonthlySpend(),
                getUserStats(),
            ]);

            // Roughly infer budget from dashboard's progress bar (65%)
            const budgetProgress = 65;
            const budget = budgetProgress > 0 ? monthlySpend / (budgetProgress / 100) : null;

            // Mirror the dashboard's "Total Savings" mock value
            const savings = 8500;

            const snapshot = {
                monthlySpend,
                budget,
                budgetProgress,
                savings,
                streak: userStats?.streak,
                points: userStats?.points,
                level: userStats?.level,
            };

            // Build simple history format expected by finizeService
            const history = [...messages, userMsg].map(m => ({
                from: m.sender === 'bot' ? 'finize' : 'user',
                text: m.text,
            }));

            const { response } = await getFinizeResponse(text, transactions, user || null, history, snapshot);

            const botMsg = {
                id: Date.now() + 1,
                text: response,
                sender: 'bot',
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error('Finize chat error:', err);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 2,
                    text: "Sorry, something went wrong while talking to Finize. Please try again.",
                    sender: 'bot',
                },
            ]);
        } finally {
            setIsSending(false);
        }
    };

    if (!isOpen) {
        return (
            <TouchableOpacity
                style={[styles.floatingButton, sharedStyles.shadow]}
                onPress={() => setIsOpen(true)}
            >
                <Image source={botAvatar} style={styles.avatarImage} />
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.container, sharedStyles.shadow]}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Image source={botAvatar} style={styles.avatarImageSmall} />
                    <Text style={styles.headerTitle}>Finize</Text>
                </View>
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                    <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
                {messages.map(msg => (
                    <View
                        key={msg.id}
                        style={[
                            styles.messageBubble,
                            msg.sender === 'user' ? styles.userBubble : styles.botBubble
                        ]}
                    >
                        <Text style={msg.sender === 'user' ? styles.userText : styles.botText}>
                            {msg.text}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask Finize..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isSending}>
                    <Text style={styles.sendButtonText}>{isSending ? '…' : '→'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 350,
        height: 500,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.l,
        borderWidth: 1,
        borderColor: theme.colors.border,
        zIndex: 1000,
        overflow: 'hidden',
        ...Platform.select({
            web: {
                maxHeight: 'calc(100vh - 40px)',
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.background,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.s,
    },
    avatarImageSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    headerTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeText: {
        color: theme.colors.textSecondary,
        fontSize: 20,
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    messagesContent: {
        padding: theme.spacing.m,
        gap: theme.spacing.m,
    },
    messageBubble: {
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        maxWidth: '80%',
    },
    userBubble: {
        backgroundColor: theme.colors.primary,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
    },
    botBubble: {
        backgroundColor: theme.colors.backgroundSecondary,
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 0,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    userText: {
        color: theme.colors.background,
        fontWeight: '600',
    },
    botText: {
        color: theme.colors.text,
    },
    inputArea: {
        padding: theme.spacing.m,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        flexDirection: 'row',
        gap: theme.spacing.s,
        backgroundColor: theme.colors.backgroundSecondary,
    },
    input: {
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.round,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: theme.colors.background,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default FinizeChatWidget;
