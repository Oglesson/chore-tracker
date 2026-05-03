import React from 'react';
import { View, SectionList, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
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

interface Section {
  title: string;
  subtitle?: string;
  data: ChoreEntry[];
  isPending?: boolean;
}

function buildSections(entries: ChoreEntry[]): Section[] {
  const pending = entries.filter((e) => !e.verified);
  const verified = entries.filter((e) => e.verified);

  const sections: Section[] = [];

  if (pending.length > 0) {
    sections.push({ title: 'Needs Approval', data: pending, isPending: true });
  }

  const dateMap = new Map<string, ChoreEntry[]>();
  for (const e of verified) {
    const list = dateMap.get(e.completedAt) ?? [];
    list.push(e);
    dateMap.set(e.completedAt, list);
  }

  const dateSections = Array.from(dateMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, dayEntries]) => ({
      title: date,
      subtitle: `+${dayEntries.reduce((s, e) => s + e.points, 0)} pts`,
      data: dayEntries,
    }));

  return [...sections, ...dateSections];
}

export default function HistoryScreen() {
  const { state, dispatch } = useAppContext();
  const { params } = useRoute<Route>();

  const child = state.children.find((c) => c.id === params.childId);
  const sections = buildSections(child?.entries ?? []);

  function confirmRemove(entryId: string, isVerified: boolean) {
    const msg = isVerified
      ? 'This will deduct the points.'
      : 'This will discard the pending chore.';
    Alert.alert('Remove entry?', msg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => dispatch({ type: 'REMOVE_ENTRY', payload: { childId: params.childId, entryId } }),
      },
    ]);
  }

  function verifyEntry(entryId: string) {
    dispatch({ type: 'VERIFY_ENTRY', payload: { childId: params.childId, entryId } });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Total Score</Text>
        <Text style={styles.totalValue}>{child?.totalPoints ?? 0} pts</Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No chores logged yet." />}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, section.isPending && styles.sectionHeaderPending]}>
            <Text style={[styles.sectionTitle, section.isPending && styles.sectionTitlePending]}>
              {section.title}
            </Text>
            {section.subtitle && (
              <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
            )}
          </View>
        )}
        renderItem={({ item: entry, section }) =>
          section.isPending ? (
            <View style={styles.pendingEntry}>
              <Text style={styles.pendingLabel}>{choreLabelById(entry.choreId)}</Text>
              <Text style={styles.pendingPts}>+{entry.points} pts</Text>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => verifyEntry(entry.id)}
              >
                <Text style={styles.approveBtnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => confirmRemove(entry.id, false)}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.entry}>
              <Text style={styles.entryLabel}>{choreLabelById(entry.choreId)}</Text>
              <Text style={styles.entryPoints}>+{entry.points}</Text>
              <TouchableOpacity
                onPress={() => confirmRemove(entry.id, true)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          )
        }
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
  list: { padding: 16, flexGrow: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 8,
  },
  sectionHeaderPending: { marginTop: 0 },
  sectionTitle: { fontWeight: '600', color: '#555', fontSize: 14 },
  sectionTitlePending: { color: '#B45309', fontSize: 14 },
  sectionSubtitle: { fontWeight: '700', color: '#6C63FF', fontSize: 13 },
  pendingEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  pendingLabel: { flex: 1, fontSize: 15, color: '#92400E' },
  pendingPts: { fontSize: 14, fontWeight: '600', color: '#D97706', marginRight: 8 },
  approveBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
  },
  approveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
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
