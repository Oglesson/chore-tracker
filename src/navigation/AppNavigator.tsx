import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ChoreScreen from '../screens/ChoreScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ManageChildrenScreen from '../screens/ManageChildrenScreen';
import ChildTabNavigator from './ChildTabNavigator';

export type RootStackParamList = {
  Home: undefined;
  Chores: { childId: string; childName: string };
  History: { childId: string; childName: string };
  ManageChildren: undefined;
  ChildView: { childId: string; childName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#6C63FF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Chore Tracker' }} />
        <Stack.Screen name="Chores" component={ChoreScreen} options={({ route }) => ({ title: `${route.params.childName}'s Chores` })} />
        <Stack.Screen name="History" component={HistoryScreen} options={({ route }) => ({ title: `${route.params.childName}'s History` })} />
        <Stack.Screen name="ManageChildren" component={ManageChildrenScreen} options={{ title: 'Manage Children' }} />
        <Stack.Screen
          name="ChildView"
          component={ChildTabNavigator}
          options={({ route }) => ({ title: `${route.params.childName}'s View` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
