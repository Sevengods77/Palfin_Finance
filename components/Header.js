import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import styles, { THEME } from './sharedStyles';

export default function Header({ onNavigate, onToggleChat, user, onLogout }) {
  // Use `assets/Palfin_logo.png` (ensure the file exists in `assets/`)
  let logoSource;
  try {
    logoSource = require('../assets/Palfin_logo.png');
  } catch (e) {
    // fallback to default icon if Palfin_logo.png isn't found
    logoSource = require('../assets/icon.png');
  }

  return (
    <View style={localStyles.headerRow}>
      <TouchableOpacity onPress={() => onNavigate('Home')} style={localStyles.logoRow}>
        <Image source={logoSource} style={localStyles.logo} resizeMode="contain" />
        <Text style={styles.headerTitle}>Palfin</Text>
      </TouchableOpacity>

      <View style={localStyles.navRow}>
        <TouchableOpacity onPress={() => onNavigate('Home')} style={localStyles.navButton}>
          <Text style={localStyles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => user ? onNavigate('Tools') : onNavigate('Login')} style={localStyles.navButton}>
          <Text style={localStyles.navText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => user ? onNavigate('Transactions') : onNavigate('Login')} style={localStyles.navButton}>
          <Text style={localStyles.navText}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { if (user) { if (onToggleChat) onToggleChat(); else onNavigate('Chat'); } else onNavigate('Login'); }} style={localStyles.navButton}>
          <Text style={localStyles.navText}>Finize</Text>
        </TouchableOpacity>
        {user ? (
          <>
            <View style={{ marginLeft: 8, paddingHorizontal: 8, paddingVertical: 6 }}>
              <Text style={{ color: '#333', fontWeight: '600' }}>{user.email || user?.user_metadata?.name || 'Account'}</Text>
            </View>
            <TouchableOpacity onPress={() => onLogout && onLogout()} style={localStyles.navButton}>
              <Text style={[localStyles.navText, { color: '#ff3b30' }]}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => onNavigate('Login')} style={localStyles.navButton}>
              <Text style={localStyles.navText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('Signup')} style={localStyles.navButton}>
              <Text style={[localStyles.navText, { backgroundColor: THEME.primary, color: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }]}>Sign up</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, backgroundColor: 'transparent', shadowColor: THEME.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 4 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 64, height: 64, marginRight: 10, borderRadius: 10 },
  navRow: { flexDirection: 'row', alignItems: 'center' },
  navButton: { marginLeft: 8, paddingHorizontal: 8, paddingVertical: 6 },
  navText: { color: THEME.primary, fontWeight: '600' }
});
