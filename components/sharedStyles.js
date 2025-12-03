import { StyleSheet } from 'react-native';

export const THEME = {
  primary: '#0057D9',
  background: '#ffffff',
  card: '#ffffff',
  muted: '#444'
};

export default StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: THEME.background },
  headerTitle: { fontWeight: 'bold', fontSize: 20, color: THEME.primary },
  // Default card style used across the app. Includes a subtle blue radiance
  // to give a cohesive glow/radiance to all blocks in the UI.
  card: {
    backgroundColor: THEME.card,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    // iOS shadow
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    // Android elevation
    elevation: 6,
    // subtle border tint
    borderWidth: 1,
    borderColor: '#f0f6ff'
  },
  // Stronger radiance wrapper for panels like chat or hero cards
  radiantCard: {
    backgroundColor: THEME.card,
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#e6f0ff'
  },
  cardBorder: { borderWidth: 1, borderColor: '#e6e6ee' },
  sectionTitle: { fontWeight: '600', fontSize: 16, color: THEME.primary, marginBottom: 6 },
  mutedText: { color: THEME.muted }
});
