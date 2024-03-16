// theme.js

import { StyleSheet } from 'react-native';
import Colors from '../constants/colors';


const theme = StyleSheet.create({
  container: {
    padding: 20,
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
    color: Colors.fontPrimary,
  },
  textSubtitle:{
    fontSize: 16,
    paddingVertical: 6,
    fontWeight: 'light',
    
    color: '#A1B2CF',
  
  },
  textBoldItalic:{
    fontSize: 20,
    paddingVertical: 6,
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  
  //component themes
  box:{
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    width: '100%',
    height: 200,
    
  },
  button: {
    backgroundColor: Colors.mainPurple,
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  button2: {
    backgroundColor: Colors.mainPurple,
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
    backgroundColor: Colors.accentGrey,
    padding: 20,
    borderRadius: 15,
    marginTop: 10, 
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items on both ends
    alignItems: 'center', // Center items vertically
  },
  card2:{
      backgroundColor: Colors.accentGrey,
      padding: 20,
      borderRadius: 15,
      marginTop: 10,
      marginBottom: 10,
      flexDirection: 'row', // Change this to 'row'
      alignItems: 'center', // Add this to align items vertically in the center
      justifyContent: 'space-between', // Add this to space out the title/deadline and the button  }
  },
  card3:{
    backgroundColor: Colors.accentGrey,
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'col'
},
  cardTextContainer: {
      flex: 1, // Take up as much space as possible
      marginRight: 8, // Add some margin to the right of the text
  },
  cardTitle:{
    color: Colors.fontPrimary,
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 5
  },
  cardTitlePurple:{
    color: Colors.mainPurple,
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 5
  },
  cardTitlePink:{
    color: Colors.accentPink,
    fontWeight: 'bold',
    fontSize: 20,
    paddingVertical: 5
  },
  cardTextBold:{
    color: Colors.fontPrimary,
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 5,
  },
  cardText: {
      color: Colors.fontPrimary,
      fontWeight: '300',
      fontSize: 16,
      paddingVertical: 5
  },
  cardTextSecondary: {
    color: Colors.fontSecondary,
    fontWeight: '200',
    fontSize: 14,
    paddingVertical: 5
  },
  buttonContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      marginTop:10
  },
  buttonContainer2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // justifyContent: 'space-between', // This will space out the buttons evenly
    marginTop: 10, // Add some margin to the top of the button container
  },
  buttonContainerLeft:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // justifyContent: 'space-between', // This will space out the buttons evenly
    marginTop: 10, // Add some margin to the top of the button container
  },
  smallButton: {
      backgroundColor: Colors.mainPurple,
      padding: 10,
      borderRadius: 15,
      // marginLeft: 8, // Add some margin to separate the buttons
  },
  smallButtonLeftMargin: {
    backgroundColor: Colors.accentPink,
    padding: 10,
    borderRadius: 15,
    marginLeft: 8, // Add some margin to separate the buttons
  },
  smallButtonLeftMarginGreen: {
    backgroundColor: Colors.accentGreen,
    padding: 10,
    borderRadius: 15,
    marginLeft: 8, // Add some margin to separate the buttons
  },
  smallButtonLeftMarginBlue: {
    backgroundColor: Colors.accentBlue,
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
  oneRow:{
    flexDirection:'row',
    flex:1,
    justifyContent: "space-between"
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
    paddingBottom: 30
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
      color: '#525F7F'
  },
  buttonsContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between', // This will space out the buttons evenly
      marginTop: 20,
      paddingHorizontal: 10, // Add some padding on the sides
  },
  modalContent:{
    backgroundColor: 'white',
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    borderRadius: 30,
    borderColor: 'white',
  },
  modalImage:{
    height: 200,
    resizeMode: 'contain'
  },
  inputOuterContainer:{
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'col',
  },
  inputContainer:{
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'col',
    borderColor: '#4664EA',
    borderWidth: '1',
  },
  inputLabel:{
    color: '#4664EA',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 1,
    paddingHorizontal: 10
  },
  inputText:{
    color: 'black',
    fontWeight: '300',
    fontSize: 16,
    paddingVertical: 5,
  }, 
  inputTextContainer: {
    flex: 1, // Take up as much space as possible
    marginRight: 8, // Add some margin to the right of the text
  },
});

export default theme;
