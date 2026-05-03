import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppContext } from '../../context/AppContext';
import { ChildTabParamList } from '../../navigation/ChildTabNavigator';
import EmptyState from '../../components/EmptyState';
import { CHORE_CATALOGUE } from '../../constants/chores';

type Route = RouteProp<ChildTabParamList, 'ChildHistory'>;

export default function ChildHistoryScreen() {
  const { childId } = useRoute<Route>().params;
  const { state } = useAppContext();

  const child = state.children.find((c) => c.id === childId);
  if (!child) return <EmptyState message="Child not found." />;

  const summary = CHORE_CATALOGUE.map((chore) => {
    const verified = child.entries.filter((e) => e.choreId === chore.id && e.verified);
    const pending = child.entries.filter((e) => e.choreId === chore.id && !e.verified).length;
    return {
      id: chore.id,
      label: chore.label,
      count: verified.length,
      pending,
      totalPoints: verified.reduce((s, e) => s + e.points, 0),
    };
  }).filter((s) => s.count > 0 || s.pending > 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Total Points</Text>
        <Text style={styles.totalPoints}>{child.totalPoints} pts</Text>
      </View>
      <FlatList
        data={summary}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No chores completed yet." />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.choreName}>{item.label}</Text>
              <View style={styles.badges}>
                {item.count > 0 && (
                  <Text style={styles.countBadge}>Done {item.count}×</Text>
                )}
                {item.pending > 0 && (
                  <Text style={styles.pendingBadge}>⏳ {item.pending} pending</Text>
                )}
              </View>
            </View>
            <Text style={styles.points}>{item.totalPoints} pts</Text>
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
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  totalLabel: { fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  totalPoints: { fontSize: 22, fontWeight: '800', color: '#fff' },
  list: { padding: 16, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rowInfo: { flex: 1 },
  choreName: { fontSize: 16, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
  badges: { flexDirection: 'row', gap: 6 },
  countBadge: { fontSize: 12, color: '#6C63FF', fontWeight: '600' },
  pendingBadge: { fontSize: 12, color: '#B45309', fontWeight: '600' },
  points: { fontSize: 16, fontWeight: '700', color: '#6C63FF' },
});
