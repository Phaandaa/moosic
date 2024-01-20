// theme.js

import { StyleSheet } from 'react-native';


const theme = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 30,
    backgroundColor: '#ffffff',
    flex: 1,
    width: '100%',
    height : '100%',
    
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
  textTitle: {
    fontSize: 24,
    paddingVertical: 6,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#525F7F',
  },
  textSubtitle:{
    fontSize: 16,
    paddingVertical: 6,
    fontWeight: 'light',
    alignSelf: 'center',
    color: '#A1B2CF',
  
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
    flex: 1,
    marginHorizontal: 5
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    padding: 10,
    fontSize: 16,
  
  }
});

export default theme;
