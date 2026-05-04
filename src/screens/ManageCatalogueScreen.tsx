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
import { ChoreDefinition } from '../types';

export default function ManageCatalogueScreen() {
  const { state, dispatch } = useAppContext();

  const [newLabel, setNewLabel] = useState('');
  const [newPoints, setNewPoints] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editPoints, setEditPoints] = useState('');

  function addChore() {
    const label = newLabel.trim();
    const points = parseInt(newPoints, 10);
    if (!label || !(points > 0)) return;
    dispatch({ type: 'ADD_CATALOGUE_CHORE', payload: { label, points } });
    setNewLabel('');
    setNewPoints('');
  }

  function startEdit(chore: ChoreDefinition) {
    setEditingId(chore.id);
    setEditLabel(chore.label);
    setEditPoints(String(chore.points));
  }

  function saveEdit(choreId: string) {
    const label = editLabel.trim();
    const points = parseInt(editPoints, 10);
    if (label && points > 0) {
      dispatch({ type: 'EDIT_CATALOGUE_CHORE', payload: { chore: { id: choreId, label, points } } });
    }
    setEditingId(null);
  }

  function confirmRemove(chore: ChoreDefinition) {
    const assignedCount = state.children.filter((c) =>
      c.assignedChoreIds.includes(chore.id)
    ).length;

    const msg =
      assignedCount > 0
        ? `This chore is assigned to ${assignedCount} child${assignedCount !== 1 ? 'ren' : ''}. Removing it will unassign it from them.`
        : 'This chore will be permanently removed from the list.';

    Alert.alert(`Remove "${chore.label}"?`, msg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => dispatch({ type: 'REMOVE_CATALOGUE_CHORE', payload: { choreId: chore.id } }),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Add Chore</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputLabel]}
              placeholder="Chore name"
              value={newLabel}
              onChangeText={setNewLabel}
              returnKeyType="next"
              accessibilityLabel="New chore name"
            />
            <TextInput
              style={[styles.input, styles.inputPoints]}
              placeholder="Pts"
              value={newPoints}
              onChangeText={setNewPoints}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={addChore}
              accessibilityLabel="New chore points"
            />
            <TouchableOpacity style={styles.addBtn} onPress={addChore} accessibilityLabel="Add chore">
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={state.choreCatalogue}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState message="No chores in the catalogue yet. Add one above." />}
          renderItem={({ item }) => {
            const assignedCount = state.children.filter((c) =>
              c.assignedChoreIds.includes(item.id)
            ).length;

            return editingId === item.id ? (
              <View style={styles.editRow}>
                <TextInput
                  style={[styles.input, styles.inputLabel]}
                  value={editLabel}
                  onChangeText={setEditLabel}
                  autoFocus
                  returnKeyType="next"
                />
                <TextInput
                  style={[styles.input, styles.inputPoints]}
                  value={editPoints}
                  onChangeText={setEditPoints}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={() => saveEdit(item.id)}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={() => saveEdit(item.id)}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingId(null)}>
                  <Text style={styles.cancelBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.choreRow}>
                <View style={styles.choreInfo}>
                  <Text style={styles.choreLabel}>{item.label}</Text>
                  <Text style={styles.choreSubtext}>
                    {item.points} pts default
                    {assignedCount > 0 ? ` · assigned to ${assignedCount}` : ''}
                  </Text>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => startEdit(item)}>
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeBtn} onPress={() => confirmRemove(item)}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            );
          }}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  formTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 10 },
  inputRow: { flexDirection: 'row', gap: 8 },
  editRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  inputLabel: { flex: 1 },
  inputPoints: { width: 70, textAlign: 'center' },
  addBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '600' },
  saveBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  cancelBtn: { padding: 8, justifyContent: 'center' },
  cancelBtnText: { color: '#888', fontWeight: '600', fontSize: 16 },
  list: { padding: 16, flexGrow: 1 },
  choreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  choreInfo: { flex: 1 },
  choreLabel: { fontSize: 16, fontWeight: '500', color: '#1a1a2e' },
  choreSubtext: { fontSize: 12, color: '#888', marginTop: 2 },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6C63FF',
    marginRight: 6,
  },
  editBtnText: { color: '#6C63FF', fontWeight: '600', fontSize: 13 },
  removeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  removeBtnText: { color: '#e74c3c', fontWeight: '600' },
});
