import React, { useState, useEffect } from 'react';
import { TextInput, View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, StyleSheet, Platform } from 'react-native';
import theme from '../../styles/theme';
import AnimatedPlaceholderInput from '../../components/ui/animateTextInput';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import StudentDropdown from '../../components/ui/StudentDropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setCache } from '../../cacheSlice';

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
      if (!result.canceled) { // Note the use of 'canceled' instead of 'cancelled'
        result.assets.forEach(asset => {
          setImages(currentImages => [...currentImages, { uri: asset.uri, name: asset.fileName || 'Unnamed Image' }]);
        });
      }
    }
  };

  const uploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true, // Set to true if you want to allow multiple selections
      });
      
      // Check if the operation was not canceled and assets are available
      if (!result.canceled && result.assets) {
        const newDocs = result.assets.map(doc => ({
          uri: doc.uri,
          name: doc.name || 'Unnamed Document', // Provide a fallback name
        }));
  
        // Update the state with the new documents
        setUploadedDocuments(currentDocs => [...currentDocs, ...newDocs]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error picking document:', error.message);
    }
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

  const submitHandler = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    const assignmentData = {
      name: assignmentName,
      description: assignmentDesc,
      deadline: assignmentDeadline,
      images: images,
      documents: uploadedDocuments,
      students: selectedStudents,
      submissionDate: submissionDate.toString(),
    };
    dispatch(setCache({ key: 'assignmentData', value: assignmentData }));
    navigation.navigate('ViewCreatedAssignmentsScreen', { assignmentData });
    Alert.alert('Success', 'Assignment created successfully!');
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
            <Ionicons name="calendar" size={24} color="#4664EA" />
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
                <View key={index} style={styles.imageWrapper}>
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


        <StudentDropdown onSelectionChange={setSelectedStudents} style={styles.dropdown} />

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
    color: '#525F7F',
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
    color: '#4664EA',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4664EA',
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
    backgroundColor: '#4664EA',
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