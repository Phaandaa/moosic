import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert} from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import StudentDropdown from '../components/ui/StudentDropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useSelector, useDispatch } from 'react-redux';
import { setCache, clearCache } from '../cacheSlice';

function CreateAssignmentScreen({navigation}){
    const dispatch = useDispatch();
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentDesc, setAssignmentDesc] = useState('');
    const [assignmentDeadline, setAssignmentDeadline] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [submissionDate, setSubmissionDate] = useState(new Date());


    const cancelIcon = require('../assets/cancel.png');
    const documentLogo = require('../assets/filelogo.png')
    const [images, setImages] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const toggleDatepicker = () => {
        setShowPicker(!showPicker);
    };
    const onChange = ({type}, selectedDate) => {
        if(type=='set'){
            const currentDate = selectedDate;
            setDate(currentDate)

            if (Platform.OS === "android"){
                toggleDatepicker();
                setDate(currentDate.toDateString());
            }
        } else {
            toggleDatepicker();
        }
    };

    const confirmIOSDate = () => {
        setAssignmentDeadline(date.toDateString());
        toggleDatepicker();
    }
    
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
        const nowDate = new Date();
        setSubmissionDate(nowDate);
        console.log('Assignment Name on Submit:', assignmentName, 'Type:', typeof assignmentName );
        console.log('Assignment Desc on Submit:', assignmentDesc, 'Type:', typeof assignmentDesc );
        console.log('Assignment Deadline on Submit:', assignmentDeadline, 'Type:', typeof assignmentDeadline );
        console.log('Students', selectedStudents, 'Type:', typeof selectedStudents );
        console.log('Submission Date', submissionDate, 'Type:', typeof submissionDate );
        
        // Step 1: Collect Data
        const assignmentData = {
            name: assignmentName,
            description: assignmentDesc,
            deadline: assignmentDeadline,
            images: images,
            documents: uploadedDocuments,
            students: selectedStudents,
            submissionDate: submissionDate.toString()     
        };
        console.log(assignmentData)

        // Step 2: Validate Data (this is a basic example, you might need more complex validation)
        if (!assignmentData.name || !assignmentData.description || !assignmentData.deadline) {
            alert('Please fill all fields');
            return;
        }
        else{
            dispatch(setCache({ key: 'assignmentData', value: assignmentData })); 
            navigation.navigate('ViewCreatedAssignmentsScreen', { assignmentData });
            alert('Success!')
        }
    }
   
    return (
        <ScrollView style={theme.container} contentContainerStyle={theme.contentContainer}> 
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

            {/*<AnimatedPlaceholderInput 
                placeholder="Deadline (DD-MM-YYYY)" 
                secureTextEntry={false} 
                textInputConfig={{ 
                    maxLength: 10
                }}
                value={assignmentDeadline}
                onChangeText={setAssignmentDeadline}>
            </AnimatedPlaceholderInput>*/}

            {/* <View style={{margin: 20}}><Text style={assignmentStyles.placeholder}>Deadline</Text></View> */}

            {showPicker && Platform.OS === "ios" &&(
                <View></View>
            )}



            <View style={{flexDirection:'row', justifyContent: 'space-around'}}> 
                <TouchableOpacity style={theme.button} onPress={toggleDatepicker}>
                    <Text style={theme.buttonText}>Select Date</Text>
                </TouchableOpacity>
                <TouchableOpacity style={theme.button} onPress={confirmIOSDate}>
                    <Text style={theme.buttonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
            {!showPicker && (
                <AnimatedPlaceholderInput 
                    onPress={toggleDatepicker}
                    // placeholder="Deadline (DD-MM-YYYY)" 
                    secureTextEntry={false} 
                    value={assignmentDeadline}
                    onChangeText={setAssignmentDeadline}
                    onPressIn={toggleDatepicker}
                    editable={false}
                    >
                </AnimatedPlaceholderInput>
            )}
            
            {showPicker && (
                <DateTimePicker 
                    mode="date"
                    display="spinner"
                    value={date}
                    onChange={onChange}
                    style={assignmentStyles.datePicker}
                />
            )}     
            
            {/* Upload Buttons  */}
            <View style={theme.buttonsContainer}>
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
                    <View key={uri} style={theme.imageContainer}>
                        <Image source={{ uri }} style={theme.assignmentImage} />
                        <TouchableOpacity onPress={() => removeImage(index)} style={theme.removeButton}>
                            {/* <Text style={theme.buttonText}>x</Text> */}
                            <Image source={cancelIcon} style={theme.cancelIcon} /> 
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Show uploaded documents section */}
            {uploadedDocuments.map((doc, index) => (
                <View key={index.toString()} style={theme.documentItemContainer}>
                    <Image
                    source={documentLogo}
                    style={theme.documentThumbnail}
                    />
                    <Text style={theme.documentName}>{doc.name}</Text>
                    <TouchableOpacity onPress={() => removeDocument(index)} style={theme.removeButton}>
                    <Image source={cancelIcon} style={theme.cancelIcon} />
                    </TouchableOpacity>
                </View>
            ))}
            
            <Text style={theme.label}>Assign Students</Text>
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