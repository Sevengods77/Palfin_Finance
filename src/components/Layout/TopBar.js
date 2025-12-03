import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';
import palfinLogo from '../../../assets/Palfin_logo.png';

const TopBar = ({ user, onLoginClick, onSignupClick, onLogoutClick, onNavigate }) => {
    return (
        <View style={styles.header}>
            <View style={[sharedStyles.maxWidthContainer, styles.headerContent]}>
                <TouchableOpacity onPress={() => onNavigate('home')}>
                    <View style={styles.logoContainer}>
                        <Image source={palfinLogo} style={styles.logoImage} resizeMode="contain" />
                        <Text style={styles.logoText}>Palfin</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.navItems}>
                    {user ? (
                        <>
                            <TouchableOpacity onPress={() => onNavigate('dashboard')} style={styles.navLink}>
                                <Text style={styles.navText}>Dashboard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onNavigate('tools')} style={styles.navLink}>
                                <Text style={styles.navText}>Tools</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onLogoutClick} style={styles.navLink}>
                                <Text style={styles.navText}>Logout</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity onPress={() => onNavigate('tools')} style={styles.navLink}>
                                <Text style={styles.navText}>Tools & Features</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onLoginClick} style={styles.navLink}>
                                <Text style={styles.navText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onSignupClick} style={styles.createAccountBtn}>
                                <Text style={styles.createAccountText}>Create account</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingVertical: theme.spacing.m,
        zIndex: 100,
        ...Platform.select({
            web: {
                position: 'sticky',
                top: 0,
            },
        }),
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.s,
    },
    logoImage: {
        width: 150,
        height: 50,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        letterSpacing: 1,
    },
    navItems: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.m,
    },
    navLink: {
        padding: theme.spacing.s,
    },
    navText: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    createAccountBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.s,
        paddingHorizontal: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
    },
    createAccountText: {
        color: theme.colors.background,
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default TopBar;
