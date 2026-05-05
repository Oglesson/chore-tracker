import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import { useSyncContext } from '../context/SyncContext';
import { isFirebaseConfigured } from '../config/firebase';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Child } from '../types';

type Nav = StackNavigationProp<RootStackParamList, 'MainMenu'>;

export default function MainMenuScreen() {
  const { state } = useAppContext();
  const navigation = useNavigation<Nav>();
  const { familyCode, isOnline, leaveFamily } = useSyncContext();

  function handleLeaveFamily() {
    Alert.alert(
      'Leave Family?',
      'Your local data stays on this device, but it will no longer sync.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: leaveFamily },
      ],
    );
  }

  const totalPending = state.children.reduce(
    (sum, c) => sum + c.entries.filter((e) => !e.verified).length,
    0
  );

  function renderChild({ item }: { item: Child }) {
    const pending = item.entries.filter((e) => !e.verified).length;
    return (
      <TouchableOpacity
        style={styles.childCard}
        onPress={() => navigation.navigate('ChildView', { childId: item.id, childName: item.name })}
        accessibilityLabel={`Open ${item.name}'s view`}
      >
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{item.name}</Text>
          {pending > 0 && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>⏳ {pending} pending</Text>
            </View>
          )}
        </View>
        <Text style={styles.childPoints}>{item.totalPoints} pts</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.parentCard}
        onPress={() => navigation.navigate('ParentDashboard')}
        accessibilityLabel="Open parent dashboard"
      >
        <View style={styles.parentCardContent}>
          <Text style={styles.parentTitle}>Parent Dashboard</Text>
          <Text style={styles.parentSubtitle}>Manage children, chores &amp; history</Text>
          {totalPending > 0 && (
            <View style={styles.approvalBadge}>
              <Text style={styles.approvalBadgeText}>
                {totalPending} chore{totalPending !== 1 ? 's' : ''} awaiting approval
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.parentArrow}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Who's using the app?</Text>

      <FlatList
        data={state.children}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        renderItem={renderChild}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No children added yet.</Text>
            <Text style={styles.emptyHint}>Open Parent Dashboard to get started.</Text>
          </View>
        }
      />

      {isFirebaseConfigured && familyCode && (
        <View style={[styles.syncBar, !isOnline && styles.syncBarOffline]}>
          <View style={[styles.syncDot, !isOnline && styles.syncDotOffline]} />
          <Text style={styles.syncText}>
            {isOnline ? 'Syncing' : 'Offline'} · Family code:{' '}
            <Text style={styles.syncCode}>{familyCode}</Text>
          </Text>
          <TouchableOpacity onPress={handleLeaveFamily}>
            <Text style={styles.leaveBtn}>Leave</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5fb' },
  parentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    margin: 16,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  parentCardContent: { flex: 1 },
  parentTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 2 },
  parentSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  parentArrow: { fontSize: 28, color: 'rgba(255,255,255,0.7)', marginLeft: 8 },
  approvalBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  approvalBadgeText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  list: { paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1 },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  childInfo: { flex: 1 },
  childName: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  pendingBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pendingBadgeText: { fontSize: 11, color: '#B45309', fontWeight: '600' },
  childPoints: { fontSize: 18, fontWeight: '700', color: '#6C63FF', marginRight: 8 },
  arrow: { fontSize: 22, color: '#ccc' },
  emptyContainer: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 16, color: '#888', marginBottom: 6 },
  emptyHint: { fontSize: 14, color: '#aaa' },
  syncBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef0ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  syncBarOffline: { backgroundColor: '#f5f5f5' },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  syncDotOffline: { backgroundColor: '#aaa' },
  syncText: { flex: 1, fontSize: 13, color: '#555' },
  syncCode: { fontWeight: '700', color: '#6C63FF' },
  leaveBtn: { fontSize: 13, color: '#e74c3c', fontWeight: '600' },
});
