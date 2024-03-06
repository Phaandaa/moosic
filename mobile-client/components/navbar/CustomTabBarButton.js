import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomTabBarButton = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Tab bar button */}
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Ionicons name="add-circle-outline" size={25} color={"gray"} />
      </TouchableOpacity>

      {/* Drop-up Menu */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {/* Menu items */}
            <Text style={styles.menuItem}>Create Assignment</Text>
            <Text style={styles.menuItem}>Create Goals</Text>
            <Text style={styles.menuItem}>Create Practice Log</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  menuContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    position: 'absolute', // Position absolutely to "pop up"
    bottom: '10%', // Distance from the bottom, adjust as needed
  },
  menuItem: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    // Borders and other styling as needed
  },
});

export default CustomTabBarButton;
