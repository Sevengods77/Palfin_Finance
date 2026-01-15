import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import sharedStyles, { THEME } from './sharedStyles';
import { getResponse } from './finizeService';

export default function FinizeChat({ onClose, transactions = [], user = null }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 'sys-1', from: 'finize', text: "Hi — I'm Finize. Ask me how to save or about a transaction." }
  ]);

  // Prefer Finize bot image for the chat header icon, fall back to Palfin logo
  let logoSource;
  try {
    logoSource = require('../assets/Finize_bot.png');
  } catch (e) {
    try { logoSource = require('../assets/Palfin_logo.png'); } catch (e2) { logoSource = null; }
  }

  // No background radiance — keep the panel neutral and non-distracting

  async function handleSend() {
    const text = (input || '').trim();
    if (!text) return;
    const userMsg = { id: `u-${Date.now()}`, from: 'user', text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    try {
      const { response } = await getResponse(text, transactions, user);
      const botMsg = { id: `b-${Date.now()}`, from: 'finize', text: response };
      setMessages(m => [...m, botMsg]);
    } catch (e) {
      const errMsg = { id: `e-${Date.now()}`, from: 'finize', text: 'Sorry, something went wrong.' };
      setMessages(m => [...m, errMsg]);
    }
  }

  return (
    <View style={localStyles.container} pointerEvents="box-none">
      <View style={localStyles.panel}>
        <View style={localStyles.panelHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {logoSource && <Image source={logoSource} style={localStyles.logoSmall} />}
            <Text style={{ fontWeight: '700', marginLeft: logoSource ? 8 : 0 }}>Finize</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={localStyles.closeBtn}>
            <Text style={{ color: '#666' }}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={localStyles.history}>
          <ScrollView contentContainerStyle={{ padding: 6 }}>
            {messages.map(m => (
              <View key={m.id} style={[localStyles.msgRow, m.from === 'user' ? localStyles.msgUser : localStyles.msgBot]}>
                <Text style={m.from === 'user' ? localStyles.msgTextUser : localStyles.msgTextBot}>{m.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={localStyles.inputRow}>
          <TextInput placeholder="Ask Finize..." style={styles.input} value={input} onChangeText={setInput} />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={{ color: '#fff' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: { position: 'absolute', right: 18, bottom: 110, zIndex: 999 },
  panel: { width: 340, height: 380, backgroundColor: '#fff', borderRadius: 12, padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 12, elevation: 10, borderWidth: 1, borderColor: '#efefef' },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  closeBtn: { padding: 6 },
  logoSmall: { width: 36, height: 36, borderRadius: 8 },
  history: { flex: 1, backgroundColor: '#fafafa', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#f0f0f0' },
  inputRow: { flexDirection: 'row', marginTop: 8, alignItems: 'center' }
});

const styles = StyleSheet.create({
  input: { flex: 1, borderWidth: 1, borderColor: '#e6e6ee', borderRadius: 8, padding: 8, marginRight: 8 },
  sendBtn: { backgroundColor: THEME.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }
});
