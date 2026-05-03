import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChoreDefinition } from '../types';

interface Props {
  chore: ChoreDefinition;
  logged: boolean;
  pending?: boolean;
  onPress: () => void;
}

export default function ChoreItem({ chore, logged, pending = false, onPress }: Props) {
  const isDisabled = logged || pending;

  return (
    <TouchableOpacity
      style={[styles.row, logged && styles.rowLogged, pending && styles.rowPending]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      <View style={[styles.check, pending && styles.checkPending]}>
        {logged && <Text style={styles.tick}>✓</Text>}
        {pending && <Text style={styles.clock}>⏳</Text>}
      </View>
      <View style={styles.labelCol}>
        <Text style={[styles.label, logged && styles.labelLogged, pending && styles.labelPending]}>
          {chore.label}
        </Text>
        {pending && <Text style={styles.pendingHint}>Waiting for approval</Text>}
      </View>
      <Text style={[styles.points, logged && styles.pointsLogged, pending && styles.pointsPending]}>
        +{chore.points} pts
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  rowLogged: { backgroundColor: '#f0eeff' },
  rowPending: { backgroundColor: '#fff8e1' },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkPending: { borderColor: '#F59E0B' },
  tick: { color: '#6C63FF', fontWeight: 'bold', fontSize: 14 },
  clock: { fontSize: 12 },
  labelCol: { flex: 1 },
  label: { fontSize: 16, color: '#1a1a2e' },
  labelLogged: { color: '#999' },
  labelPending: { color: '#92400E' },
  pendingHint: { fontSize: 11, color: '#B45309', marginTop: 2 },
  points: { fontSize: 14, fontWeight: '600', color: '#6C63FF' },
  pointsLogged: { color: '#bbb' },
  pointsPending: { color: '#D97706' },
});
