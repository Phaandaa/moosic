import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, TextInput} from 'react-native';
import theme from '../../styles/theme';
import * as ImagePicker from "expo-image-picker";
import { Audio, Video, ResizeMode} from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCache, clearCache } from '../../cacheSlice';
import InputBox from '../../components/ui/inputBox';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/colors';
import SuccessModal from '../../components/ui/SuccessModal';
import axios from 'axios';
import { useAuth } from '../../context/Authcontext';
import PracticeFeedbackDropdown from '../../components/ui/PracticeFeedbackDropdown';

function ProvidePracticeFeedbackScreen({route, navigation}){
    const { state } = useAuth();
    const {practiceID} = route.params;
    const [teacherFeedback, setTeacherFeedback] = useState('');
    const [points, setPoints] = useState('');
    const [errors, setErrors] = useState({});
  

    const [videos, setVideos] = useState([]);

    const [isModalVisible, setModalVisible] = useState(false);

    const handleModalButtonPress = () => {
      navigation.navigate('Home');
      setModalVisible(false);
    };

    const uploadVideo = async(mode) => {
        try {
            let result = {};
            if (mode==='gallery'){
                await ImagePicker.requestMediaLibraryPermissionsAsync()
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                    aspect: [4,3],
                    quality: 1,
                })
            } 
            if(!result.canceled){
                await saveVideo(result.assets[0]);
            }
        } catch (error){
            alert("error uploading video:"+ error.message
            );

        }
    };
  
    const removeVideo = () => {
        setVideos([]);
    };

    const saveVideo = (newVideo) => {
        setVideos((currentVideos) => [...currentVideos, newVideo]);
    };
    
  const validateForm = () => {
    if (teacherFeedback.trim() === "") {
      return false;
    }
    if (points === "") {
      return false;
    }
    return true;
  };

  const submitHandler = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in the feedback and points given');
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
    
    if (videos.length > 0 && videos[0].uri) {
        const video = videos[0];
        const uriArray = video.uri.split(".");
        const fileExtension = uriArray[uriArray.length - 1];  
        const fileTypeExtended = `${video.type}/${fileExtension}`; 
        console.log('ProvidePracticeFeedbackScreen.js line 104, video: ',video)
    
        formData.append("video", {
          uri: video.uri,
          name: video.fileName ? video.fileName : "UntitledVideo.mp4",
          type: fileTypeExtended 
        });
        console.log('ProvidePracticeFeedbackScreen.js line 112, videouri: ', video.uri)
        console.log('ProvidePracticeFeedbackScreen.js line 113, vidfilename: ', video.fileName)
        console.log('ProvidePracticeFeedbackScreen.js line 114, vidtype: ', video.type)
        console.log(`Appending video to formData with name: ${video.fileName ? video.fileName : "UntitledVideo.mp4"}`);


    }
    formData.append("teacherFeedback", teacherFeedback);
    formData.append("points", parseInt(points));

    console.log('ProvidePracticeFeedbackScreen.js line 120, formData: ', formData)

    try {
      const response = await fetch(`${IP_ADDRESS}/practices/feedback/${practiceID}?`, {
        method: 'PUT',
        headers: {
          ...state.authHeader.headers,
        },
        body: formData, 
      });

      
      if (response.status == 200) {
        const responseData = response.data;
        setModalVisible(true);
      } else {
        Alert.alert(`Error giving feedback: ${response.data.message}`)
      }

    } catch (error) {
      console.error('ProvidePracticeFeedbackScreen.js line 139, Error adding feedback:', error);
      Alert.alert('Error', `Failed to add feedback. ${error.response?.data?.message || 'Please try again.'}`);
    }
    };
  
    return (
        <ScrollView style={theme.container}>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Feedback"
            value={teacherFeedback}
            onChangeText={setTeacherFeedback}
            multiline
            style={[styles.input, styles.textArea]}
          />
        </View>

        {/* <View style={styles.inputContainer}>
          <TextInput
            placeholder="Points"
            value={points}
            onChangeText={setPoints}
            style={[styles.input, styles.textArea]}
            keyboardType='numeric'
          />
        </View> */}

        <PracticeFeedbackDropdown onCategoryChange={setPoints}/>
      
        <View style={styles.attachFilesSection}>
          <TouchableOpacity style={styles.attachButton} onPress={() => uploadVideo('gallery')}>
            <Ionicons name="images" size={24} color={Colors.mainPurple} />
                {videos.length === 0 ? (
                    <Text style={styles.attachText}>Upload Video</Text>
                ) : (
                    <Text style={styles.attachText}>Replace Video</Text>
                )}
          </TouchableOpacity>
        </View>

        {videos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-upload-outline" size={50} color="#cccccc" />
            <Text style={styles.emptyText}>Upload a feedback video</Text>
          </View>
        ) : (
          <>
            <View style={styles.documentContainer}>
                <View style={styles.documentItem}>
                <Ionicons name="document-attach" size={24} color="#4F8EF7" />
                <Text style={styles.documentName}>{videos[0].fileName ? videos[0].fileName : "UntitledVideo.mp4"}</Text>
                <TouchableOpacity onPress={removeVideo} style={styles.removeButton}>
                    <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
                </View>
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
    </ScrollView>
  );
};

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
    justifyContent: 'center',
    padding: 15,
    width: '100%'
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4664EA',
    alignItems:'center'
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
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

export default ProvidePracticeFeedbackScreen;