import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView} from 'react-native';
import theme from './styles/theme';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
function ViewCreatedAssignmentsScreen({route}){
    const assignmentData = useSelector(state => state.cache.assignmentData);
    const documentLogo = require('../assets/filelogo.png')
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const openImage = (uri) => {
        setSelectedImage(uri);
        toggleModal(); 
    }

    return (
        <ScrollView style={theme.container}>
        <View> 
            <View style={theme.card2}>
                <View style={theme.cardTextContainer}>
                <Text style={theme.cardTitle}>{assignmentData.name}</Text>
                    <Text style={theme.cardText}>Description: {assignmentData.description}</Text>
                    <Text style={theme.cardText}>Deadline: {assignmentData.deadline}</Text>
                    <Text style={theme.cardText}>Created on: {assignmentData.submissionDate}</Text>
                    <Text style={theme.cardText}>Attachments:</Text>
                    
                    {/* Map over the images array to display each image */}
                    {/* {assignmentData.images && assignmentData.images.map((uri, index) => (
                        <Image
                            key={index}
                            source={{ uri }}
                            style={theme.assignmentImage} // Add your image style here
                        />
                    ))} */}

                    <ScrollView horizontal>
                        {assignmentData.images && assignmentData.images.map((uri, index) => (
                            <TouchableOpacity key={uri} onPress={() => openImage(uri)} style={theme.imageContainer}>
                                <Image
                                    key={index}
                                    source={{ uri }}
                                    style={theme.assignmentImage} // Add your image style here
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                        <View style={theme.modalContent}>
                            <Image source={{uri:selectedImage}} style={theme.fullSizeImage} />
                        </View>
                    </Modal>
                    
                    {assignmentData.documents.map((doc, index) => (
                        <View key={index.toString()} style={theme.documentItemContainer}>
                            <Image
                            source={documentLogo}
                            style={theme.documentThumbnail}
                            />
                            <Text style={theme.documentName}>{doc.name}</Text>
                        </View>
                    ))}

                </View>
                <View style={theme.buttonContainer2}> 
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText}>View Submission</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText}>Give Feedback</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>
        </ScrollView>
    )
}; 
export default ViewCreatedAssignmentsScreen;
