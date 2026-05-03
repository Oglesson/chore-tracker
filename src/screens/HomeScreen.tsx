import React, { useLayoutEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import { useParentMode } from '../context/ParentModeContext';
import ChildCard from '../components/ChildCard';
import EmptyState from '../components/EmptyState';
import PinModal from '../components/PinModal';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const { state } = useAppContext();
  const { isParentMode, enterParentMode, exitParentMode } = useParentMode();
  const navigation = useNavigation<Nav>();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleParentToggle}
          style={styles.headerBtn}
          accessibilityLabel={isParentMode ? 'Exit parent mode' : 'Enter parent mode'}
        >
          <Text style={styles.headerBtnText}>
            {isParentMode ? '🔓 Exit' : '🔒 Parent'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [isParentMode, state.parentPin]);

  function handleParentToggle() {
    if (isParentMode) {
      exitParentMode();
    } else if (state.parentPin) {
      setPinError(false);
      setShowPinModal(true);
    } else {
      enterParentMode();
    }
  }

  function handlePinSubmit(pin: string) {
    const ok = enterParentMode(pin);
    if (ok) {
      setShowPinModal(false);
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={state.children}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            message={
              isParentMode
                ? 'No children yet. Tap + to add one.'
                : 'No children added yet. Ask a parent to set up the app.'
            }
          />
        }
        renderItem={({ item }) => (
          <ChildCard
            child={item}
            isParentMode={isParentMode}
            onLogChores={() => navigation.navigate('Chores', { childId: item.id, childName: item.name })}
            onViewHistory={() => navigation.navigate('History', { childId: item.id, childName: item.name })}
            onManageChores={() => navigation.navigate('ManageChores', { childId: item.id, childName: item.name })}
            onChildView={() => navigation.navigate('ChildView', { childId: item.id, childName: item.name })}
          />
        )}
      />
      {isParentMode && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('ManageChildren')}
          accessibilityLabel="Manage children"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
      <PinModal
        visible={showPinModal}
        onSubmit={handlePinSubmit}
        onCancel={() => { setShowPinModal(false); setPinError(false); }}
        showError={pinError}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5fb' },
  list: { padding: 16, flexGrow: 1 },
  headerBtn: { marginRight: 14, paddingVertical: 4 },
  headerBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
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
