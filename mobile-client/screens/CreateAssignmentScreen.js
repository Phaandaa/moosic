import {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';
import * as ImagePicker from "expo-image-picker";

function CreateAssignmentScreen({  }){
    console.log('create assignment screen')
    const [image, setImage] = useState();
    const uploadImage = async(mode) => {
        console.log('upload button pressed');
        try {
            let result = {};
            if (mode==='gallery'){
                console.log('gallery')
                await ImagePicker.requestMediaLibraryPermissionsAsync()
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1,1],
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

    const saveImage = async(image) => {
        try {
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
                textInputConfig={{autoCapitalize: 'words'}}>
            </AnimatedPlaceholderInput>

            <AnimatedPlaceholderInput 
                placeholder="Description" 
                secureTextEntry={false} 
                textInputConfig={{multiline: true}}>
            </AnimatedPlaceholderInput>

            <AnimatedPlaceholderInput 
                placeholder="Deadline (DD-MM-YYYY)" 
                secureTextEntry={false} 
                textInputConfig={{ 
                    maxLength: 10
                }}>
            </AnimatedPlaceholderInput>

            <Image
                source={{ uri: image }}
                // source={{ uri }}
                style={[
                    styles.image,
                ]}
            />
            <TouchableOpacity style={theme.button} onPress={() => uploadImage("gallery")}>
                <Text style={theme.buttonText }>Upload</Text>
            </TouchableOpacity>
            
            {/* <Input label="Assignment Name" textInputConfig={{
                // keyboardType: 'decimal-pad',
                autoCapitalize: 'words',
                onChangeText:assignmentNameChangedHandler,
            }} />
            <Input label="Description" textInputConfig={{
                multiline: true,
                // autocorrect: false // default is true
            }}/>
            <Input label="Deadline" textInputConfig={{
                placeholder: 'DD-MM-YYYY',
                maxLength: 10,
                onChangeText: () => {}
            }}/> */}
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
