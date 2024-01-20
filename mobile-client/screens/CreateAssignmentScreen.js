import {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';
import * as ImagePicker from "expo-image-picker";

function CreateAssignmentScreen({  }){
    const [assignmentName, setAssignmentName] = useState();
    const [assignmentDesc, setAssignmentDesc] = useState();
    const [assignmentDeadline, setAssignmentDeadline] = useState();

    const [image, setImage] = useState();
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
    
    const removeImage = async() => {
        console.log("Removing image");
        try {
            saveImage(null);
        } catch ({message}){
            alert(message);
        }
    };

    const saveImage = async(image) => {
        try {
            console.log(image)
            setImage(image);
            // setModalVisible(false);
        } catch (error){
            throw error;
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

            <TouchableOpacity style={theme.button} onPress={() => uploadImage("gallery")}>
                <Text style={theme.buttonText }>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={theme.button} onPress={() => {console.log('Remove button pressed');
            removeImage()}}>
                <Text style={theme.buttonText }>Remove Photo</Text>
            </TouchableOpacity>
            
            {image && (
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                />
            )}

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
    image: {
        width: 150,
        height: 150
    }
});
