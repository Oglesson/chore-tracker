import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { SyncProvider, useSyncContext } from './src/context/SyncContext';
import { isFirebaseConfigured } from './src/config/firebase';
import AppNavigator from './src/navigation/AppNavigator';
import FamilySetupScreen from './src/screens/FamilySetupScreen';

function Root() {
  const { ready } = useAppContext();
  const { syncReady, familyCode } = useSyncContext();

  if (!ready || !syncReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (isFirebaseConfigured && !familyCode) {
    return <FamilySetupScreen />;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <SyncProvider>
          <StatusBar style="light" />
          <Root />
        </SyncProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
