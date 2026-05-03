import React from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import ChoreItem from '../components/ChoreItem';
import { RootStackParamList } from '../navigation/AppNavigator';
import EmptyState from '../components/EmptyState';

type Route = RouteProp<RootStackParamList, 'Chores'>;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ChoreScreen() {
  const { state, dispatch } = useAppContext();
  const { params } = useRoute<Route>();
  const today = todayISO();

  const child = state.children.find((c) => c.id === params.childId);
  const loggedTodayIds = new Set(
    child?.entries.filter((e) => e.completedAt === today).map((e) => e.choreId) ?? []
  );

  function logChore(choreId: string) {
    const chore = child?.assignedChores.find((c) => c.id === choreId);
    if (!chore) return;
    dispatch({ type: 'LOG_CHORE', payload: { childId: params.childId, chore, date: today, verified: true } });
  }

  const totalToday = child?.entries
    .filter((e) => e.completedAt === today && e.verified)
    .reduce((sum, e) => sum + e.points, 0) ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.todayScore}>Today: {totalToday} pts</Text>
      </View>
      <FlatList
        data={child?.assignedChores ?? []}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No chores assigned. Tap 'Chores' to add some." />}
        renderItem={({ item }) => (
          <ChoreItem
            chore={item}
            logged={loggedTodayIds.has(item.id)}
            onPress={() => logChore(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5fb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: { fontSize: 14, color: '#888' },
  todayScore: { fontSize: 16, fontWeight: '700', color: '#6C63FF' },
  list: { padding: 16 },
});
