import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Button, Alert,TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './components/ui/loadingstate';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

// Pages
import LoginPage from './screens/login';
import HomeScreen from './screens/home';
import ProfileScreen from './screens/profilepage';
import NotificationsScreen from './screens/notificationspage';
import CustomTabBarButton from './components/navbar/CustomTabBarButton';

//Student Pages
import GoalsScreen from './screens/studentsScreens/goalsScreen';

import ViewAssignmentsScreen from './screens/studentsScreens/ViewAssignmentsScreen';
import CreatePracticeScreen from './screens/studentsScreens/CreatePracticeScreen';
import ViewPracticeStudentScreen from './screens/studentsScreens/ViewPracticeStudentScreen';
import SubmitAssignmentScreen from './screens/studentsScreens/SubmitAssignmentScreen';
import AssignmentListScreen from  './screens/studentsScreens/AssignmentListScreen';
import PracticeListStudentScreen from './screens/studentsScreens/PracticeListStudentScreen';
import RewardsShopScreen from './screens/studentsScreens/RewardsShopScreen';
import SetReminderScreen from './screens/studentsScreens/SetReminderScreen';

//Teacher Pages
import CreateAssignmentScreen from './screens/teachersScreens/CreateAssignmentScreen';
import EditAssignmentScreen from './screens/teachersScreens/EditAssignmentScreen';
import CreatedAssignmentDetailsScreen from './screens/teachersScreens/CreatedAssignmentDetailsScreen';
import MyStudentsScreen from './screens/teachersScreens/MyStudentsScreen';
import CreatedAssignmentsListScreen from './screens/teachersScreens/CreatedAssignmentsListScreen';
import PracticeListTeacherScreen from './screens/teachersScreens/PracticeListTeacherScreen';
import ProvidePracticeFeedbackScreen from './screens/teachersScreens/ProvidePracticeFeedbackScreen';
import ViewCreatedGoalsForStudents from './screens/teachersScreens/ViewCreatedGoalsForStudents';
import CreateGoalsForStudents from './screens/teachersScreens/CreateGoalsForStudentsScreen';

import ProvideAssignmentFeedbackScreen from './screens/teachersScreens/ProvideAssignmentFeedbackScreen';
import ViewPracticeTeacherScreen from './screens/teachersScreens/ViewPracticeTeacherScreen';

import TeacherRepository from './screens/teachersScreens/TeacherRepository';

// Cache and Context
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider, useAuth } from './context/Authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNotifications } from './context/notificationsContext';
import { saveNotification } from './context/notificationsContext';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AddPlaceholderScreen() {
  return <View />;
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: "266a78dd-0994-4876-8ba9-92801ff17fb2",
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}



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
            case 'New':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Rewards Shop':
              iconName = focused ? 'cart' : 'cart-outline';
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
      <Tab.Screen
        name="New"
        component={AddPlaceholderScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={40} color={color} />
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          ),
          tabBarLabel: () => {return null}
          
        }}
      />
      <Tab.Screen name="Rewards Shop" component={RewardsShopScreen} />
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
            case 'MyStudentsScreen':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'New':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Repository':
              iconName = focused ? 'documents' : 'documents-outline';
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
      <Tab.Screen name="MyStudentsScreen" component={MyStudentsScreen} options={{tabBarLabel: "My Students"}}/>
      <Tab.Screen
          name="New"
          component={AddPlaceholderScreen} // This is just a placeholder since the tab opens a modal
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={40} color={color} />
            ),
            tabBarButton: (props) => (
              <CustomTabBarButton {...props}>
                <Ionicons name="add-circle-outline" size={40} color={"gray"} />
              </CustomTabBarButton>
            ),
            tabBarLabel: () => {return null},
          }}
        />
      <Tab.Screen name="Repository" component={TeacherRepository} options={{tabBarLabel: "Repository"}}/>
      {/* <Tab.Screen name="Notifications" component={NotificationsScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ expoPushToken }} />
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
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
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
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(async notification => {
      console.log('Notification received:', notification);

      if (notification.remote) {
        console.log('Push notification received:', notification);
        console.log(notification.request.content.data.message);
      } else {
        console.log('Local notification received:', notification);
        // Handle local notification
      }
  
      // Save the received notification to AsyncStorage
      const newNotificationData = {
        id: notification.request.identifier, 
        message: notification.request.content.data.message,
        time: new Date().toISOString(),
      };
  
      try {
        const existingNotificationsJson = await getNotifications();
        const existingNotifications = existingNotificationsJson ? JSON.parse(existingNotificationsJson) : [];
  
        const updatedNotifications = [...existingNotifications, newNotificationData];
  
        // Save the updated list back to AsyncStorage
        await saveNotification (updatedNotifications);
        console.log('Notification data saved to cache.');
      } catch (error) {
        console.error('Error saving notification to cache:', error);
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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
          
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
          <Stack.Screen name="AssignmentListScreen" component={AssignmentListScreen} options={{ title: 'Assignment List'}} />
          <Stack.Screen name="SubmitAssignmentScreen" component={SubmitAssignmentScreen} options={{ title: 'Submit Assignment' }} />
          <Stack.Screen name="CreatePracticeScreen" component={CreatePracticeScreen} options={{ title: 'Start Practice' }} />
          <Stack.Screen name="ViewAssignmentsScreen" component={ViewAssignmentsScreen} options={{ title: 'My Assignment' }} />
          <Stack.Screen name="PracticeListStudentScreen" component={PracticeListStudentScreen} options={{ title: 'My Practice Log' }} />
          <Stack.Screen name="ViewPracticeStudentScreen" component={ViewPracticeStudentScreen} options={{ title: 'My Practice Details' }} />
          <Stack.Screen name="RewardsShopScreen" component={RewardsShopScreen} options={{ title: 'Rewards Shop' }} />
          <Stack.Screen name="SetReminderScreen" component={SetReminderScreen} options={{ title: 'Set Practice Reminder' }} />

          </>
        ) : (
          <>
          <Stack.Screen name="TeacherTabs" component={TeacherTabs} options={{ headerShown: false }}/>
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
          <Stack.Screen name="CreateAssignmentScreen" component={CreateAssignmentScreen} options={{ title: 'Create Assignment' }} />
          <Stack.Screen name="EditAssignmentScreen" component={EditAssignmentScreen} options={{ title: 'Edit Assignment' }} />
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
        <Stack.Screen name="LoginScreen" component={LoginPage} options={{ headerShown: false }} initialParams={{ expoPushToken }}/>
      )}
    </Stack.Navigator>
  );
};

export default App;


