// theme.js

import { StyleSheet } from 'react-native';


const theme = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 30,
    marginBottom: 20,
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
    width: '100%',
    
    
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
    marginHorizontal: 5,
    justifyContent: 'center', // Centers content vertically
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
    justifyContent: 'flex-end',
    // justifyContent: 'space-between', // This will space out the buttons evenly
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
  }, 
  assignmentImage: {
    width: 150,
    height: 150
  }, 
  imageContainer: {
    position: 'relative',
    marginRight: 10, // Add space between images
    marginTop: 20,
    marginLeft: 10,
  },
  contentContainer:{
    flexGrow: 1, // Makes sure all content will be scrolled
  },
  innerContainer:{
      padding: 20,
  },
  image: {
      width: 150,
      height: 150
  }, 
  removeButton: {
      position: 'absolute',
      right: 0,
      top: 0,
      // backgroundColor: '#4664EA',
      // padding: 5,
      // borderRadius: 10,
  },
  cancelIcon: {
      width: 30,
      height: 30
  },
  label:{
      marginTop: 20,
      marginLeft: 20,
      fontSize: 16,
      color: '#6e6e6e',
  }, 
  documentItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 20,
      marginLeft: 10,
  },
  documentThumbnail: {
      width: 30,
      height: 30,
      marginRight: 10,
  },
  documentName: {
      flexGrow: 1,
      flexShrink: 1,
      marginRight: 10,
  },
  buttonsContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between', // This will space out the buttons evenly
      marginTop: 20,
      paddingHorizontal: 10, // Add some padding on the sides
  },
  modalContent:{
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0,0,0, 0.1)',
  },
  fullSizeImage: {
    width:250,
    height: 600,
    resizeMode: 'contain'
  }
});

export default theme;
