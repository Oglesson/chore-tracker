import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import ChildCard from '../components/ChildCard';
import EmptyState from '../components/EmptyState';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = StackNavigationProp<RootStackParamList, 'ParentDashboard'>;

export default function HomeScreen() {
  const { state } = useAppContext();
  const navigation = useNavigation<Nav>();

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
          />
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ManageChildren')}
        accessibilityLabel="Manage children"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5fb' },
  list: { padding: 16, flexGrow: 1 },
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
});
