import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import { RootStackParamList } from '../navigation/AppNavigator';

type Route = RouteProp<RootStackParamList, 'ManageChores'>;

export default function ManageChoresScreen() {
  const { childId } = useRoute<Route>().params;
  const { state, dispatch } = useAppContext();

  const child = state.children.find((c) => c.id === childId);
  if (!child) return null;

  const assignedSet = new Set(child.assignedChoreIds);

  function toggle(choreId: string) {
    if (assignedSet.has(choreId)) {
      dispatch({ type: 'UNASSIGN_CHORE', payload: { childId, choreId } });
    } else {
      dispatch({ type: 'ASSIGN_CHORE', payload: { childId, choreId } });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          {child.assignedChoreIds.length} of {state.choreCatalogue.length} chores assigned
        </Text>
      </View>
      <FlatList
        data={state.choreCatalogue}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState message="No chores in the catalogue yet. Add some from the Chore Catalogue screen." />
        }
        renderItem={({ item }) => {
          const assigned = assignedSet.has(item.id);
          return (
            <TouchableOpacity
              style={[styles.row, assigned && styles.rowAssigned]}
              onPress={() => toggle(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: assigned }}
            >
              <View style={[styles.checkbox, assigned && styles.checkboxChecked]}>
                {assigned && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.choreInfo}>
                <Text style={[styles.choreLabel, !assigned && styles.choreLabelDim]}>
                  {item.label}
                </Text>
                <Text style={styles.chorePoints}>{item.points} pts</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5fb' },
  infoBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoText: { fontSize: 13, color: '#888' },
  list: { padding: 16, flexGrow: 1 },
  row: {
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
  rowAssigned: { backgroundColor: '#f0eeff' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxChecked: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  checkmark: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  choreInfo: { flex: 1 },
  choreLabel: { fontSize: 16, fontWeight: '500', color: '#1a1a2e' },
  choreLabelDim: { color: '#999' },
  chorePoints: { fontSize: 12, color: '#888', marginTop: 2 },
});
