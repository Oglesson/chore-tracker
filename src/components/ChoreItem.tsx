import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChoreDefinition } from '../types';

interface Props {
  chore: ChoreDefinition;
  logged: boolean;
  onPress: () => void;
}

export default function ChoreItem({ chore, logged, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.row, logged && styles.rowLogged]}
      onPress={onPress}
      disabled={logged}
      accessibilityRole="button"
      accessibilityState={{ disabled: logged }}
    >
      <View style={styles.check}>{logged && <Text style={styles.tick}>✓</Text>}</View>
      <Text style={[styles.label, logged && styles.labelLogged]}>{chore.label}</Text>
      <Text style={[styles.points, logged && styles.pointsLogged]}>+{chore.points} pts</Text>
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
  tick: { color: '#6C63FF', fontWeight: 'bold', fontSize: 14 },
  label: { flex: 1, fontSize: 16, color: '#1a1a2e' },
  labelLogged: { color: '#999' },
  points: { fontSize: 14, fontWeight: '600', color: '#6C63FF' },
  pointsLogged: { color: '#bbb' },
});
