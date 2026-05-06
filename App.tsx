import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { SyncProvider, useSyncContext } from './src/context/SyncContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { isFirebaseConfigured } from './src/config/firebase';
import AppNavigator from './src/navigation/AppNavigator';
import FamilySetupScreen from './src/screens/FamilySetupScreen';
import LoginScreen from './src/screens/LoginScreen';

function Root() {
  const { ready } = useAppContext();
  const { syncReady, familyCode } = useSyncContext();
  const { user, loading: authLoading } = useAuth();

  if (!ready || !syncReady || (isFirebaseConfigured && authLoading)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (isFirebaseConfigured && !user) {
    return <LoginScreen />;
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
        <AuthProvider>
          <SyncProvider>
            <StatusBar style="light" />
            <Root />
          </SyncProvider>
        </AuthProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
