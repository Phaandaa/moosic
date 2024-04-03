import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Button, TextInput } from 'react-native';
import theme from '../../styles/theme';
import AnimatedPlaceholderInput from '../../components/ui/animateTextInput';
import * as ImagePicker from "expo-image-picker";
import { Audio, Video, ResizeMode} from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setCache, clearCache } from '../../cacheSlice';
import Colors from '../../constants/colors';
import SuccessModal from '../../components/ui/SuccessModal';
import { useAuth } from '../../context/Authcontext';
import axios from 'axios';
function CreatePracticeScreen({navigation}){
    const { state } = useAuth();
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [videos, setVideos] = useState([]);
    const [teacher, setTeacher] = useState({});
    const [loadingstates, setLoadingStates] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);

    const handleModalButtonPress = () => {
      navigation.navigate('Home');
      setModalVisible(false);
    };

    useEffect(() => {
      const fetchTeacher = async () => {
        try {
          const response = await axios.get(`${IP_ADDRESS}/teachers/student/${state.userData.id}`, state.authHeader);
          const responseData = response.data;
          setTeacher(responseData);
        } catch (error) {
          console.error('Error fetching teacher:', error);
          Alert.alert('Error', `Failed to fetch teacher. Please try again.`);
        }
      };
    
      fetchTeacher();
    }, [])

    const submitHandler = async ()=> {
      if (!title) {
        alert('Please fill all fields');
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

      const practiceData = {
        title: title,
        comment: comment,
        student_id: parsedData.userId,
        student_name: parsedData.name,
        teacher_id: teacher.id,
        teacher_name: teacher.name
      };
      
      if (videos.length > 0 && videos[0].uri) {
          const video = videos[0];
      
          formData.append("video", {
            uri: video.uri,
            name: video.fileName, 
          });
          console.log('videouri: ', video.uri)
          console.log('vidfilename: ', video.fileName)
          console.log('vidtype: ', video.type)

      }
      formData.append("practice", {"string" : JSON.stringify(practiceData), type: 'application/json'});
      console.log(formData)

      try {
          const response = axios.post(`${IP_ADDRESS}/practices/create`, formData, state.authHeader);
            
          const responseData = await response.data;
          setModalVisible(true);
      } catch (error) {
          console.error('Error recording practice:', error);
          Alert.alert('Error', `Failed to create practice. ${error.response?.data?.message || 'Please try again.'}`);
      }
    }

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
        setLoadingStates((currentLoadingStates) => ({ ...currentLoadingStates, [newVideo]: true }));
    };
    
    
    return (
        <ScrollView style={theme.container}> 
        <View>
            <View style={styles.inputContainer}>
            <TextInput
                placeholder="Practice Name"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />
            </View>

            <View style={styles.inputContainer}>
            <TextInput
                placeholder="Comment"
                value={comment}
                onChangeText={setComment}
                multiline
                style={[styles.input, styles.textArea]}
            />
            </View>

                <View style={styles.attachFilesSection}>
                <TouchableOpacity style={styles.attachButton} onPress={() => uploadVideo('gallery')}>
                    <Ionicons name="images" size={24} color={Colors.mainPurple} />
                    {videos.length === 0 ? (
                        <Text style={styles.attachText}>Upload Video</Text>
                    ) : (
                        <><Text style={styles.attachText}>Replace Video</Text></>
                    )}
                </TouchableOpacity>
                </View>            
        </View>
        
        {videos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-upload-outline" size={50} color="#cccccc" />
            <Text style={styles.emptyText}>Upload a practice video</Text>
          </View>
        ) : (
          <>
            <View style={styles.documentContainer}>
                <View style={styles.documentItem}>
                <Ionicons name="document-attach" size={24} color="#4F8EF7" />
                <Text style={styles.documentName}>{videos[0].fileName}</Text>
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
        textMessage="Submitted Successfully!"
        buttonText="Back to Home"
        onButtonPress={handleModalButtonPress}
      />

      <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={submitHandler}>
          <Text style={styles.buttonText}>Submit Recording</Text>
      </TouchableOpacity>

      </ScrollView>
    )
};
export default CreatePracticeScreen;

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
      width: '100%',
    },
    attachButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    attachText: {
      marginLeft: 10,
      fontSize: 16,
      color: Colors.mainPurple,
      alignItems:'center'
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
