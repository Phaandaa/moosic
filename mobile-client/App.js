import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './components/ui/navbar';

//pages
import LoginPage from './screens/login';
import HomePage from './screens/home';
import CreateAssignmentScreen from './screens/CreateAssignmentScreen';
import MyStudentsScreen from './screens/MyStudentsScreen';
import ViewCreatedAssignmentsScreen from './screens/ViewCreatedAssignmentsScreen';
import ProfileScreen from './screens/profilepage';
import PracticeScreen from './screens/PracticeScreen';
import NotificationsScreen from './screens/notificationspage';
import GoalsScreen from './screens/goalsScreen';


//cache
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider } from './screens/context/Authcontext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginPage} options={{title: 'Login', headerShown: false}}/>
        <Stack.Screen name="HomeScreen" component={HomePage} options={{title: 'Home', headerShown: false}}/>
        <Stack.Screen name="CreateAssignmentScreen" component={CreateAssignmentScreen} options={{title: 'Create Assignment'}}/>
        <Stack.Screen name="PracticeScreen" component={PracticeScreen} options={{title: 'Start Practice'}}/>
        <Stack.Screen name="MyStudentsScreen" component={MyStudentsScreen} options={{title: 'My Students'}}/>
        <Stack.Screen name="ViewCreatedAssignmentsScreen" component={ViewCreatedAssignmentsScreen} options={{title: 'Assignments'}}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{title: 'Profile'}}/>
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} options={{title: 'Notifications'}}/>
        <Stack.Screen name="GoalsScreen" component={GoalsScreen} options={{title: 'Goals'}}/>
      </Stack.Navigator>
      {/* Bottom navigation bar */}
      <BottomTabNavigator />
    </NavigationContainer>
    </Provider>
    </AuthProvider>
  );
};

export default App;