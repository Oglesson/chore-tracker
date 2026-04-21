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

  function addChild() {
    const trimmed = name.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD_CHILD', payload: { name: trimmed } });
    setName('');
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Child's name"
            value={name}
            onChangeText={setName}
            onSubmitEditing={addChild}
            returnKeyType="done"
            accessibilityLabel="Child name input"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addChild} accessibilityLabel="Add child">
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={state.children}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState message="No children added yet." />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.childName}>{item.name}</Text>
              <Text style={styles.pts}>{item.totalPoints} pts</Text>
              <TouchableOpacity
                onPress={() => confirmRemove(item.id, item.name)}
                style={styles.removeBtn}
                accessibilityLabel={`Remove ${item.name}`}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
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
  inputRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  list: { padding: 16, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  childName: { flex: 1, fontSize: 16, fontWeight: '500', color: '#1a1a2e' },
  pts: { fontSize: 14, color: '#6C63FF', fontWeight: '600', marginRight: 12 },
  removeBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#e74c3c' },
  removeText: { color: '#e74c3c', fontWeight: '600' },
});
