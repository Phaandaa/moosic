import Modal from "react-native-modal";
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Button, TextInput } from 'react-native';
import theme from "../../styles/theme";
function DeleteModal({ isModalVisible, imageSource, textMessage, buttonText, onButtonPress}){

    return (
        <Modal isVisible={isModalVisible} style={{alignItems: 'center'}}>
        <View style={theme.modalContent}>
          <Image source={imageSource} style={theme.modalImage}/>
          <Text style={[theme.textBoldItalic, {marginBottom: 10}]}>{textMessage}</Text>

          <TouchableOpacity onPress={onButtonPress} style={theme.buttonRed}>     
            <Text style={theme.buttonText}>{buttonText}</Text>           
          </TouchableOpacity>
        </View>
      </Modal>
    )
};
export default DeleteModal;