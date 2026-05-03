import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppContext } from '../../context/AppContext';
import { ChildTabParamList } from '../../navigation/ChildTabNavigator';
import ChoreItem from '../../components/ChoreItem';
import EmptyState from '../../components/EmptyState';
import { CHORE_CATALOGUE } from '../../constants/chores';

type Route = RouteProp<ChildTabParamList, 'ChildChores'>;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ChildChoresScreen() {
  const { childId } = useRoute<Route>().params;
  const { state, dispatch } = useAppContext();

  const child = state.children.find((c) => c.id === childId);
  const today = todayISO();

  const todayEntries = child?.entries.filter((e) => e.completedAt === today) ?? [];
  const verifiedTodayIds = new Set(todayEntries.filter((e) => e.verified).map((e) => e.choreId));
  const pendingTodayIds = new Set(todayEntries.filter((e) => !e.verified).map((e) => e.choreId));

  const verifiedPoints = todayEntries.filter((e) => e.verified).reduce((s, e) => s + e.points, 0);

  function logChore(choreId: string) {
    const chore = CHORE_CATALOGUE.find((c) => c.id === choreId);
    if (!chore || !child) return;
    dispatch({ type: 'LOG_CHORE', payload: { childId, chore, date: today, verified: false } });
  }

  if (!child) return <EmptyState message="Child not found." />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {child.name}!</Text>
        <Text style={styles.todayScore}>Today: {verifiedPoints} pts</Text>
      </View>
      <FlatList
        data={CHORE_CATALOGUE}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ChoreItem
            chore={item}
            logged={verifiedTodayIds.has(item.id)}
            pending={pendingTodayIds.has(item.id)}
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
  greeting: { fontSize: 16, fontWeight: '600', color: '#1a1a2e' },
  todayScore: { fontSize: 16, fontWeight: '700', color: '#6C63FF' },
  list: { padding: 16 },
});
