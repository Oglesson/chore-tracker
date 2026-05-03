import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Text } from 'react-native';
import { RootStackParamList } from './AppNavigator';
import ChildChoresScreen from '../screens/child/ChildChoresScreen';
import ChildPointsScreen from '../screens/child/ChildPointsScreen';
import ChildHistoryScreen from '../screens/child/ChildHistoryScreen';

export type ChildTabParamList = {
  ChildChores: { childId: string };
  ChildPoints: { childId: string };
  ChildHistory: { childId: string };
};

const Tab = createBottomTabNavigator<ChildTabParamList>();

export default function ChildTabNavigator() {
  const route = useRoute<RouteProp<RootStackParamList, 'ChildView'>>();
  const { childId } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { paddingBottom: 4 },
      }}
    >
      <Tab.Screen
        name="ChildChores"
        component={ChildChoresScreen}
        initialParams={{ childId }}
        options={{
          title: 'My Chores',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>✓</Text>,
        }}
      />
      <Tab.Screen
        name="ChildPoints"
        component={ChildPointsScreen}
        initialParams={{ childId }}
        options={{
          title: 'My Points',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>⭐</Text>,
        }}
      />
      <Tab.Screen
        name="ChildHistory"
        component={ChildHistoryScreen}
        initialParams={{ childId }}
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📋</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
