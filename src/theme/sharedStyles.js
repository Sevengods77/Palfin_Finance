import { StyleSheet, Platform } from 'react-native';
import { theme } from './theme';

export const sharedStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    maxWidthContainer: {
        width: '100%',
        maxWidth: 1200,
        alignSelf: 'center',
        paddingHorizontal: theme.spacing.m,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    card: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...Platform.select({
            web: {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            default: {
                elevation: 2,
            },
        }),
    },
    shadow: {
        ...Platform.select({
            web: {
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            default: {
                elevation: 4,
            },
        }),
    },
    text: {
        color: theme.colors.text,
        fontSize: theme.typography.body.fontSize,
    },
    title: {
        ...theme.typography.h1,
        marginBottom: theme.spacing.m,
    },
    subtitle: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.s,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.l,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: theme.colors.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.l,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
