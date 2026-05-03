import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppContext } from '../../context/AppContext';
import { ChildTabParamList } from '../../navigation/ChildTabNavigator';
import EmptyState from '../../components/EmptyState';

type Route = RouteProp<ChildTabParamList, 'ChildPoints'>;

export default function ChildPointsScreen() {
  const { childId } = useRoute<Route>().params;
  const { state } = useAppContext();

  const child = state.children.find((c) => c.id === childId);
  if (!child) return <EmptyState message="Child not found." />;

  const { totalPoints, rewardTarget } = child;
  const progress = Math.min(totalPoints / rewardTarget, 1);
  const remaining = Math.max(rewardTarget - totalPoints, 0);
  const achieved = totalPoints >= rewardTarget;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{child.name}'s Points</Text>

        <View style={styles.pointsCircle}>
          <Text style={styles.pointsNumber}>{totalPoints}</Text>
          <Text style={styles.pointsLabel}>pts</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>

        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% of {rewardTarget} pt goal
        </Text>

        {achieved ? (
          <View style={styles.celebrationBanner}>
            <Text style={styles.celebrationText}>You earned your reward!</Text>
          </View>
        ) : (
          <Text style={styles.remainingText}>
            {remaining} more pts to go!
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5fb' },
  content: { flex: 1, alignItems: 'center', paddingTop: 40, paddingHorizontal: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 32 },
  pointsCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  pointsNumber: { fontSize: 48, fontWeight: '800', color: '#fff', lineHeight: 52 },
  pointsLabel: { fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  progressTrack: {
    width: '100%',
    height: 16,
    backgroundColor: '#e0deff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 8,
  },
  progressText: { fontSize: 14, color: '#888', marginBottom: 24 },
  remainingText: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  celebrationBanner: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  celebrationText: { fontSize: 18, fontWeight: '700', color: '#fff' },
});
