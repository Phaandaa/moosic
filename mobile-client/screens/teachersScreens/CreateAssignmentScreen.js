import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, StyleSheet, Platform } from 'react-native';
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
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: true });
      if (result.type === 'success') {
        result.assets.forEach(asset => {
          setUploadedDocuments(currentDocs => [...currentDocs, { uri: asset.uri, name: asset.name }]);
        });
      }
    } catch (error) {
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
    <ScrollView style={theme.container} contentContainerStyle={theme.contentContainer}>
      <View>
        <AnimatedPlaceholderInput
          placeholder="Assignment Name"
          value={assignmentName}
          onChangeText={setAssignmentName}
        />
        {errors.assignmentName && <Text style={{ color: 'red' }}>{errors.assignmentName}</Text>}

        <AnimatedPlaceholderInput
          placeholder="Description"
          value={assignmentDesc}
          onChangeText={setAssignmentDesc}
          multiline
        />
        {errors.assignmentDesc && <Text style={{ color: 'red' }}>{errors.assignmentDesc}</Text>}

        <TouchableOpacity onPress={toggleDatepicker} style={theme.button}>
          <Text style={theme.buttonText}>Select Deadline</Text>
        </TouchableOpacity>
        <Text>{assignmentDeadline}</Text>
        {errors.assignmentDeadline && <Text style={{ color: 'red' }}>{errors.assignmentDeadline}</Text>}

        {showPicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={onChange} />
        )}

        <TouchableOpacity style={theme.button} onPress={() => uploadImage('gallery')}>
          <Text style={theme.buttonText}>Upload Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={theme.button} onPress={uploadDocument}>
          <Text style={theme.buttonText}>Upload Document</Text>
        </TouchableOpacity>

        {images.map((image, index) => (
          <View key={index} style={theme.imageContainer}>
            <Image source={{ uri: image.uri }} style={theme.assignmentImage} />
            <TouchableOpacity onPress={() => removeImage(index)} style={theme.removeButton}>
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        {uploadedDocuments.map((doc, index) => (
          <View key={index} style={theme.documentItemContainer}>
            <Ionicons name="document-attach" size={24} color="black" />
            <Text style={theme.documentName}>{doc.name}</Text>
            <TouchableOpacity onPress={() => removeDocument(index)} style={theme.removeButton}>
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        <StudentDropdown onSelectionChange={setSelectedStudents} />

        <TouchableOpacity style={theme.button} onPress={submitHandler}>
          <Text style={theme.buttonText}>Create Assignment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default CreateAssignmentScreen;


const assignmentStyles = StyleSheet.create({
    contentContainer:{
        flexGrow: 1, // Makes sure all content will be scrolled
    },
    innerContainer:{
        padding: 20,
    },
    image: {
        width: 150,
        height: 150
    }, 
    removeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        // backgroundColor: '#4664EA',
        // padding: 5,
        // borderRadius: 10,
    },
    cancelIcon: {
        width: 30,
        height: 30
    },
    label:{
        marginTop: 20,
        marginLeft: 20,
        fontSize: 16,
        color: '#6e6e6e',
    }, 
    documentItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 20,
        marginLeft: 10,
    },
    documentThumbnail: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    documentName: {
        flexGrow: 1,
        flexShrink: 1,
        marginRight: 10,
    },
    buttonsContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between', // This will space out the buttons evenly
        marginTop: 20,
        paddingHorizontal: 10, // Add some padding on the sides
    },
    datePicker:{
        height: 120,
        marginTop: -10,
    },
    placeholder: {
        position: 'absolute',
        bottom: 40, // Adjusted to align with the bottom of the TextInput
        color: '#A1B2CF',
      },
});