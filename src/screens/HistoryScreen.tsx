import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import { ChoreEntry } from '../types';
import { CHORE_CATALOGUE } from '../constants/chores';
import { RootStackParamList } from '../navigation/AppNavigator';

type Route = RouteProp<RootStackParamList, 'History'>;

function choreLabelById(id: string): string {
  return CHORE_CATALOGUE.find((c) => c.id === id)?.label ?? id;
}

interface DayGroup {
  date: string;
  entries: ChoreEntry[];
  subtotal: number;
}

function groupByDate(entries: ChoreEntry[]): DayGroup[] {
  const map = new Map<string, ChoreEntry[]>();
  for (const e of entries) {
    const list = map.get(e.completedAt) ?? [];
    list.push(e);
    map.set(e.completedAt, list);
  }
  return Array.from(map.entries())
    .map(([date, entries]) => ({ date, entries, subtotal: entries.reduce((s, e) => s + e.points, 0) }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export default function HistoryScreen() {
  const { state, dispatch } = useAppContext();
  const { params } = useRoute<Route>();

  const child = state.children.find((c) => c.id === params.childId);
  const groups = groupByDate(child?.entries ?? []);

  function confirmRemove(entryId: string) {
    Alert.alert('Remove entry?', 'This will deduct the points.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_ENTRY', payload: { childId: params.childId, entryId } }) },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Total Score</Text>
        <Text style={styles.totalValue}>{child?.totalPoints ?? 0} pts</Text>
      </View>
      <FlatList
        data={groups}
        keyExtractor={(g) => g.date}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No chores logged yet." />}
        renderItem={({ item: group }) => (
          <View style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupDate}>{group.date}</Text>
              <Text style={styles.groupSubtotal}>+{group.subtotal} pts</Text>
            </View>
            {group.entries.map((entry) => (
              <View key={entry.id} style={styles.entry}>
                <Text style={styles.entryLabel}>{choreLabelById(entry.choreId)}</Text>
                <Text style={styles.entryPoints}>+{entry.points}</Text>
                <TouchableOpacity onPress={() => confirmRemove(entry.id)} style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5fb' },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#6C63FF',
  },
  totalLabel: { color: '#fff', fontSize: 16 },
  totalValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  list: { padding: 16 },
  group: { marginBottom: 16 },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  groupDate: { fontWeight: '600', color: '#555' },
  groupSubtotal: { fontWeight: '700', color: '#6C63FF' },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
  },
  entryLabel: { flex: 1, fontSize: 15, color: '#1a1a2e' },
  entryPoints: { fontSize: 14, fontWeight: '600', color: '#6C63FF', marginRight: 8 },
  deleteBtn: { padding: 4 },
  deleteText: { color: '#e74c3c', fontWeight: '600' },
});
