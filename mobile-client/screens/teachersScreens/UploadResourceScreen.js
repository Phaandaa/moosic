import React, { useState, useEffect, useCallback } from 'react';
import { TextInput, View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import IP_ADDRESS from '../../constants/ip_address_temp';
import axios from 'axios';
import Colors from '../../constants/colors';
import SuccessModal from '../../components/ui/SuccessModal';

import TypeCategoryDropdownGrey from "../../components/ui/TypeCategoryDropdownGrey";
import GradeCategoryDropdownGrey from "../../components/ui/GradeCategoryDropdownGrey";
import InstrumentCategoryDropdownGrey from "../../components/ui/InstrumentCategoryDropdownGrey";
import { useAuth } from '../../context/Authcontext';

function UploadResourceScreen({ navigation }) {
  
  const { state, dispatch } = useAuth();
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDesc, setMaterialDesc] = useState('');
  const [errors, setErrors] = useState({});

  const [image, setImage] = useState(null);
  const [uploadedDocument, setUploadedDocument] = useState(null);

  const [selectedTypes, setSelectedTypes] = useState([]); 
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]); 

  const [isModalVisible, setModalVisible] = useState(false);

  const handleModalButtonPress = () => {
    navigation.navigate('Repository');
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
        console.log('result.assets[0]:', result.assets[0])
        setImage(result.assets[0]); 
        setUploadedDocument(null);
        console.log(image);
      }
    }
  };

  const uploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
      });
      if (!result.canceled && result.assets) {
        setUploadedDocument(result.assets[0]);
        setImage(null);
        console.log('uploadedDocument',uploadedDocument);
      }
    } catch (error) {
      Alert.alert('Error picking document:', error.message);
    }
  };
  
  const removeImage = () => {
    setImage(null);
  };

  const removeDocument = () => {
    setUploadedDocument(null);
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    if (!materialTitle.trim()) {
      newErrors.materialTitle = 'File name is required.';
      isValid = false;
    }
    if (!materialDesc.trim()) {
      newErrors.materialDesc = 'Description is required.';
      isValid = false;
    }
    if (image === null && uploadedDocument === null) {
      newErrors.fileUpload = 'Please upload an image or document';
      isValid = false;
    } else if (image && uploadedDocument) {
      newErrors.fileUpload = 'Please only upload etiher image or document';
      isValid = false;
    }
    console.log(newErrors);
    setErrors(newErrors);
    return isValid;
  };

  const submitHandler = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    const formData = new FormData();

    const materialData ={
      teacherId: state.userData.id,
      teacherName: state.userData.name,
      type: selectedTypes,
      grade: selectedGrades,
      instrument: selectedInstruments,
      title: materialTitle,
      description: materialDesc,
      status: "Pending"
    };

    console.log('materialData:', materialData)

    if (image) {
      const uriParts = image.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('file', {
        uri: image.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    } else if (uploadedDocument) {
      formData.append('file', {
        uri: uploadedDocument.uri,
        name: uploadedDocument.name,
        type: uploadedDocument.mimeType,
      });
    }
    
    formData.append("material_repository", JSON.stringify(materialData));
    console.log(formData)

    // try {
    //   const response = await axios.post(`${IP_ADDRESS}/material-repository/create`, formData, state.authHeader);
    //   const responseData = response.data;
    //   if (response.status == 200) {
    //     setModalVisible(true);
    //   } else {
    //     Alert.alert("Error uploading resources");
    //   }
    //   const resourcesResponse = await axios.get(`${IP_ADDRESS}/material-repository/teacher/${state.userData.id}`, state.authHeader);
    //   dispatch({ type: 'UPDATE_RESOURCE_REPOSITORY', payload: { resources: resourcesResponse.data }});
    // } catch (error) {
    //   console.error('Error recording practice:', error);
    //   Alert.alert('Error', `Failed to create practice. ${error.response?.data?.message || 'Please try again.'}`);
    // }
    try {
     
      const response = await fetch(`${IP_ADDRESS}/material-repository/create`, {
          method: 'POST',
          headers:{...state.authHeader.headers},
          body: formData,
      });
        
      if (!response.ok) {
        const errorText = response.statusText || 'Unknown error occurred';
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      const resourcesResponse = await axios.get(`${IP_ADDRESS}/material-repository/teacher/${state.userData.id}`, state.authHeader);
      dispatch({ type: 'UPDATE_RESOURCE_REPOSITORY', payload: { resources: resourcesResponse.data }});
      console.log(responseData);
      setModalVisible(true);
    } catch (error) {
      console.error('Error uploading resource:', error);
      Alert.alert('Error', `Failed to upload resource. ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Upload A New Resource</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add Material Title"
            value={materialTitle}
            onChangeText={setMaterialTitle}
            style={styles.input}
          />
          {errors.materialTitle && <Text style={styles.errorText}>{errors.materialTitle}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add Material Description"
            value={materialDesc}
            onChangeText={setMaterialDesc}
            style={styles.input}
          />
          {errors.materialDesc && <Text style={styles.errorText}>{errors.materialDesc}</Text>}
        </View>

        <View style={styles.dropdownContainer}> 
            <TypeCategoryDropdownGrey onCategoryChange={setSelectedTypes}/>
            <InstrumentCategoryDropdownGrey onCategoryChange={setSelectedInstruments}/>
            <GradeCategoryDropdownGrey onCategoryChange={setSelectedGrades}/>
        </View>

        <View style={styles.uploadButtons}>
          <View style={styles.attachFilesSection}>
            <TouchableOpacity style={styles.attachButton} onPress={() => uploadImage('gallery')}>
              <Ionicons name="images" size={24} color={Colors.mainPurple} />
              <Text style={styles.attachText}>Upload an Image</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center'}}>
            <Text>or</Text>
          </View>
          <View style={styles.attachFilesSection}>
            <TouchableOpacity style={styles.attachButton} onPress={uploadDocument}>
              <Ionicons name="attach" size={24} color={Colors.mainPurple} />
              <Text style={styles.attachText}>Attach a File</Text>
            </TouchableOpacity>
          </View>
        </View>

        {image == null && uploadedDocument == null ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-upload-outline" size={50} color="#cccccc" />
            <Text style={styles.emptyText}>Upload either an image or file to the central repository.</Text>
          </View>
        ) : (
          <>
            <View style={styles.imageContainer}>
              
                {image && (
                  <View key={image.uri} style={styles.imageWrapper}>
                      <Image source={{ uri: image.uri }} style={styles.image} />
                      <TouchableOpacity onPress={() => removeImage()} style={styles.removeButton}>
                          <Ionicons name="close-circle" size={24} color="red" />
                      </TouchableOpacity>
                  </View>
                )}
            </View>

            <View style={styles.documentContainer}>
              {uploadedDocument && (
                <View style={styles.documentItem}>
                  <Ionicons name="document-attach" size={24} color="#4F8EF7" />
                  <Text style={styles.documentName}>{uploadedDocument.name}</Text>
                  <TouchableOpacity onPress={() => removeDocument()} style={styles.removeButton}>
                    <Ionicons name="close-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}

      <SuccessModal 
        isModalVisible={isModalVisible} 
        imageSource={require('../../assets/happynote.png')}
        textMessage="Created Successfully!"
        buttonText="Back to Home"
        onButtonPress={handleModalButtonPress}
      />

        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={submitHandler}>
          <Text style={styles.buttonText}>Upload Resource</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 10
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
    justifyContent: 'center', 
    padding: 15,
    flex: 1,
    marginHorizontal: 10
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
  dropdownContainer:{
    marginBottom: 20
},
});

export default UploadResourceScreen;