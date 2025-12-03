import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native';
import sharedStyles, { THEME } from './sharedStyles';
import { signInWithEmail } from '../src/services/auth';

export default function LoginScreen({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const glow = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(glow, { toValue: 1, duration: 300, useNativeDriver: false }).start();
  };
  const handlePressOut = () => {
    Animated.timing(glow, { toValue: 0, duration: 300, useNativeDriver: false }).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter email and password');
      return;
    }
    const { error } = await signInWithEmail(email.trim(), password);
    if (error) {
      Alert.alert('Login failed', error.message || 'Try again');
    }
    // on success, Supabase auth listener will update the app state
  };

  const animatedBg = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [THEME.primary, '#3aa0ff']
  });

  return (
    <View style={styles.screen}>
      <Text style={[sharedStyles.sectionTitle, { textAlign: 'center' }]}>Welcome back</Text>

      <View style={[sharedStyles.card, styles.centerCard]}>
        <Text style={{ fontWeight: '600', marginBottom: 8, fontSize: 16 }}>Sign in to your account</Text>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { width: '100%' }]}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { width: '100%' }]}
        />

        <Animated.View style={[styles.buttonWrap, { backgroundColor: animatedBg, width: '100%' }]}> 
          <TouchableOpacity
            activeOpacity={0.9}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleLogin}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
          <Text style={sharedStyles.mutedText}>New here?</Text>
          <TouchableOpacity onPress={onSwitchToSignup} style={{ marginLeft: 8 }}>
            <Text style={{ color: THEME.primary, fontWeight: '600' }}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 520, justifyContent: 'center', alignItems: 'center', padding: 20 },
  centerCard: { width: '100%', maxWidth: 420, padding: 18, borderRadius: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 6 },
  input: { borderWidth: 1, borderColor: '#e6e6ee', borderRadius: 10, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  buttonWrap: { borderRadius: 12, overflow: 'hidden', marginTop: 6, shadowColor: THEME.primary, shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 },
  button: { paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' }
});
