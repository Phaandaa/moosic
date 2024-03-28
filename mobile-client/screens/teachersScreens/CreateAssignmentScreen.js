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


function CreateAssignmentScreen({ navigation }) {
  const dispatch = useDispatch();
  const [assignmentName, setAssignmentName] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [assignmentDeadline, setAssignmentDeadline] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
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
        console.log('CreateAssignmentScreen.js line 64, result.assets[0]:', result.assets[0])
        saveImage(result.assets[0]); 
        console.log('CreateAssignmentScreen.js line 66, images: ', images);
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
        console.log('CreateAssignmentScreen.js line 79, uploadedDocuments: ',uploadedDocuments);
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
    if (!assignmentName.trim()) {
      newErrors.assignmentName = 'Assignment name is required.';
      isValid = false;
    }
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

  // Handler to update state with selected student IDs in the desired format
  const handleStudentSelectionChange = useCallback((selectedIds) => {
    const formattedSelectedStudents = selectedIds.map(id => ({ student_id: id }));
    setSelectedStudents(formattedSelectedStudents);
  }, [setSelectedStudents]); // Assuming setSelectedStudents doesn't change, this function is now stable

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

    const assignmentData ={
      teacher_id: parsedData.userId,
      teacher_name: parsedData.name,
      assignment_title: assignmentName,
      assignment_desc: assignmentDesc,
      assignment_deadline: assignmentDeadline,
      selected_students: selectedStudents,
      // selected_students: [{student_id: '5C4Q6ZILqoTBi9YnESwpKQuhMcN2'}],
      points: 0
    };
    console.log('CreateAssignmentScreen.js line 154, assignmentData:', assignmentData)
    
  
    images.forEach((image, index) => {
      const { uri, fileName } = image

      if (typeof image.uri === 'string') { // Check if image.uri is a string
        const uriParts = image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        console.log('CreateAssignmentScreen.js line 164, Appending file:', image.uri);
        formData.append('files', {
            uri: uri,
            name: fileName,
            type: `image/${fileType}`,
        });
      } else {
        console.warn('CreateAssignmentScreen.js line 171, Invalid image URI:', image.uri);
      }
    });

    uploadedDocuments.forEach((doc, index) => {
      formData.append(`files`, {
        uri: doc.uri,
        type: doc.mimeType,
        name: doc.name
      });
    });

    // console.log(formData)
    formData.append("assignment", {"string" : JSON.stringify(assignmentData), type: 'application/json'});
    console.log('CreateAssignmentScreen.js line 185, formData: ', formData)

    try {
     
      const response = await fetch(`${IP_ADDRESS}/assignments/create`, {
          method: 'POST',
          body: formData,
      });
      
        
      if (!response.ok) {
        const errorText = response.statusText || 'Unknown error occurred';
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('CreateAssignmentScreen.js line 201, responseData: ', responseData);
      dispatch(setCache({ key: 'assignmentDataAll', value: responseData }));
      setModalVisible(true);

    } catch (error) {
      console.error('CreateAssignmentScreen.js line 206, Error creating assignment:', error);
      Alert.alert('Error', `Failed to create assignment. ${error.response?.data?.message || 'Please try again.'}`);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Create New Assignment</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add a Title"
            value={assignmentName}
            onChangeText={setAssignmentName}
            style={styles.input}
          />
          {errors.assignmentName && <Text style={styles.errorText}>{errors.assignmentName}</Text>}
        </View>

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
            <Ionicons name="calendar" size={24} color={Colors.mainPurple} />
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
        <View style={styles.attachFilesSection}>
          <TouchableOpacity style={styles.attachButton} onPress={() => uploadImage('gallery')}>
            <Ionicons name="images" size={24} color={Colors.mainPurple} />
            <Text style={styles.attachText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

          <View style={styles.attachFilesSection}>
            <TouchableOpacity style={styles.attachButton} onPress={uploadDocument}>
              <Ionicons name="attach" size={24} color={Colors.mainPurple} />
              <Text style={styles.attachText}>Attach Files</Text>
            </TouchableOpacity>
          </View>
        </View>

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

        <StudentDropdown onSelectionChange={handleStudentSelectionChange} style={styles.dropdown} />

      <SuccessModal 
        isModalVisible={isModalVisible} 
        imageSource={require('../../assets/happynote.png')}
        textMessage="Created Successfully!"
        buttonText="Back to Home"
        onButtonPress={handleModalButtonPress}
      />

        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={submitHandler}>
          <Text style={styles.buttonText}>Create Assignment</Text>
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
  // Update existing button styles if necessary
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
export default CreateAssignmentScreen;