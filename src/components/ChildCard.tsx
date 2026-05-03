import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Child } from '../types';

interface Props {
  child: Child;
  onLogChores: () => void;
  onViewHistory: () => void;
  onChildView: () => void;
}

export default function ChildCard({ child, onLogChores, onViewHistory, onChildView }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{child.name}</Text>
        <Text style={styles.points}>{child.totalPoints} pts</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={onLogChores}>
          <Text style={styles.btnText}>Log Chores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onViewHistory}>
          <Text style={[styles.btnText, styles.btnTextSecondary]}>History</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.childViewBtn} onPress={onChildView}>
        <Text style={styles.childViewText}>Switch to {child.name}'s View</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  points: { fontSize: 20, fontWeight: '700', color: '#6C63FF' },
  actions: { flexDirection: 'row', gap: 8 },
  btn: {
    flex: 1,
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#6C63FF' },
  btnText: { color: '#fff', fontWeight: '600' },
  btnTextSecondary: { color: '#6C63FF' },
  childViewBtn: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f0eeff',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  childViewText: { color: '#6C63FF', fontWeight: '600', fontSize: 14 },
});
