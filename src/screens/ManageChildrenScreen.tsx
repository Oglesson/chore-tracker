import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import EmptyState from '../components/EmptyState';

export default function ManageChildrenScreen() {
  const { state, dispatch } = useAppContext();
  const [name, setName] = useState('');
  const [rewardTarget, setRewardTarget] = useState('100');
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [editTargetValue, setEditTargetValue] = useState('');

  function addChild() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const target = parseInt(rewardTarget, 10);
    dispatch({ type: 'ADD_CHILD', payload: { name: trimmed, rewardTarget: target > 0 ? target : 100 } });
    setName('');
    setRewardTarget('100');
  }

  function confirmRemove(childId: string, childName: string) {
    Alert.alert(
      `Remove ${childName}?`,
      'All their chore history and points will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_CHILD', payload: { childId } }) },
      ]
    );
  }

  function startEditTarget(childId: string, current: number) {
    setEditTargetId(childId);
    setEditTargetValue(String(current));
  }

  function saveTarget(childId: string) {
    const val = parseInt(editTargetValue, 10);
    if (val > 0) {
      dispatch({ type: 'SET_REWARD_TARGET', payload: { childId, rewardTarget: val } });
    }
    setEditTargetId(null);
  }

  function promptSetPin() {
    const currentPin = state.parentPin ?? '';
    const title = currentPin ? 'Change Parent PIN' : 'Set Parent PIN';
    const msg = currentPin
      ? 'Enter a new PIN (leave blank to remove PIN protection).'
      : 'Set a numeric PIN to protect parent mode.';
    Alert.alert(title, msg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Set PIN',
        onPress: () => {
          // Cross-platform: use a simple inline form instead of Alert.prompt
          // We repurpose the child add section temporarily — instead, open the inline PIN editor
          setShowPinEditor(true);
        },
      },
    ]);
  }

  const [showPinEditor, setShowPinEditor] = useState(false);
  const [pinValue, setPinValue] = useState('');

  function savePin() {
    dispatch({ type: 'SET_PARENT_PIN', payload: { pin: pinValue.trim() } });
    setPinValue('');
    setShowPinEditor(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <View style={styles.formSection}>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputName]}
              placeholder="Child's name"
              value={name}
              onChangeText={setName}
              onSubmitEditing={addChild}
              returnKeyType="next"
              accessibilityLabel="Child name input"
            />
            <TextInput
              style={[styles.input, styles.inputTarget]}
              placeholder="Goal pts"
              value={rewardTarget}
              onChangeText={setRewardTarget}
              onSubmitEditing={addChild}
              keyboardType="numeric"
              returnKeyType="done"
              accessibilityLabel="Reward target input"
            />
            <TouchableOpacity style={styles.addBtn} onPress={addChild} accessibilityLabel="Add child">
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>Set a points goal — the child earns a reward when they reach it.</Text>
        </View>

        {showPinEditor && (
          <View style={styles.pinEditor}>
            <Text style={styles.pinEditorTitle}>
              {state.parentPin ? 'Change PIN (blank to remove)' : 'Set Parent PIN'}
            </Text>
            <View style={styles.pinRow}>
              <TextInput
                style={[styles.input, styles.pinInput]}
                value={pinValue}
                onChangeText={setPinValue}
                keyboardType="number-pad"
                secureTextEntry
                placeholder="New PIN"
                autoFocus
                maxLength={8}
                returnKeyType="done"
                onSubmitEditing={savePin}
              />
              <TouchableOpacity style={styles.addBtn} onPress={savePin}>
                <Text style={styles.addBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelPinBtn} onPress={() => { setPinValue(''); setShowPinEditor(false); }}>
                <Text style={styles.cancelPinText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <FlatList
          data={state.children}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState message="No children added yet." />}
          ListHeaderComponent={
            <TouchableOpacity style={styles.pinBtn} onPress={promptSetPin}>
              <Text style={styles.pinBtnText}>
                {state.parentPin ? '🔒 Change Parent PIN' : '🔓 Set Parent PIN'}
              </Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.childName}>{item.name}</Text>
                <Text style={styles.pts}>{item.totalPoints} pts</Text>
              </View>
              <View style={styles.rowSub}>
                <Text style={styles.targetLabel}>Goal: </Text>
                {editTargetId === item.id ? (
                  <TextInput
                    style={styles.targetInput}
                    value={editTargetValue}
                    onChangeText={setEditTargetValue}
                    keyboardType="numeric"
                    autoFocus
                    onBlur={() => saveTarget(item.id)}
                    onSubmitEditing={() => saveTarget(item.id)}
                    returnKeyType="done"
                  />
                ) : (
                  <TouchableOpacity onPress={() => startEditTarget(item.id, item.rewardTarget)}>
                    <Text style={styles.targetValue}>{item.rewardTarget} pts ✏️</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => confirmRemove(item.id, item.name)}
                  style={styles.removeBtn}
                  accessibilityLabel={`Remove ${item.name}`}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5fb' },
  inner: { flex: 1 },
  formSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  inputRow: { flexDirection: 'row', padding: 16, paddingBottom: 8, gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputName: { flex: 1 },
  inputTarget: { width: 90, textAlign: 'center' },
  addBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  hint: { fontSize: 12, color: '#888', paddingHorizontal: 16, paddingBottom: 4 },
  pinEditor: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 16,
  },
  pinEditorTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 10 },
  pinRow: { flexDirection: 'row', gap: 8 },
  pinInput: { flex: 1, textAlign: 'center', letterSpacing: 4 },
  cancelPinBtn: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelPinText: { color: '#888', fontWeight: '600' },
  pinBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pinBtnText: { color: '#6C63FF', fontWeight: '600', fontSize: 15 },
  list: { padding: 16, flexGrow: 1 },
  row: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 8 },
  rowMain: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  childName: { flex: 1, fontSize: 16, fontWeight: '500', color: '#1a1a2e' },
  pts: { fontSize: 14, color: '#6C63FF', fontWeight: '600' },
  rowSub: { flexDirection: 'row', alignItems: 'center' },
  targetLabel: { fontSize: 13, color: '#888' },
  targetValue: { fontSize: 13, color: '#6C63FF', fontWeight: '600', marginRight: 8 },
  targetInput: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: '#6C63FF',
    marginRight: 8,
    minWidth: 60,
    paddingVertical: 0,
  },
  removeBtn: { marginLeft: 'auto', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#e74c3c' },
  removeText: { color: '#e74c3c', fontWeight: '600', fontSize: 13 },
});
