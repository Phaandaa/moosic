import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Modal from 'react-native-modal';
import theme from "../../styles/theme"; 
import Colors from "../../constants/colors"; 
import { Ionicons } from '@expo/vector-icons';

function MaterialRepositoryPreviewModal({ isVisible, onClose, materialData, isCentral }) {

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
            <View style={styles.content}>
                <Text style={styles.title}>Material Info</Text>
                <Text style={styles.message}>
                    Title: {materialData.title}
                </Text>
                <Text style={styles.message}>
                    Description: {materialData.description}
                </Text>
                {!isCentral && <Text style={styles.message}>
                    Reason for Status: {materialData.reasonForStatus ? materialData.reasonForStatus : "Nothing here yet"}
                </Text>}
                <TouchableOpacity onPress={() => Linking.openURL(materialData.fileLink)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="link" size={24} color="#525F7F" />
                    <Text> {materialData.fileLink?.split('/').pop().slice(37)}</Text>
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onClose} style={[styles.button, styles.confirmButton]}>
                        <Text style={styles.buttonTextConfirm}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'left',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.accentGrey, // Example: '#ff6347'
  },
  confirmButton: {
    backgroundColor: Colors.primary500, // Example: '#34c759'
  },
  buttonTextCancel: {
    color: Colors.fontTertiary,
    fontSize: 16,
  },
  buttonTextConfirm: {
    color: Colors.bgWhite,
    fontSize: 16,
  },
});

export default MaterialRepositoryPreviewModal;
