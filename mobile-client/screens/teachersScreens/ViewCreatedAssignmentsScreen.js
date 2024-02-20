import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Button, Linking } from 'react-native';
import theme from '../../styles/theme';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const getFileNameFromUrl = (url) => {
    return url.split('/').pop();
  };
  
function ViewCreatedAssignmentsScreen() {
    const assignmentDataAll = useSelector(state => state.cache.assignmentDataAll); 
     
    console.log('assignmentDataAll', assignmentDataAll)
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
    // const hasAssignments = assignmentDataAll.name || assignmentDataAll.description || assignmentDataAll.images.length > 0 || assignmentDataAll.documents.length > 0;

    return (
        <ScrollView style={theme.container}>
            <Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Created Assignments</Text>
            {assignmentDataAll.length > 0 ? assignmentDataAll.map((assignment, index) => (
                <View key={index} style={theme.card2}>
                    <View style={theme.cardTextContainer}>
                        <Text style={theme.cardTitle}>{assignment.title}</Text>
                        <Text style={theme.cardText}>Description: {assignment.description}</Text>
                        <Text style={theme.cardText}>Deadline: {assignment.deadline}</Text>
                        <Text style={theme.cardText}>Attachments:</Text>
                        {assignment.assignmentDocumentLinks.map((link, linkIndex) => (
                            <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="link" size={24} color="black" />
                                <Text style={theme.documentName}> {getFileNameFromUrl(link)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={theme.buttonContainer2}>
                        <TouchableOpacity style={theme.smallButton}>
                            <Text style={theme.smallButtonText}>View Submission</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )) : (
                <View style={theme.card2}>
                    <Text>No assignments created yet.</Text>
                </View>
            )}
            <Modal isVisible={isModalVisible}>
                <View style={theme.modalContent}>
                    <Image source={{ uri: selectedImage }} style={theme.fullSizeImage} />
                    <Button title="Close" onPress={toggleModal} />
                </View>
            </Modal>
        </ScrollView>
    );
}

export default ViewCreatedAssignmentsScreen;
