import React, { useState, useEffect, useCallback } from 'react';
import { TextInput, View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import StudentDropdown from '../../components/ui/StudentDropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setCache } from '../../cacheSlice';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Colors from '../../constants/colors';
import SuccessModal from '../../components/ui/SuccessModal';
import { useAuth } from '../../context/Authcontext';

function ProvideAssignmentFeedbackScreen({ navigation, route }) {
  const { state } = useAuth();
  const {assignmentID} = route.params;
  const [assignmentName, setAssignmentName] = useState('');
  const [teacherFeedback, setTeacherFeedback] = useState('');
  const [points, setPoints] = useState('');
  const [errors, setErrors] = useState({});

  const [images, setImages] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);


  const [isModalVisible, setModalVisible] = useState(false);

  const handleModalButtonPress = () => {
    navigation.navigate('Home');
    setModalVisible(false);
  };

  const uploadImage = async (mode) => {
    let result = {};
    if (mode === 'gallery') {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Permission to access gallery is required!');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        console.log('ProvideAssignmentFeddbackScreen.js line 48, result.assets[0]:', result.assets[0])
        saveImage(result.assets[0]); 
        console.log('ProvideAssignmentFeddbackScreen.js line 50, images: ', images);
      }
    }
  };

  const uploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
      });
      if (!result.canceled && result.assets) {
        setUploadedDocuments(currentDocs => [...currentDocs, ...result.assets]);
        console.log('ProvideAssignmentFeddbackScreen.js line 63, uploadedDocuments: ',uploadedDocuments);
      }
    } catch (error) {
      Alert.alert('Error picking document:', error.message);
    }
  };
  
  
  const saveImage = (newImage) => {
    setImages((currentImages) => [...currentImages, newImage]);
  };

  const removeImage = (index) => {
    setImages(currentImages => currentImages.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setUploadedDocuments(currentDocs => currentDocs.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    return isValid;
  };

  const submitHandler = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    const storedData = await AsyncStorage.getItem('authData');
    if (!storedData) {
      Alert.alert('Error', 'Authentication data is not available. Please login again.');
      return;
    }
  
    const parsedData = JSON.parse(storedData);
    if (!parsedData.userId || !parsedData.name) {
      Alert.alert('Error', 'Incomplete authentication data. Please login again.');
      return;
    }
  
    const formData = new FormData();    
  
    images.forEach((image, index) => {
      const { uri, fileName } = image

      if (typeof image.uri === 'string') { 
        const uriParts = image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        console.log('ProvideAssignmentFeddbackScreen.js line 129, Appending file:', image.uri);
        formData.append('files', {
            uri: uri,
            name: fileName,
            type: `image/${fileType}`,
        });
      } else {
        console.warn('ProvideAssignmentFeddbackScreen.js line 136, Invalid image URI:', image.uri);
      }
    });

    uploadedDocuments.forEach((doc, index) => {
      formData.append(`files`, {
        uri: doc.uri,
        type: doc.mimeType,
        name: doc.name
      });
    });


    formData.append("teacherFeedback", teacherFeedback);
    formData.append("points", parseInt(points));

    console.log('ProvideAssignmentFeddbackScreen.js line 152, formData: ', formData)

    try {

      const response = await axios.put(`${IP_ADDRESS}/assignments/teacher/${assignmentID}/update?`, formData, state.authHeader);
        
      if (response.status != 200) {
        const errorText = response.statusText || 'Unknown error occurred';
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      
      setModalVisible(true);

    } catch (error) {
      console.error('ProvideAssignmentFeddbackScreen.js line 155, Error adding feedback:', error);
      Alert.alert('Error', `Failed to add feedback. ${error.response?.data?.message || 'Please try again.'}`);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Provide Feedback</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Feedback"
            value={teacherFeedback}
            onChangeText={setTeacherFeedback}
            multiline
            style={[styles.input, styles.textArea]}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Points"
            value={points}
            onChangeText={setPoints}
            style={[styles.input, styles.textArea]}
            // keyboardType='numeric'
          />
        </View>
      
        <View style={styles.uploadButtons}>
        <View style={styles.attachFilesSection}>
          <TouchableOpacity style={styles.attachButton} onPress={() => uploadImage('gallery')}>
            <Ionicons name="images" size={24} color="#4664EA" />
            <Text style={styles.attachText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

          <View style={styles.attachFilesSection}>
            <TouchableOpacity style={styles.attachButton} onPress={uploadDocument}>
              <Ionicons name="attach" size={24} color="#4664EA" />
              <Text style={styles.attachText}>Attach Files</Text>
            </TouchableOpacity>
          </View>
        </View>

        {images.length === 0 && uploadedDocuments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-upload-outline" size={50} color="#cccccc" />
            <Text style={styles.emptyText}>Upload images or documents to your assignment</Text>
          </View>
        ) : (
          <>
            <View style={styles.imageContainer}>
              
                {images.map((image, index) => (
                      <View key={image.uri} style={styles.imageWrapper}>
                          <Image source={{ uri: image.uri }} style={styles.image} />
                          <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
                              
                              <Ionicons name="close-circle" size={24} color="red" />
                          </TouchableOpacity>
                      </View>
                ))}
            </View>

            <View style={styles.documentContainer}>
              {uploadedDocuments.map((doc, index) => (
                <View key={index} style={styles.documentItem}>
                  <Ionicons name="document-attach" size={24} color="#4F8EF7" />
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <TouchableOpacity onPress={() => removeDocument(index)} style={styles.removeButton}>
                    <Ionicons name="close-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        <SuccessModal 
          isModalVisible={isModalVisible} 
          imageSource={require('../../assets/happynote.png')}
          textMessage="Feedback Added Successfully!"
          buttonText="Back to Home"
          onButtonPress={handleModalButtonPress}
        />
  

        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={submitHandler}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#cccccc',
    textAlign: 'center',
    marginTop: 10,
  },
  formContainer: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.fontPrimary,
  },
  inputContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
    marginBottom: 15,
  },
  input: {
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  attachFilesSection: {
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.mainPurple,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  documentContainer: {
    marginBottom: 20,
    width: '80%',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  documentName: {
    marginLeft: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    margin: 10
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
    
  },
  dropdown: {
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 20,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F7F7F7', // Light gray background
    borderRadius: 8,
  },
  dueDateLabel: {
    fontSize: 16,
    color: '#8E8E93', // Light gray text
  },
  dateDisplay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF', // White background for date display
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#000000', // Black text for the date
  },
  button: {
    backgroundColor: Colors.mainPurple,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProvideAssignmentFeedbackScreen;