import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSyncContext } from '../context/SyncContext';

type Mode = 'choose' | 'join';

export default function FamilySetupScreen() {
  const { createFamily, joinFamily } = useSyncContext();
  const [mode, setMode] = useState<Mode>('choose');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    setLoading(true);
    setError('');
    try {
      await createFamily();
    } catch {
      setError('Could not create family. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    setLoading(true);
    setError('');
    const result = await joinFamily(joinCode);
    setLoading(false);
    if (!result.success) setError(result.error ?? 'Something went wrong.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.logo}>🏠</Text>
        <Text style={styles.title}>Chore Tracker</Text>
        <Text style={styles.subtitle}>Sync across devices by joining a family group</Text>

        {mode === 'choose' && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleCreate} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.primaryBtnTitle}>Create a Family</Text>
                  <Text style={styles.primaryBtnSub}>Start fresh — share the code with family members</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setMode('join')} disabled={loading}>
              <Text style={styles.secondaryBtnTitle}>Join a Family</Text>
              <Text style={styles.secondaryBtnSub}>Enter a code shared by another device</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        )}

        {mode === 'join' && (
          <View style={styles.optionsContainer}>
            <Text style={styles.inputLabel}>Enter the 6-character family code</Text>
            <TextInput
              style={styles.codeInput}
              value={joinCode}
              onChangeText={(t) => setJoinCode(t.toUpperCase())}
              placeholder="e.g. ABC123"
              placeholderTextColor="#bbb"
              autoCapitalize="characters"
              maxLength={6}
              returnKeyType="done"
              onSubmitEditing={handleJoin}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.primaryBtn, styles.joinConfirmBtn]}
              onPress={handleJoin}
              disabled={loading || joinCode.length !== 6}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnTitle}>Join Family</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backBtn} onPress={() => { setMode('choose'); setError(''); setJoinCode(''); }}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5fb' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  logo: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#888', textAlign: 'center', marginBottom: 40 },
  optionsContainer: { width: '100%', gap: 14 },
  primaryBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  joinConfirmBtn: { marginTop: 6 },
  primaryBtnTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  primaryBtnSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0ef',
  },
  secondaryBtnTitle: { fontSize: 17, fontWeight: '700', color: '#6C63FF' },
  secondaryBtnSub: { fontSize: 13, color: '#888', marginTop: 4 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8 },
  codeInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#6C63FF',
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: 6,
    textAlign: 'center',
  },
  error: { fontSize: 14, color: '#e74c3c', textAlign: 'center', marginTop: 4 },
  backBtn: { alignItems: 'center', padding: 10, marginTop: 4 },
  backBtnText: { fontSize: 15, color: '#6C63FF', fontWeight: '600' },
});
