import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Platform, Image, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import botAvatar from '../../../assets/Finize_bot.png';
// Import Gemini Service
import { sendMessageToGemini } from '../../services/geminiService';
import { getDashboardData } from '../../services/transactionService';

const FinizeChatWidget = ({ isOpen, onClose, onOpen }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Finize, your AI financial coach. Ask me about your spending!", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            // Get current financial context
            const contextStart = await getDashboardData();

            // Call Gemini API
            const reply = await sendMessageToGemini(userMsg.text, contextStart);

            setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "⚠️ " + error.message,
                sender: 'bot'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <TouchableOpacity
                style={[styles.floatingButton, sharedStyles.shadow]}
                onPress={onOpen}
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
                    <Text style={styles.headerTitle}>Finize AI Coach</Text>
                </View>
                <TouchableOpacity onPress={onClose}>
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
                {isLoading && (
                    <View style={[styles.messageBubble, styles.botBubble]}>
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                    </View>
                )}
            </ScrollView>

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask Finize..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleSend}
                    editable={!isLoading}
                />
                <TouchableOpacity
                    style={[styles.sendButton, isLoading && styles.disabledButton]}
                    onPress={handleSend}
                    disabled={isLoading}
                >
                    <Text style={styles.sendButtonText}>→</Text>
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
    disabledButton: {
        backgroundColor: theme.colors.textSecondary,
    },
    sendButtonText: {
        color: theme.colors.background,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default FinizeChatWidget;
