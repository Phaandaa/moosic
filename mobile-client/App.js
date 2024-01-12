import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import registerNNPushToken from 'native-notify';

// Mock the function outside the component scope
jest.mock('native-notify', () => ({
  registerNNPushToken: jest.fn(), // Create a mock function
}));

export default function App() {
  registerNNPushToken(18122, 'dVHwMdzg6cW9cdVqiIDmM7');

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

