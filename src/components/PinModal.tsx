import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Props {
  visible: boolean;
  title?: string;
  onSubmit: (pin: string) => void;
  onCancel: () => void;
  showError?: boolean;
}

export default function PinModal({ visible, title = 'Enter Parent PIN', onSubmit, onCancel, showError }: Props) {
  const [pin, setPin] = useState('');

  function handleSubmit() {
    onSubmit(pin);
    setPin('');
  }

  function handleCancel() {
    setPin('');
    onCancel();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            style={[styles.input, showError && styles.inputError]}
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={8}
            placeholder="PIN"
            autoFocus
            onSubmitEditing={handleSubmit}
          />
          {showError && <Text style={styles.errorText}>Incorrect PIN. Try again.</Text>}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 280,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 20 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 8,
  },
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 13, marginBottom: 8 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelText: { color: '#888', fontWeight: '600' },
  submitBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '600' },
});
