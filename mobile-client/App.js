import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './components/ui/navbar';
import LoadingScreen from './components/ui/loadingstate';

// Pages
import LoginPage from './screens/login';

//Student Pages
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
          <Stack.Screen name="CreatePracticeScreen" component={CreatePracticeScreen} options={{ title: 'Start Practice' }} />
          <Stack.Screen name="MyStudentsScreen" component={MyStudentsScreen} options={{ title: 'My Students', headerShown: false }} />
          <Stack.Screen name="CreatedAssignmentsListScreen" component={CreatedAssignmentsListScreen} options={{ title: 'Created Assignments' }} />
          <Stack.Screen name="ViewAssignmentsScreen" component={ViewAssignmentsScreen} options={{ title: 'My Assignment' }} />
          <Stack.Screen name="PracticeListTeacherScreen" component={PracticeListTeacherScreen} options={{ title: 'Practice Log' }} />
          <Stack.Screen name="ProvidePracticeFeedbackScreen" component={ProvidePracticeFeedbackScreen} options={{ title: 'Provide Feedback' }} />
          <Stack.Screen name="PracticeListStudentScreen" component={PracticeListStudentScreen} options={{ title: 'My Practice Log' }} />
          <Stack.Screen name="ViewPracticeStudentScreen" component={ViewPracticeStudentScreen} options={{ title: 'My Practice Details' }} />
          <Stack.Screen name="SubmitAssignmentScreen" component={SubmitAssignmentScreen} options={{ title: 'Submit Assignment' }} />
          <Stack.Screen name="AssignmentListScreen" component={AssignmentListScreen} options={{ title: 'Assignment List' }} />
          <Stack.Screen name="CreatedAssignmentDetailsScreen" component={CreatedAssignmentDetailsScreen} options={{ title: 'Created Assignment' }} />
          <Stack.Screen name="ProvideAssignmentFeedbackScreen" component={ProvideAssignmentFeedbackScreen} options={{ title: 'Provide Feedback' }} />
          <Stack.Screen name="ViewPracticeTeacherScreen" component={ViewPracticeTeacherScreen} options={{ title: 'View Practice Details' }} />
          <Stack.Screen name="ViewCreatedGoalsForStudents" component={ViewCreatedGoalsForStudents} options={{ title: 'View Created Goals' }} />
          <Stack.Screen name="CreateGoalsForStudents" component={CreateGoalsForStudents} options={{ title: 'Create Goals' }} />

        </>
              
      ) : (
        // User is not logged in
        <Stack.Screen name="LoginScreen" component={LoginPage} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default App;


