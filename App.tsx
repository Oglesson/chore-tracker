import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useAppContext } from './src/context/AppContext';
import { ParentModeProvider } from './src/context/ParentModeContext';
import AppNavigator from './src/navigation/AppNavigator';

function Root() {
  const { ready } = useAppContext();
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }
  return <AppNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <ParentModeProvider>
          <StatusBar style="light" />
          <Root />
        </ParentModeProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
