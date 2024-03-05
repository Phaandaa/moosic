import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './components/ui/loadingstate';
import { Ionicons } from '@expo/vector-icons';

// Pages
import LoginPage from './screens/login';
import HomeScreen from './screens/home';
import ProfileScreen from './screens/profilepage';
import NotificationsScreen from './screens/notificationspage';


//Student Pages
import GoalsScreen from './screens/studentsScreens/goalsScreen';

import ViewAssignmentsScreen from './screens/studentsScreens/ViewAssignmentsScreen';
import CreatePracticeScreen from './screens/studentsScreens/CreatePracticeScreen';
import ViewPracticeStudentScreen from './screens/studentsScreens/ViewPracticeStudentScreen';
import SubmitAssignmentScreen from './screens/studentsScreens/SubmitAssignmentScreen';
import AssignmentListScreen from  './screens/studentsScreens/AssignmentListScreen';
import PracticeListStudentScreen from './screens/studentsScreens/PracticeListStudentScreen';

//Teacher Pages
import CreateAssignmentScreen from './screens/teachersScreens/CreateAssignmentScreen';
import CreatedAssignmentDetailsScreen from './screens/teachersScreens/CreatedAssignmentDetailsScreen';
import MyStudentsScreen from './screens/teachersScreens/MyStudentsScreen';
import CreatedAssignmentsListScreen from './screens/teachersScreens/CreatedAssignmentsListScreen';
import PracticeListTeacherScreen from './screens/teachersScreens/PracticeListTeacherScreen';
import ProvidePracticeFeedbackScreen from './screens/teachersScreens/ProvidePracticeFeedbackScreen';
import ViewCreatedGoalsForStudents from './screens/teachersScreens/ViewCreatedGoalsForStudents';
import CreateGoalsForStudents from './screens/teachersScreens/CreateGoalsForStudentsScreen';

import ProvideAssignmentFeedbackScreen from './screens/teachersScreens/ProvideAssignmentFeedbackScreen';
import ViewPracticeTeacherScreen from './screens/teachersScreens/ViewPracticeTeacherScreen';

// Cache and Context
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider, useAuth } from './context/Authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StudentTabs() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
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
          return <Ionicons name={iconName} size={25} color={color} />;
        },
        tabBarActiveTintColor: '#4664EA',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 15, paddingTop: 15, height: 75 },
        headerShown: false,
        
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function TeacherTabs() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'My Students':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Notifications':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={25} color={color} />;
        },
        tabBarActiveTintColor: '#4664EA',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 15, paddingTop: 15, height: 75 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="My Students" component={MyStudentsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </Provider>
    </AuthProvider>
  );
};

const RootNavigator = () => {
  const { state } = useAuth();
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Added state to track loading status

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Start loading
        const storedData = await AsyncStorage.getItem('authData');
        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          setUserRole(parsedData.role); // Set user role based on fetched data
        }
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage', error);
      } finally {
        setIsLoading(false); // End loading
      }
    };
    fetchData();
  }, []);

  if (isLoading || state.isLoading) {
    return <LoadingScreen />; // Show loading screen while fetching data or app state is loading
  }

  return (
    <Stack.Navigator >
      {state.isLoading ? (
        <Stack.Screen name="Loading" component={LoadingScreen} />
      ) : state.isLoggedIn ? (
        userRole === 'Student' ? (
          <>
          <Stack.Screen name="StudentTabs" component={StudentTabs} options={{ headerShown: false }}/>
          <Stack.Screen name="AssignmentListScreen" component={AssignmentListScreen} options={{ title: 'Assignment List'}} />
          <Stack.Screen name="SubmitAssignmentScreen" component={SubmitAssignmentScreen} options={{ title: 'Submit Assignment' }} />
          <Stack.Screen name="CreatePracticeScreen" component={CreatePracticeScreen} options={{ title: 'Start Practice' }} />
          <Stack.Screen name="ViewAssignmentsScreen" component={ViewAssignmentsScreen} options={{ title: 'My Assignment' }} />
          <Stack.Screen name="PracticeListStudentScreen" component={PracticeListStudentScreen} options={{ title: 'My Practice Log' }} />
          <Stack.Screen name="ViewPracticeStudentScreen" component={ViewPracticeStudentScreen} options={{ title: 'My Practice Details' }} />
          </>
        ) : (
          <>
          <Stack.Screen name="TeacherTabs" component={TeacherTabs} options={{ headerShown: false }}/>
          <Stack.Screen name="CreateAssignmentScreen" component={CreateAssignmentScreen} options={{ title: 'Create Assignment' }} />
          <Stack.Screen name="CreatedAssignmentsListScreen" component={CreatedAssignmentsListScreen} options={{ title: 'Created Assignments' }} />
           <Stack.Screen name="CreatedAssignmentDetailsScreen" component={CreatedAssignmentDetailsScreen} options={{ title: 'Created Assignment' }} />
           <Stack.Screen name="ProvideAssignmentFeedbackScreen" component={ProvideAssignmentFeedbackScreen} options={{ title: 'Provide Feedback' }} />
           <Stack.Screen name="ViewPracticeTeacherScreen" component={ViewPracticeTeacherScreen} options={{ title: 'View Practice Details' }} />
           <Stack.Screen name="ViewCreatedGoalsForStudents" component={ViewCreatedGoalsForStudents} options={{ title: 'View Created Goals' }} />
           <Stack.Screen name="CreateGoalsForStudents" component={CreateGoalsForStudents} options={{ title: 'Create Goals' }} />
           <Stack.Screen name="PracticeListTeacherScreen" component={PracticeListTeacherScreen} options={{ title: 'Practice Log' }} />
          <Stack.Screen name="ProvidePracticeFeedbackScreen" component={ProvidePracticeFeedbackScreen} options={{ title: 'Provide Feedback' }} />
           </>
        )
      ) : (
        <Stack.Screen name="LoginScreen" component={LoginPage} options={{ headerShown: false }}/>
      )}
    </Stack.Navigator>
  );
};

export default App;


