import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet,TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const CustomTabBarButton = ({ children }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [userRole, setUserRole] = useState(''); // Replace with the user role from the context
    const [loadingState, setLoadingState] = useState(false);
    const navigation = useNavigation();

    
    const checkStoredData = async () => {
        try {
            
            const storedData = await AsyncStorage.getItem('authData');
            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
                
                return parsedData.role;
            }
        } catch (error) {
            console.error('Error retrieving data from AsyncStorage', error);
        }
        finally{
            setLoadingState(false);
        }
        return '';
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const role = await checkStoredData();
                setUserRole(role);
                console.log(role)
            } catch (error) {
                console.error('Error processing stored data', error);
            }
        };
        fetchData();
    }, []);

  
    // Function to navigate to the screen based on the selected option
    const navigateToScreen = (screen) => {
        setModalVisible(false); // Close the modal
        navigation.navigate(screen); // Navigate to the selected screen
      };
    

  
      return (
        <>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.customButton}
          >
            {children}
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.centeredView}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalView}>
                    {/* Conditional rendering based on userRole */}
                    {userRole === 'Teacher' && (
                      <>
                        <TouchableOpacity
                          onPress={() => navigateToScreen('CreateAssignmentScreen')}
                          style={styles.optionButton}
                        >
                          <Text style={styles.optionText}>Create Assignment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => navigateToScreen('CreateGoalsForStudents')}
                          style={styles.optionButton}
                        >
                          <Text style={styles.optionText}>Create Goals</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {userRole === 'Student' && (
                      <TouchableOpacity
                        onPress={() => navigateToScreen('CreatePracticeScreen')}
                        style={styles.optionButton}
                      >
                        <Text style={styles.optionText}>Create Practice Log</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </>
      );
    };
  
  const styles = StyleSheet.create({
    customButton: {
      justifyContent: 'bottom',
      alignItems: 'center',
      flex: 1,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 22,
      
      
    },
    modalView: {
      margin: 20,
      
      position: 'absolute',
      bottom: '10%',
      borderRadius: 20,
      
      alignItems: 'center',
      
    },
    optionButton: {
      backgroundColor: '#466CFF',
      padding: 10,
      marginVertical: 10,
        width: "100%",
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderRadius: 10,
     
    },
    optionText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });
  
  export default CustomTabBarButton;
