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
        <FlatList
          data={state.children}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState message="No children added yet." />}
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
  inputRow: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
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
  list: { padding: 16, flexGrow: 1 },
  row: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
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
