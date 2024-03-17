import Modal from "react-native-modal";
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Button, TextInput } from 'react-native';
import theme from "../../styles/theme";
function DeleteModal({ isModalVisible, imageSource, textMessage, buttonText1, buttonText2, onButton1Press, onButton2Press}){

    return (
        <Modal isVisible={isModalVisible} style={{alignItems: 'center'}}>
        <View style={theme.modalContent}>
          <Image source={imageSource} style={theme.modalImage}/>
          <Text style={[theme.textBoldItalic, {marginBottom: 10}]}>{textMessage}</Text>

          <View style={theme.buttonsOneRow}> 
            <TouchableOpacity onPress={onButton1Press} style={[theme.buttonBlue, {marginRight: 10}]}>     
              <Text style={theme.buttonText}>{buttonText1}</Text>           
            </TouchableOpacity>
            <TouchableOpacity onPress={onButton2Press} style={[theme.buttonRed, {marginLeft: 10}]}>     
              <Text style={theme.buttonText}>{buttonText2}</Text>           
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    )
};
export default DeleteModal;

