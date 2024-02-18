import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Button } from 'react-native';
import theme from '../../styles/theme';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';


function ViewCreatedAssignmentsScreen() {
    const assignmentData = useSelector(state => state.cache.assignmentData) || { images: [], documents: [], name: '', description: '', deadline: '', submissionDate: '' };

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const openImage = (uri) => {
        setSelectedImage(uri);
        toggleModal(); 
    }

    // Check if there are any assignments created
    const hasAssignments = assignmentData.name || assignmentData.description || assignmentData.images.length > 0 || assignmentData.documents.length > 0;

    return (
        <ScrollView style={theme.container}>
            <View> 
                {!hasAssignments ? (
                    <Text style={[theme.textTitle, {marginTop: 50, verticalAlign: 'middle'}]}>You have no created assignments.</Text>
                ) : (
                    <><Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Created Assignments</Text><View style={theme.card2}>

                            <View style={theme.cardTextContainer}>
                                <Text style={theme.cardTitle}>{assignmentData.name}</Text>
                                <Text style={theme.cardText}>Description: {assignmentData.description}</Text>
                                <Text style={theme.cardText}>Deadline: {assignmentData.deadline}</Text>
                                <Text style={theme.cardText}>Created on: {assignmentData.submissionDate}</Text>
                                <Text style={theme.cardText}>Attachments:</Text>

                                {assignmentData.images.map((image, index) => (
                                    <View key={index} style={theme.imageContainer}>
                                        <TouchableOpacity onPress={() => openImage(image.uri)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="image" size={24} color="black" />
                                            <Text style={theme.documentName}>{image.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <Modal isVisible={isModalVisible}>
                                    <View style={theme.modalContent}>
                                        <Image source={{ uri: selectedImage }} style={theme.fullSizeImage} />
                                        <Button title="Close" onPress={toggleModal} />
                                    </View>
                                </Modal>

                                {assignmentData.documents.map((doc, index) => (
                                    <View key={index.toString()} style={theme.documentItemContainer}>
                                        <Ionicons name="document-attach" size={24} color="black" />
                                        <Text style={theme.documentName}>{doc.name}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={theme.buttonContainer2}>
                                <TouchableOpacity style={theme.smallButton}>
                                    <Text style={theme.smallButtonText}>View Submission</Text>
                                </TouchableOpacity>
                            </View>

                        </View></>
                    
                )}
            </View>
        </ScrollView>
    );
}

export default ViewCreatedAssignmentsScreen;
