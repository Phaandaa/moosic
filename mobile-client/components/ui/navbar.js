// BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screen components
import HomeScreen from '../../screens/home';
import GoalsScreen from '../../screens/goalsScreen';
import NotificationsScreen from '../../screens/notificationspage';
import ProfileScreen from '../../screens/profilepage';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Goals':
              iconName = focused ? 'flag' : 'flag-outline';
              break;
            case 'Notifications':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          
          paddingBottom: 5, // Increase vertical padding
          height: 60, // You might want to increase the height as well
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Goals" component={GoalsScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
