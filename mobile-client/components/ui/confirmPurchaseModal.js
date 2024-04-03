import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Colors from "../../constants/colors"; 

function ConfirmPurchaseModal({
  isVisible,
  onClose,
  onConfirm,
  item,
  user,
}) {
  const remainingPoints = user?.pointsCounter - item?.points;

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      {item?.type == "DIGITAL" && 
        <View style={styles.content}>
          <Text style={styles.title}>Confirm Purchase</Text>
          <Text style={styles.message}>
            You are about to purchase {item?.description} for {item?.points} points.
          </Text>
          <Text style={styles.message}>
            This will leave you with {remainingPoints < 0 ? 0 : remainingPoints} points.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.confirmButton]}>
              <Text style={styles.buttonTextConfirm}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      {item?.type == "PHYSICAL" && 
      <View style={styles.content}>
        <Text style={styles.title}>Physical Purchase</Text>
        <Text style={styles.message}>
          Physical items can only be redeemed in the music school.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.confirmButton]}>
            <Text style={styles.buttonTextConfirm}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    }
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
    alignItems: 'center',
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
    backgroundColor: Colors.accentGrey, 
  },
  confirmButton: {
    backgroundColor: Colors.primary500,
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

export default ConfirmPurchaseModal;
