// HomeScreen.js
import React from 'react';
import { View, Text} from 'react-native';
import BoxComponent from '../components/ui/homepageModuleBoxes';
import theme from './styles/theme';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={theme.container}>
      <Text style={theme.titleText}>Welcome!</Text>

      <BoxComponent  color="#686BFF" title="Knowledge" subtitle="Hand and Finger Work" iconName="bulb" navigation = {navigation}navigationPage='CreateAssignmentScreen' iconColor="white" buttonText="Continue" />

      <BoxComponent  color="#466CFF" title="Assignment" subtitle="Create an assignment" iconName="musical-notes" navigation = {navigation}navigationPage='CreateAssignmentScreen' iconColor="white" buttonText="Create"/>

      <BoxComponent  color="#EE97BC" title="View My Students" subtitle="My lovely students" iconName="people" navigation = {navigation}navigationPage='MyStudentsScreen' iconColor="white" buttonText="View "/>

    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#3498db',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

export default HomeScreen;
