import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import ChildCard from '../components/ChildCard';
import EmptyState from '../components/EmptyState';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Child } from '../types';

type Nav = StackNavigationProp<RootStackParamList, 'ParentDashboard'>;

export default function HomeScreen() {
  const { state, dispatch } = useAppContext();
  const navigation = useNavigation<Nav>();

  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState('');

  function openEdit(child: Child) {
    setEditingChild(child);
    setEditName(child.name);
    setEditTarget(String(child.rewardTarget));
  }

  function saveEdit() {
    if (!editingChild) return;
    const trimmed = editName.trim();
    if (!trimmed) return;
    const target = parseInt(editTarget, 10);
    dispatch({
      type: 'EDIT_CHILD',
      payload: { childId: editingChild.id, name: trimmed, rewardTarget: target > 0 ? target : editingChild.rewardTarget },
    });
    setEditingChild(null);
  }

  function confirmRemove() {
    if (!editingChild) return;
    Alert.alert(
      `Remove ${editingChild.name}?`,
      'All their chore history and points will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'REMOVE_CHILD', payload: { childId: editingChild.id } });
            setEditingChild(null);
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={state.children}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.catalogueBtn}
            onPress={() => navigation.navigate('ManageCatalogue')}
            accessibilityLabel="Manage chore catalogue"
          >
            <View style={styles.catalogueBtnContent}>
              <Text style={styles.catalogueBtnTitle}>Chore Catalogue</Text>
              <Text style={styles.catalogueBtnSubtitle}>
                {state.choreCatalogue.length} chore{state.choreCatalogue.length !== 1 ? 's' : ''} defined
              </Text>
            </View>
            <Text style={styles.catalogueArrow}>›</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={<EmptyState message="No children yet. Tap + to add one." />}
        renderItem={({ item }) => (
          <ChildCard
            child={item}
            onLogChores={() => navigation.navigate('Chores', { childId: item.id, childName: item.name })}
            onViewHistory={() => navigation.navigate('History', { childId: item.id, childName: item.name })}
            onManageChores={() => navigation.navigate('ManageChores', { childId: item.id, childName: item.name })}
            onChildView={() => navigation.navigate('ChildView', { childId: item.id, childName: item.name })}
            onEdit={() => openEdit(item)}
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ManageChildren')}
        accessibilityLabel="Add child"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={editingChild !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingChild(null)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Child</Text>

            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Child's name"
              autoFocus
              returnKeyType="next"
            />

            <Text style={styles.fieldLabel}>Points goal</Text>
            <TextInput
              style={styles.input}
              value={editTarget}
              onChangeText={setEditTarget}
              placeholder="e.g. 100"
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={saveEdit}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.removeChildBtn} onPress={confirmRemove}>
                <Text style={styles.removeChildText}>Remove child</Text>
              </TouchableOpacity>
              <View style={styles.modalPrimaryActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingChild(null)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5fb' },
  list: { padding: 16, flexGrow: 1, paddingBottom: 100 },
  catalogueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  catalogueBtnContent: { flex: 1 },
  catalogueBtnTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a2e' },
  catalogueBtnSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  catalogueArrow: { fontSize: 22, color: '#ccc', marginLeft: 8 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1a1a2e',
    marginBottom: 16,
  },
  modalActions: { marginTop: 4, gap: 12 },
  removeChildBtn: { alignItems: 'center', paddingVertical: 8 },
  removeChildText: { color: '#e74c3c', fontSize: 14, fontWeight: '600' },
  modalPrimaryActions: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#888' },
  saveBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#6C63FF',
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
