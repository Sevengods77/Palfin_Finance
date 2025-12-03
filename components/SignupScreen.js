import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native';
import sharedStyles, { THEME } from './sharedStyles';
import { signUpWithEmail } from '../src/services/auth';

export default function SignupScreen({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const glow = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => Animated.timing(glow, { toValue: 1, duration: 300, useNativeDriver: false }).start();
  const handlePressOut = () => Animated.timing(glow, { toValue: 0, duration: 300, useNativeDriver: false }).start();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Missing info', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    const { error } = await signUpWithEmail(email.trim(), password);
    if (error) {
      Alert.alert('Signup failed', error.message || 'Try again');
      return;
    }
    Alert.alert('Account created', 'You can now log in.');
    if (onSwitchToLogin) onSwitchToLogin();
  };

  const animatedBg = glow.interpolate({ inputRange: [0, 1], outputRange: ['#34c759', '#5ce07a'] });

  return (
    <View style={styles.screen}>
      <Text style={[sharedStyles.sectionTitle, { textAlign: 'center' }]}>Create account</Text>

      <View style={[sharedStyles.card, styles.centerCard]}>
        <TextInput placeholder="Full name" value={name} onChangeText={setName} style={[styles.input, { width: '100%' }]} />
        <TextInput placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} style={[styles.input, { width: '100%' }]} autoCapitalize="none" />
        <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={[styles.input, { width: '100%' }]} />
        <TextInput placeholder="Confirm password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={[styles.input, { width: '100%' }]} />

        <Animated.View style={[styles.buttonWrap, { backgroundColor: animatedBg, width: '100%' }]}> 
          <TouchableOpacity activeOpacity={0.9} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleSignup} style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
          <Text style={sharedStyles.mutedText}>Already have an account?</Text>
          <TouchableOpacity onPress={onSwitchToLogin} style={{ marginLeft: 8 }}>
            <Text style={{ color: THEME.primary, fontWeight: '600' }}>Sign in</Text>
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
  buttonWrap: { borderRadius: 12, overflow: 'hidden', marginTop: 6, shadowColor: '#34c759', shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 },
  button: { paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' }
});
