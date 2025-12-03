import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';

const PublicHome = ({ onLoginClick, onSignupClick, onScrollToTools }) => {
    // Simple animation for background effect
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 10000,
                    easing: Easing.linear,
                    useNativeDriver: false, // CSS-like animation
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 10000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.background, '#051024'], // Subtle shift
    });

    return (
        <Animated.View style={[styles.container, { backgroundColor }]}>
            {/* CSS Gradient Background for Web */}
            {Platform.OS === 'web' && (
                <View style={styles.webBackground}>
                    <style>
                        {`
              @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .animated-bg {
                background: linear-gradient(-45deg, #020617, #0F172A, #022c22, #020617);
                background-size: 400% 400%;
                animation: gradient 15s ease infinite;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: -1;
              }
            `}
                    </style>
                    <div className="animated-bg" />
                </View>
            )}

            <View style={[sharedStyles.maxWidthContainer, styles.content]}>
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>
                        Master Your Money with <Text style={styles.highlight}>Palfin</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        AI-powered financial clarity. Track, analyze, and grow your wealth with intelligent insights.
                    </Text>

                    <View style={styles.ctaContainer}>
                        <TouchableOpacity style={sharedStyles.button} onPress={onSignupClick}>
                            <Text style={sharedStyles.buttonText}>Get Started Free</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={sharedStyles.secondaryButton} onPress={onLoginClick}>
                            <Text style={sharedStyles.secondaryButtonText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={onScrollToTools} style={styles.scrollButton}>
                        <Text style={styles.scrollText}>Explore Features ↓</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 600,
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    webBackground: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
    },
    heroSection: {
        alignItems: 'center',
        maxWidth: 800,
    },
    heroTitle: {
        fontSize: 48,
        fontWeight: '800',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.l,
        lineHeight: 60,
    },
    highlight: {
        color: theme.colors.primary,
    },
    heroSubtitle: {
        fontSize: 20,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        lineHeight: 30,
    },
    ctaContainer: {
        flexDirection: 'row',
        gap: theme.spacing.m,
        marginBottom: theme.spacing.xl,
    },
    scrollButton: {
        marginTop: theme.spacing.xl,
    },
    scrollText: {
        color: theme.colors.accent,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PublicHome;
