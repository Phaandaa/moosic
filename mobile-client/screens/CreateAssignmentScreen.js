import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView} from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';
import * as ImagePicker from "expo-image-picker";
import StudentDropdown from '../components/StudentDropdown';
function CreateAssignmentScreen({navigation}){
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentDesc, setAssignmentDesc] = useState('');
    const [assignmentDeadline, setAssignmentDeadline] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);

    const cancelIcon = require('../assets/cancel.png');
    const [images, setImages] = useState([]);

    

    const uploadImage = async(mode) => {
        try {
            let result = {};
            if (mode==='gallery'){
                console.log('gallery')
                await ImagePicker.requestMediaLibraryPermissionsAsync()
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    // allowsEditing: true,
                    aspect: [4,3],
                    quality: 1,
                })
            } 
            // else {
                // await ImagePicker.requestCameraPermissionsAsync();
                // result = await ImagePicker.launchCameraAsync({
                //     cameraType: ImagePicker.CameraType.back,
                //     allowsEditing: true,
                //     // aspect: [1,1],
                //     quality: 1
                // });
            // }
            
            if(!result.canceled){
                console.log('result not cancelled')
                await saveImage(result.assets[0].uri);
            }
        } catch (error){
            alert("error uploading image:"+ error.message
            );
            setModalVisible(false);

        }
    };
    
    // const removeImage = async() => {
    //     console.log("Removing image");
    //     try {
    //         saveImage(null);
    //     } catch ({message}){
    //         alert(message);
    //     }
    // };
    const removeImage = (index) => {
        setImages((currentImages) => currentImages.filter((_, i) => i !== index));
    };

    const saveImage = (newImage) => {
        setImages((currentImages) => [...currentImages, newImage]);
        // try {
        //     console.log(image)
        //     setImage(image);
        //     // setModalVisible(false);
        // } catch (error){
        //     throw error;
        // }
    };

    // const cancelHandler = () =>{
    //     navigation.navigate('HomeScreen');
    // }
        
    const submitHandler = () => {
        console.log('Assignment Name on Submit:', assignmentName, 'Type:', typeof assignmentName );
        console.log('Assignment Desc on Submit:', assignmentDesc, 'Type:', typeof assignmentDesc );
        console.log('Assignment Deadline on Submit:', assignmentDeadline, 'Type:', typeof assignmentDeadline );
        console.log('Students', selectedStudents, 'Type:', typeof selectedStudents );

        // Step 1: Collect Data
        const assignmentData = {
            name: assignmentName,
            description: assignmentDesc,
            deadline: new Date(assignmentDeadline),
            images: images,
            students: selectedStudents
        };
        console.log(assignmentData)

        // Step 2: Validate Data (this is a basic example, you might need more complex validation)
        if (!assignmentData.name || !assignmentData.description || !assignmentData.deadline) {
            alert('Please fill all fields');
            return;
        }
        else{
            alert('Success!')
        }
    }
   
    return (
        <View style={theme.container}>
            <AnimatedPlaceholderInput 
                placeholder="Assignment Name" 
                secureTextEntry={false} 
                textInputConfig={{autoCapitalize: 'words'}}
                value={assignmentName}
                onChangeText={setAssignmentName}>    
            </AnimatedPlaceholderInput>

            <AnimatedPlaceholderInput 
                placeholder="Description" 
                secureTextEntry={false} 
                textInputConfig={{multiline: true}}
                value={assignmentDesc}
                onChangeText={setAssignmentDesc}>
            </AnimatedPlaceholderInput>

            <AnimatedPlaceholderInput 
                placeholder="Deadline (DD-MM-YYYY)" 
                secureTextEntry={false} 
                textInputConfig={{ 
                    maxLength: 10
                }}
                value={assignmentDeadline}
                onChangeText={setAssignmentDeadline}>
            </AnimatedPlaceholderInput>

            <TouchableOpacity style={theme.button2} onPress={() => uploadImage("gallery")}>
                <Text style={theme.buttonText}>Upload Photo</Text>
            </TouchableOpacity>
            
            {/* Render each image with a remove button next to it */}
            <ScrollView horizontal>
                {images.map((uri, index) => (
                    <View key={uri} style={styles.imageContainer}>
                        <Image source={{ uri }} style={styles.image} />
                        <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
                            {/* <Text style={theme.buttonText}>x</Text> */}
                            <Image source={cancelIcon} style={styles.cancelIcon} /> 
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            
            <Text style={styles.label}>Assign Students</Text>
            <StudentDropdown onSelectionChange={setSelectedStudents} />

            {/* Cancel button */}
            {/* <TouchableOpacity style={theme.button} onPress={cancelHandler}>
                <Text style={theme.buttonText}>Cancel</Text>
            </TouchableOpacity> */}

            {/* Submit button */}
            <TouchableOpacity style={theme.button} onPress={submitHandler}>
                <Text style={theme.buttonText}>Submit</Text>
            </TouchableOpacity>
            
            {/* <TouchableOpacity style={theme.button} onPress={() => {console.log('Remove button pressed');
            removeImage()}}>
                <Text style={theme.buttonText }>Remove Photo</Text>
            </TouchableOpacity>
            
            {image && (
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                />
            )} */}

            {/* <Image
                source={{ uri: image }}
                // source={{ uri }}
                style={[
                    styles.image,
                ]}
            /> */}
        </View>
        
    )
};
export default CreateAssignmentScreen;

const styles = StyleSheet.create({
    // container:{
    //     flex: 1,
    //     marginTop: 100,
    //     alignItems: 'center',
    // },
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
    }
});
