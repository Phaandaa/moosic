import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './components/ui/navbar';
import LoadingScreen from './components/ui/loadingstate';

// Pages
import LoginPage from './screens/login';
import CreateAssignmentScreen from './screens/CreateAssignmentScreen';
import MyStudentsScreen from './screens/MyStudentsScreen';
import ViewCreatedAssignmentsScreen from './screens/ViewCreatedAssignmentsScreen';
import ViewAssignmentsScreen from './screens/ViewAssignmentsScreen';
import PracticeScreen from './screens/PracticeScreen';
import PracticeListTeacherScreen from './screens/PracticeListTeacherScreen';
import ProvidePracticeFeedbackScreen from './screens/ProvidePracticeFeedbackScreen';
import PracticeListStudentScreen from './screens/PracticeListStudentScreen';
import ViewPracticeFeedbackScreen from './screens/ViewPracticeFeedbackScreen';

// Cache and Context
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider, useAuth } from './context/Authcontext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <NavigationContainer>
          <AuthNavigation />
        </NavigationContainer>
      </Provider>
    </AuthProvider>
  );
};

const AuthNavigation = () => {
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(state.isLoggedIn === null);
  }, [state.isLoggedIn]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {state.isLoggedIn ? (
        <>
          <Stack.Screen name="MainApp" component={BottomTabNavigator} options={{ headerShown: false }} />
          {/* You can place other screens here if they are part of the main app */}
                <Stack.Screen name="CreateAssignmentScreen" component={CreateAssignmentScreen} options={{ title: 'Create Assignment' }}/>
                <Stack.Screen name="PracticeScreen" component={PracticeScreen} options={{ title: 'Start Practice' }}/>
                <Stack.Screen name="MyStudentsScreen" component={MyStudentsScreen} options={{ title: 'My Students' }}/>
                <Stack.Screen name="ViewCreatedAssignmentsScreen" component={ViewCreatedAssignmentsScreen} options={{ title: 'Created Assignments' }}/>
                <Stack.Screen name="ViewAssignmentsScreen" component={ViewAssignmentsScreen} options={{ title: 'My Assignments' }}/>
                <Stack.Screen name="PracticeListTeacherScreen" component={PracticeListTeacherScreen} options={{ title: 'Practice Log' }}/>
                <Stack.Screen name="ProvidePracticeFeedbackScreen" component={ProvidePracticeFeedbackScreen} options={{ title: 'Provide Feedback' }}/>
                <Stack.Screen name="PracticeListStudentScreen" component={PracticeListStudentScreen} options={{ title: 'My Practice Log' }}/>
                <Stack.Screen name="ViewPracticeFeedbackScreen" component={ViewPracticeFeedbackScreen} options={{ title: 'View Feedback' }}/>
              </>
            ) : (
              // User is not logged in, show the login screen
              <Stack.Screen name="LoginScreen" component={LoginPage} options={{ title: 'Login', headerShown: false }}/>
            )}
          </Stack.Navigator>
  );
};

export default App;


