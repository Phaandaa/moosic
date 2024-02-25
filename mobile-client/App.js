import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './components/ui/navbar';
import LoadingScreen from './components/ui/loadingstate';

// Pages
import LoginPage from './screens/login';

//Student Pages
import ViewAssignmentsScreen from './screens/studentsScreens/ViewAssignmentsScreen';
import PracticeScreen from './screens/studentsScreens/PracticeScreen';
import PracticeListStudentScreen from './screens/studentsScreens/PracticeListStudentScreen';
import ViewPracticeFeedbackScreen from './screens/studentsScreens/ViewPracticeFeedbackScreen';
import SubmitAssignmentScreen from './screens/studentsScreens/SubmitAssignmentScreen';
import AssignmentListScreen from  './screens/studentsScreens/AssignmentListScreen';

//Teacher Pages
import CreateAssignmentScreen from './screens/teachersScreens/CreateAssignmentScreen';
import MyStudentsScreen from './screens/teachersScreens/MyStudentsScreen';
import ViewCreatedAssignmentsScreen from './screens/teachersScreens/ViewCreatedAssignmentsScreen';
import PracticeListTeacherScreen from './screens/teachersScreens/PracticeListTeacherScreen';
import ProvidePracticeFeedbackScreen from './screens/teachersScreens/ProvidePracticeFeedbackScreen';

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
          <RootNavigator />
        </NavigationContainer>
      </Provider>
    </AuthProvider>
  );
};

const RootNavigator = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {state.isLoggedIn ? (
        // User is logged in
        <>
          <Stack.Screen name="MainApp" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="CreateAssignmentScreen" component={CreateAssignmentScreen} options={{ title: 'Create Assignment' }} />
          <Stack.Screen name="PracticeScreen" component={PracticeScreen} options={{ title: 'Start Practice' }} />
          <Stack.Screen name="MyStudentsScreen" component={MyStudentsScreen} options={{ title: 'My Students', headerShown: false }} />
          <Stack.Screen name="ViewCreatedAssignmentsScreen" component={ViewCreatedAssignmentsScreen} options={{ title: 'Created Assignments' }} />
          <Stack.Screen name="ViewAssignmentsScreen" component={ViewAssignmentsScreen} options={{ title: 'My Assignment' }} />
          <Stack.Screen name="PracticeListTeacherScreen" component={PracticeListTeacherScreen} options={{ title: 'Practice Log' }} />
          <Stack.Screen name="ProvidePracticeFeedbackScreen" component={ProvidePracticeFeedbackScreen} options={{ title: 'Provide Feedback' }} />
          <Stack.Screen name="PracticeListStudentScreen" component={PracticeListStudentScreen} options={{ title: 'My Practice Log' }} />
          <Stack.Screen name="ViewPracticeFeedbackScreen" component={ViewPracticeFeedbackScreen} options={{ title: 'View Feedback' }} />
          <Stack.Screen name="SubmitAssignmentScreen" component={SubmitAssignmentScreen} options={{ title: 'Submit Assignment' }} />
          <Stack.Screen name="AssignmentListScreen" component={AssignmentListScreen} options={{ title: 'Assignment List' }} />
        </>
              
      ) : (
        // User is not logged in
        <Stack.Screen name="LoginScreen" component={LoginPage} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default App;


