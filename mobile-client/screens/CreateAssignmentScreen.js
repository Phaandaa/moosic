import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert} from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import StudentDropdown from '../components/StudentDropdown';

function CreateAssignmentScreen({navigation}){
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentDesc, setAssignmentDesc] = useState('');
    const [assignmentDeadline, setAssignmentDeadline] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);

    const cancelIcon = require('../assets/cancel.png');
    const documentLogo = require('../assets/filelogo.png')
    const [images, setImages] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);

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
    
    const removeImage = (index) => {
        setImages((currentImages) => currentImages.filter((_, i) => i !== index));
    };

    const saveImage = (newImage) => {
        setImages((currentImages) => [...currentImages, newImage]);
    };

    const uploadDocument = async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync({ multiple: true });
          if (!result.canceled) {
            setUploadedDocuments(currentDocs => [...currentDocs, ...result.assets]);
          }
        } catch (err) {
          console.log('Error picking document:', err);
          Alert.alert('Something went wrong');
        }
    };

    const removeDocument = (index) => {
        setUploadedDocuments(currentDocs => currentDocs.filter((_, i) => i !== index));
    };
    

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
        <ScrollView style={theme.container} contentContainerStyle={styles.contentContainer}> 
        <View>
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
            
            {/* Upload Buttons  */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={theme.button2} onPress={() => uploadImage("gallery")}>
                    <Text style={theme.buttonText}>Upload Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={theme.button2} onPress={() => uploadDocument()}>
                    <Text style={theme.buttonText}>Upload Document</Text>
                </TouchableOpacity>
            </View>

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

            {/* Show uploaded documents section */}
            {uploadedDocuments.map((doc, index) => (
                <View key={index.toString()} style={styles.documentItemContainer}>
                    <Image
                    source={documentLogo}
                    style={styles.documentThumbnail}
                    />
                    <Text style={styles.documentName}>{doc.name}</Text>
                    <TouchableOpacity onPress={() => removeDocument(index)} style={styles.removeButton}>
                    <Image source={cancelIcon} style={styles.cancelIcon} />
                    </TouchableOpacity>
                </View>
                ))}
            
            <Text style={styles.label}>Assign Students</Text>
            <StudentDropdown onSelectionChange={setSelectedStudents} />

            {/* Submit button */}
            <TouchableOpacity style={theme.button} onPress={submitHandler}>
                <Text style={theme.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    </ScrollView> 
    )
};
export default CreateAssignmentScreen;

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
    }
});
