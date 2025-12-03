import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import { signInWithEmail } from '../../services/auth';

const LoginModal = ({ visible, onClose, onSwitch, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await signInWithEmail(email, password);
            if (error) {
                setError(error.message);
            } else {
                onSuccess();
                setEmail('');
                setPassword('');
            }
        } catch (e) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>

                    <Text style={[sharedStyles.title, styles.title]}>Welcome Back</Text>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[sharedStyles.button, styles.submitButton]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={theme.colors.background} />
                        ) : (
                            <Text style={sharedStyles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={onSwitch}>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.m,
    },
    modalContent: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.xl,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    closeButton: {
        position: 'absolute',
        top: theme.spacing.m,
        right: theme.spacing.m,
        padding: theme.spacing.s,
    },
    closeButtonText: {
        color: theme.colors.textSecondary,
        fontSize: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: theme.spacing.l,
    },
    inputContainer: {
        marginBottom: theme.spacing.m,
    },
    label: {
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        color: theme.colors.text,
        fontSize: 16,
    },
    submitButton: {
        marginTop: theme.spacing.m,
    },
    errorText: {
        color: theme.colors.error,
        marginBottom: theme.spacing.m,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.l,
    },
    footerText: {
        color: theme.colors.textSecondary,
    },
    linkText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
});

export default LoginModal;
