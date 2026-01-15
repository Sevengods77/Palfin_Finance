import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Animated, TextInput, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { sharedStyles } from '../../theme/sharedStyles';
import { theme } from '../../theme/theme';
import { addTransaction, categorizeTransaction } from '../../services/transactionService';

export default function FintelVoiceCapture({ visible, onClose }) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isRecording]);

  // Web Speech API Ref
  const recognitionRef = React.useRef(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'en-IN';
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log('Recognized:', transcript);
          setTranscribedText(transcript);
          parseText(transcript);
          setProcessing(false);
          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
          setProcessing(false);
          // Fallback if needed or alert
          if (event.error === 'not-allowed') {
            alert('Microphone permission denied.');
          }
        };

        recognitionRef.current.onend = () => {
          if (isRecording) { // If it stopped but we didn't trigger it manually (silence)
            setIsRecording(false);
            setProcessing(false);
          }
        };
      }
    }
  }, []);

  async function startRecording() {
    setIsRecording(true);
    setParsedData(null);
    setTranscribedText('');

    if (Platform.OS === 'web' && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start web recognition', e);
        setIsRecording(false);
      }
    } else {
      // Native or unsupported web fallback
      // For native, we'd need a real STT API (Google Cloud/AWS/OpenAI) using audio blob.
      // For now, we keep the simulation ONLY for native to avoid breaking the app there.
      try {
        if (permissionResponse.status !== 'granted') {
          await requestPermission();
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
      } catch (err) {
        console.error('Native recording error', err);
        setIsRecording(false);
      }
    }
  }

  async function stopRecording() {
    if (Platform.OS === 'web' && recognitionRef.current) {
      recognitionRef.current.stop();
      setProcessing(true);
      // Result handled in onresult
    } else {
      // Native Simulation Fallback
      setRecording(undefined);
      setIsRecording(false);
      if (recording) await recording.stopAndUnloadAsync();

      setProcessing(true);
      setTimeout(() => {
        const mockPhrases = [
          "Spent 500 rupees on groceries at BigBasket",
          "Paid 1200 for electricity bill",
        ];
        const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
        setTranscribedText(randomPhrase);
        parseText(randomPhrase);
        setProcessing(false);
      }, 1500);
    }
  }

  const parseText = (text) => {
    if (!text) return;
    const lowerText = text.toLowerCase();

    // 1. Extract Amount
    // Matches: "rs 500", "500 rs", "500"
    const amountMatch = text.match(/(\d+(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

    // 2. Extract Merchant (Improved)
    // ... (keeping merchant extraction logic) ... 

    // 3. Extract Category using Centralized Logic
    // We pass the full text to the service helper
    let category = categorizeTransaction(text);

    // 3. Extract Merchant/Description
    // heuristic: remove amount, currency keywords, phrases like "paid for", "spent on"
    let merchant = text
      .replace(amountMatch ? amountMatch[0] : '', '')
      .replace(/(rs|rupees|inr|paid|spent|for|on|at|in|to|the|a|an)/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // If empty or just category name, make it descriptive
    if (merchant.length < 3) merchant = category + ' Expense';

    setParsedData({ amount, category, merchant, originalText: text });
  };

  const handleConfirm = () => {
    if (parsedData) {
      addTransaction(parsedData.amount, parsedData.merchant, 'debit');
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Fintel Voice Capture</Text>
          <Text style={styles.subtitle}>Hold button to record transaction</Text>

          <View style={styles.recordContainer}>
            <TouchableOpacity
              onPressIn={startRecording}
              onPressOut={stopRecording}
              style={styles.micButtonWrapper}
            >
              <Animated.View style={[styles.micButton, { transform: [{ scale: scaleAnim }] }]}>
                <Text style={styles.micIcon}>🎙️</Text>
              </Animated.View>
            </TouchableOpacity>
            <Text style={styles.statusText}>
              {isRecording ? 'Recording...' : processing ? 'Processing...' : 'Press & Hold'}
            </Text>
          </View>

          {parsedData && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Captured (Tap to Edit):</Text>
              <TextInput
                style={styles.transcribedInput}
                value={transcribedText}
                onChangeText={(text) => {
                  setTranscribedText(text);
                  parseText(text);
                }}
                multiline
              />

              <View style={styles.parsedBox}>
                <View style={styles.row}>
                  <Text style={styles.label}>Amount:</Text>
                  <Text style={styles.value}>₹{parsedData.amount}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Category:</Text>
                  <Text style={styles.value}>{parsedData.category}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Merchant:</Text>
                  <Text style={styles.value}>{parsedData.merchant}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm & Save</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
    fontFamily: 'Quintessential',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 32,
  },
  recordContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  micButtonWrapper: {
    marginBottom: 16,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  micIcon: {
    fontSize: 32,
  },
  statusText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    width: '100%',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  resultLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  transcribedInput: {
    color: theme.colors.text,
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
    paddingBottom: 4,
  },
  parsedBox: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: theme.colors.textSecondary,
  },
  value: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: theme.colors.success,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
  },
  closeButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});
