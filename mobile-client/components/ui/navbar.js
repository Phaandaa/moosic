import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screen components
import HomeScreen from '../../screens/home';
import ProfileScreen from '../../screens/profilepage';
import GoalsScreen from '../../screens/goalsScreen';
import NotificationsScreen from '../../screens/notificationspage';
import MyStudentsScreen from '../../screens/MyStudentsScreen';
import ViewCreatedAssignmentsScreen from '../../screens/ViewCreatedAssignmentsScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const storedData = await AsyncStorage.getItem('authData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserRole(parsedData.role); // Ensure this matches your stored data structure
      }
    };

    fetchUserRole();
  }, []);

  if (userRole === null) {
    return null; // Or a loading spinner
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'My Students':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'View Assignments':
              iconName = focused ? 'document-text' : 'document-text-outline';
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
            // Add more cases as needed
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4664EA',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 60 },
      })}
    >
      {/* Common screens */}
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      

      {/* Conditional tabs based on userRole */}
      {userRole === 'Teacher' && (
        <>
          <Tab.Screen name="My Students" component={MyStudentsScreen} options={{ headerShown: false }} />
          <Tab.Screen name="View Assignments" component={ViewCreatedAssignmentsScreen} options={{ headerShown: false }} />
        </>
      )}

      {userRole === 'Student' && (
        <>
          <Tab.Screen name="Goals" component={GoalsScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
        </>
      )}
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
