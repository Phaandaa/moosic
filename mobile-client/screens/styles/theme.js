// theme.js

import { StyleSheet } from 'react-native';


const theme = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 30,
    backgroundColor: '#ffffff',
    
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
  textBold:{
    fontSize: 24,
    paddingVertical: 6,
    fontWeight: 'bold',
  },
  textTitle: {
    fontSize: 24,
    paddingVertical: 6,
    fontWeight: 'bold',
    
    color: '#525F7F',
  },
  textSubtitle:{
    fontSize: 16,
    paddingVertical: 6,
    fontWeight: 'light',
    
    color: '#A1B2CF',
  
  },
  
  //component themes
  box:{
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    width: '90%',
    
    
  },
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
  }, 
  card: {
    backgroundColor: '#EE97BC',
    padding: 20,
    borderRadius: 15,
    marginTop: 10, 
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items on both ends
    alignItems: 'center', // Center items vertically
  },
  card2:{
      backgroundColor: '#EE97BC',
      padding: 20,
      borderRadius: 15,
      marginTop: 10,
      flexDirection: 'col',
  },
  cardTextContainer: {
      flex: 1, // Take up as much space as possible
      marginRight: 8, // Add some margin to the right of the text
  },
  cardTitle:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 5
  },
  cardTextBold:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 5
  },
  cardText: {
      color: 'white',
      fontWeight: '300',
      fontSize: 16,
      paddingVertical: 5
  },
  buttonContainer: {
      flexDirection: 'row',
      // If you need space between buttons add justifyContent: 'space-between',
  },
  buttonContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This will space out the buttons evenly
    // width: '100%', // Set the width to take up the full container width
    marginTop: 10, // Add some margin to the top of the button container
  },
  smallButton: {
      backgroundColor: '#4664EA',
      padding: 10,
      borderRadius: 15,
      marginLeft: 8, // Add some margin to separate the buttons
  },
  smallButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
  }
});

export default theme;
