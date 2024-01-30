import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './screens/login';
import HomePage from './screens/home';
import CreateAssignmentScreen from './screens/CreateAssignmentScreen';
import MyStudentsScreen from './screens/MyStudentsScreen';
import ViewCreatedAssignmentsScreen from './screens/ViewCreatedAssignmentsScreen';
import PracticeScreen from './screens/PracticeScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginPage} options={{title: 'Login', headerShown: false}}/>
        <Stack.Screen name="HomeScreen" component={HomePage} options={{title: 'Home', headerShown: false}}/>
        <Stack.Screen name="CreateAssignmentScreen" component={CreateAssignmentScreen} options={{title: 'Create Assignment'}}/>
        <Stack.Screen name="PracticeScreen" component={PracticeScreen} options={{title: 'Start Practice'}}/>
        <Stack.Screen name="MyStudentsScreen" component={MyStudentsScreen} options={{title: 'My Students'}}/>
        <Stack.Screen name="ViewCreatedAssignmentsScreen" component={ViewCreatedAssignmentsScreen} options={{title: 'Assignments'}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;