import React, { useState } from 'react';
import { TextInput, View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, StyleSheet, Platform, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setCache } from '../../cacheSlice';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../styles/theme';
import Colors from '../../constants/colors';
import SuccessModal from '../../components/ui/SuccessModal';
import { useAuth } from '../../context/Authcontext';
import axios from 'axios';

const getFileNameFromUrl = (url) => {
  return url.split('/').pop().slice(37);
};

function EditAssignmentScreen({ route, navigation }) {
  const { assignment } = route.params;
  const { state } = useAuth();

  const dispatch = useDispatch();
  const [assignmentDesc, setAssignmentDesc] = useState(assignment.description);
  const [assignmentDeadline, setAssignmentDeadline] = useState(assignment.deadline);
  const [submissionDate, setSubmissionDate] = useState(new Date());
  const [errors, setErrors] = useState({});

  const [images, setImages] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);

  const handleModalButtonPress = () => {
    navigation.navigate('Home');
    setModalVisible(false);
  };


  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
    setAssignmentDeadline(currentDate.toDateString());
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
        console.log('EditAssignmentScreen.js line 68, result.assets[0]:', result.assets[0])
        saveImage(result.assets[0]); 
        console.log('EditAssignmentScreen.js line 70, images: ', images);
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
        console.log('EditAssignmentScreen.js line 83, uploadedDocuments: ',uploadedDocuments);
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

    if (!assignmentDesc.trim()) {
      newErrors.assignmentDesc = 'Description is required.';
      isValid = false;
    }
    if (!assignmentDeadline) {
      newErrors.assignmentDeadline = 'Deadline is required.';
      isValid = false;
    }
    setErrors(newErrors);
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

    console.log('EditAssignmentScreen.js line 143, assignmentDeadline', assignmentDeadline)
  
    const formData = new FormData();

    const assignmentData ={
      assignment_desc: assignmentDesc,
      assignment_deadline: assignmentDeadline,
    };
    console.log('EditAssignmentScreen.js line 151, assignmentData: ', assignmentData)
    
  
    images.forEach((image, index) => {
      const { uri, fileName } = image

      if (typeof image.uri === 'string') { 
        const uriParts = image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        console.log('EditAssignmentScreen.js line 161, Appending file:', image.uri);
        formData.append('files', {
            uri: uri,
            name: fileName,
            type: `image/${fileType}`,
        });
      } else {
        console.warn('EditAssignmentScreen.js line 168, Invalid image URI:', image.uri);
      }
    });

    uploadedDocuments.forEach((doc, index) => {
      formData.append(`files`, {
        uri: doc.uri,
        type: doc.mimeType,
        name: doc.name
      });
    });

    formData.append("assignment", {"string" : JSON.stringify(assignmentData), type: 'application/json'});
    console.log('EditAssignmentScreen.js line 182, formData: ', formData)

    // try {
    //   const updateAssignmentURL = `${IP_ADDRESS}/assignments/teacher/${assignment.assignmentId}/update-details`;
    //   const response = await axios.put(updateAssignmentURL, formData , state.authHeader);
      

    //   const responseData = response.data;
    //   dispatch(setCache({ key: 'assignmentDataAll', value: responseData }));
    //   setModalVisible(true);

    // } catch (error) {
    //   console.error('EditAssignmentScreen.js line 204, Error editing assignment:', error);
    //   Alert.alert('Error', `Failed to edit assignment. ${error.response?.data?.message || 'Please try again.'}`);
    // }
    try {
      const response = await fetch(`${IP_ADDRESS}/assignments/teacher/${assignment.assignmentId}/update-details`, {
          method: 'PUT',
          headers:{...state.authHeader.headers},
          body: formData,
      });
        
      if (!response.ok) {
        const errorText = response.statusText || 'Unknown error occurred';
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log(responseData);
      setModalVisible(true);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', `Failed to submit feedback. ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Edit Assignment</Text>

        <Text style={theme.cardTitle}>{assignment.title}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Description"
            value={assignmentDesc}
            onChangeText={setAssignmentDesc}
            multiline
            style={[styles.input, styles.textArea]}
          />
          {errors.assignmentDesc && <Text style={styles.errorText}>{errors.assignmentDesc}</Text>}
        </View>
        
        <View style={styles.deadlineContainer}>
          <Text style={styles.dueDateLabel}>Due date</Text>
          <TouchableOpacity onPress={toggleDatepicker} style={styles.dateDisplay}>
            <Text style={styles.dateText}>{assignmentDeadline || 'Select date'}</Text>
            <Ionicons name="calendar" size={24} color={Colors.mainPurple}/>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}


        <View style={styles.uploadButtons}>
        {Platform.OS === 'ios' && (
          <View style={styles.attachFilesSection}>
            <TouchableOpacity style={styles.attachButton} onPress={() => uploadImage('gallery')}>
              <Ionicons name="images" size={24} color={Colors.mainPurple} />
              <Text style={styles.attachText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        )}

          <View style={styles.attachFilesSection}>
            <TouchableOpacity style={styles.attachButton} onPress={uploadDocument}>
              <Ionicons name="attach" size={24} color={Colors.mainPurple} />
              <Text style={styles.attachText}>Attach Files</Text>
            </TouchableOpacity>
          </View>
        </View>

        {assignment.assignmentDocumentLinks.map((link, linkIndex) => (
            <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="link" size={24} color="#525F7F" />
                <Text style={theme.documentName}> {getFileNameFromUrl(link)}</Text>
            </TouchableOpacity>
        ))}


        {/* Display Images and Document Names */}
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
        textMessage="Edited Successfully!"
        buttonText="Back to Home"
        onButtonPress={handleModalButtonPress}
      />
  
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={submitHandler}>
          <Text style={styles.buttonText}>Edit Assignment</Text>
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
    flex: 1
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  attachText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.mainPurple,
    alignItems: 'center'
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

export default EditAssignmentScreen;