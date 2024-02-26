import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Button, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import theme from '../../styles/theme';
import AnimatedPlaceholderInput from '../../components/ui/animateTextInput';
import * as ImagePicker from "expo-image-picker";
import { Audio, Video, ResizeMode} from 'expo-av';
import LottieView from 'lottie-react-native';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { useSelector, useDispatch } from 'react-redux';
import { setCache, clearCache } from '../../cacheSlice';

function CreatePracticeScreen({navigation}){
    // const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const cancelIcon = require('../../assets/cancel.png');
    const [videos, setVideos] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});

    const [selectedVideo, setSelectedVideo] = useState(null);

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const openVideo = (uri) => {
        setSelectedVideo(uri);
        toggleModal(); 
    }

    const submitHandler = async ()=> {
        console.log('Practice Title on Submit:', title, 'Type:', typeof title );
        console.log('Student\'s Practice Comments on Submit:', comment, 'Type:', typeof comment );

        

        // Step 2: Validate Data (this is a basic example, you might need more complex validation)
        // if (!practiceData.title || !practiceData.comment || !practiceData.videos) {
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

        // Step 1: Collect Data
        const practiceData = {
            title: title,
            comment: comment,
            student_id: parsedData.userId,
            student_name: parsedData.name,
            teacher_id: 'WA2G3fxLzNSdKWwerstzG7siTfu1', //hardcode for testing
            teacher_name: 'Jake'
        };
        console.log('practiceData: ', practiceData)          
        
        if (videos.length > 0 && videos[0].uri) {
            // Assuming `videos[0]` is the video object that you logged
            const video = videos[0];
            console.log('video: ',video)
        
            // Append the video file to the formData
            formData.append("video", {
              uri: video.uri,
              name: video.fileName, // Use the filename from the video object
              type: 'video/mov' // You can hardcode the type or derive it from the fileName
            });
            console.log('videouri: ', video.uri)
            console.log('vidfilename: ', video.fileName)
            console.log('vidtype: ', video.type)

        }
        formData.append("practice", {"string" : JSON.stringify(practiceData), type: 'application/json'});
        console.log(formData)

        try {
            const response = await fetch(`${IP_ADDRESS}/practices/create`, {
                method: 'POST',
                body: formData,
            });
              
            if (!response.ok) {
              const errorText = response.statusText || 'Unknown error occurred';
              throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const responseData = await response.json();
            console.log(responseData);
            // dispatch(setCache({ key: 'practiceData', value: practiceData })); 
            // navigation.navigate('PracticeListStudentScreen');
            Alert.alert('Success', 'Practice created successfully!');
        } catch (error) {
            console.error('Error recording practice:', error);
            Alert.alert('Error', `Failed to create practice. ${error.response?.data?.message || 'Please try again.'}`);
        }
    }

    const uploadVideo = async(mode) => {
        try {
            let result = {};
            if (mode==='gallery'){
                console.log('gallery')
                await ImagePicker.requestMediaLibraryPermissionsAsync()
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                    // allowsEditing: true,
                    aspect: [4,3],
                    quality: 1,
                })
            } 
            if(!result.canceled){
                console.log('vid result: ', result)
                await saveVideo(result.assets[0]);
            }
        } catch (error){
            alert("error uploading video:"+ error.message
            );
            setModalVisible(false);

        }
    };
    
    const removeVideo = (index) => {
        setVideos((currentVideos) => currentVideos.filter((_, i) => i !== index));
    };

    const saveVideo = (newVideo) => {
        setVideos((currentVideos) => [...currentVideos, newVideo]);
        setLoadingStates((currentLoadingStates) => ({ ...currentLoadingStates, [newVideo]: true }));
    };
    
    
    return (
        <ScrollView style={theme.container} contentContainerStyle={styles.contentContainer}> 
        <View>
            <AnimatedPlaceholderInput 
                placeholder="Practice Name" 
                secureTextEntry={false} 
                textInputConfig={{autoCapitalize: 'words'}}
                value={title}
                onChangeText={setTitle}>    
            </AnimatedPlaceholderInput>

            <AnimatedPlaceholderInput 
                placeholder="Comment" 
                secureTextEntry={false} 
                textInputConfig={{multiline: true}}
                value={comment}
                onChangeText={setComment}>
            </AnimatedPlaceholderInput>
            
            {/* Upload Buttons  */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={theme.button2} onPress={() => uploadVideo("gallery")}>
                    <Text style={theme.buttonText}>Upload Video</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for viewing the video */}
            <Modal
                    isVisible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Video
                                source={{ uri: selectedVideo }}
                                style={styles.modalVideo}
                                resizeMode={ResizeMode.CONTAIN}
                                // useNativeControls
                                shouldPlay
                            />
                            <Button title="Close" onPress={() => setModalVisible(!isModalVisible)} />
                        </View>
                    </View>
                </Modal>

            {/* Render each image with a remove button next to it */}
            <ScrollView horizontal>
                {videos.map((uri, index) => (
                    <View key={uri} style={styles.imageContainer}>
                        {/* {loadingStates[uri] && (
                            <LottieView
                                source={require('../assets/loading_fyp.json')} // Update with your Lottie file path
                                autoPlay
                                loop
                                style={styles.lottie}
                            />
                        )} */}
                        <TouchableOpacity onPress={() => openVideo(uri)}>
                            <Video
                                source={{ uri }}
                                style={styles.video}
                                resizeMode={ResizeMode.COVER}
                                // useNativeControls
                                // onLoadStart={() => setLoadingStates({ ...loadingStates, [uri]: true })}
                                // onLoad={() => setLoadingStates({ ...loadingStates, [uri]: false })}
                            />
                            <TouchableOpacity onPress={() => removeVideo(index)} style={styles.removeButton}>
                                {/* <Text style={theme.buttonText}>x</Text> */}
                                <Image source={cancelIcon} style={styles.cancelIcon} /> 
                            </TouchableOpacity>
                            <View style={styles.buttons}>
                        </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Submit button */}
            <TouchableOpacity style={theme.button} onPress={submitHandler}>
                <Text style={theme.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>

        
    </ScrollView> 
    )
};
export default CreatePracticeScreen;

const styles = StyleSheet.create({
    contentContainer:{
        flexGrow: 1, // Makes sure all content will be scrolled
    },
    innerContainer:{
        padding: 20,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 10, // Add space between images
        marginTop: 20,
        marginLeft: 10,
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
    video: {
        width: 150,
        height: 150,
        // other styles you might want to add
    },
    lottie: {
        position: 'absolute',
        width: '100%',
        size: '50%',
        height: '100%',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalVideo: {
        width: Dimensions.get('window').width * 0.8, // 80% of window width
        height: Dimensions.get('window').height * 0.5, // 40% of window height
    },
});