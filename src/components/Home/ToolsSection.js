import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';
import { sharedStyles } from '../../theme/sharedStyles';

const ToolCard = ({ title, description, icon }) => (
    <View style={[sharedStyles.card, styles.card]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
    </View>
);

const ToolsSection = () => {
    return (
        <View style={styles.container}>
            <View style={sharedStyles.maxWidthContainer}>
                <Text style={[sharedStyles.title, styles.sectionTitle]}>Tools & Features</Text>
                <Text style={[sharedStyles.subtitle, styles.sectionSubtitle]}>
                    Everything you need to take control of your finances.
                </Text>

                <View style={styles.grid}>
                    <ToolCard
                        icon="📊"
                        title="Transaction Parsing"
                        description="Automatically parse and categorize transactions from SMS and bank notifications."
                    />
                    <ToolCard
                        icon="🧠"
                        title="Smart Categories"
                        description="AI-driven categorization learns your spending habits for accurate tracking."
                    />
                    <ToolCard
                        icon="🤖"
                        title="Behavioral Coach"
                        description="Get personalized tips and nudges to help you stick to your budget."
                    />
                    <ToolCard
                        icon="🎮"
                        title="Gamified Dashboard"
                        description="Track your progress with streaks, badges, and visual goals."
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.xl * 2,
        backgroundColor: theme.colors.backgroundSecondary,
    },
    sectionTitle: {
        textAlign: 'center',
        color: theme.colors.primary,
    },
    sectionSubtitle: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xl * 2,
        fontSize: 18,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.l,
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        minWidth: 250,
        maxWidth: 350,
        flex: 1,
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    icon: {
        fontSize: 40,
        marginBottom: theme.spacing.m,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
        textAlign: 'center',
    },
    cardDescription: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default ToolsSection;
