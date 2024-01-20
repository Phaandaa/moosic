// theme.js

import { StyleSheet } from 'react-native';


const theme = StyleSheet.create({
  container: {
    padding: 20
    
  },
  textThin: {
    fontSize: 24,
    paddingVertical: 6,
    
  },
  textExtraLight: {
    fontSize: 24,
    paddingVertical: 6,
    
  },
  textLight: {
    fontSize: 24,
    paddingVertical: 6,
    
  },
  // Add other font styles as needed
  button: {
    backgroundColor: '#4664EA',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  button2: {
    backgroundColor: '#525F7F',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default theme;
