import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Button } from 'react-native';
import theme from './styles/theme';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';

function ViewAssignmentsScreen(){
    // const assignmentData = useSelector(state => state.cache.assignmentData);
    const assignmentData = {
        name: 'Music Theory Grade 2',
        description: 'Pages 2-5',
        deadline: 'Wed Feb 14 2024',
        images: 'NA',
        documents: 'NA',
        students: ["5C4Q6ZILqoTBi9YnESwpKQuhMcN2"],
        submissionDate: 'Thu Feb 08 2024 20:26:21 GMT+0700'
    }      
    const imageLogo = require('../assets/imagethumbnail.png')
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
                    
                    {/* {assignmentData.images && assignmentData.images.map((image, index) => (
                        <View key={index} style={theme.imageContainer}>
                            <TouchableOpacity onPress={() => openImage(image.uri)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={imageLogo}
                                    style={theme.documentThumbnail}
                                />
                                <Text style={theme.documentName}>{image.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))} */}
                    <View style={theme.imageContainer}>
                        <TouchableOpacity onPress={() => openImage(require('../assets/dummyimage1.jpeg'))} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={imageLogo}
                                style={theme.documentThumbnail}
                            />
                            <Text style={theme.documentName}>dummyimage1.jpeg</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={theme.imageContainer}>
                        <TouchableOpacity onPress={() => openImage(require('../assets/dummyimage2.jpeg'))} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={imageLogo}
                                style={theme.documentThumbnail}
                            />
                            <Text style={theme.documentName}>dummyimage2.jpeg</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal isVisible={isModalVisible} 
                    // onBackdropPress={toggleModal}
                    >
                        <View style={theme.modalContent}>
                            <Image source={require('../assets/dummyimage1.jpeg')} style={theme.fullSizeImage} />
                            <Button title="Close" onPress={toggleModal} />
                        </View>
                    </Modal>
                    
                    {/* {assignmentData.documents.map((doc, index) => (
                        <View key={index.toString()} style={theme.documentItemContainer}>
                            <Image
                            source={documentLogo}
                            style={theme.documentThumbnail}
                            />
                            <Text style={theme.documentName}>{doc.name}</Text>
                        </View>
                    ))} */}

                    <View style={theme.documentItemContainer}>
                        <Image
                        source={documentLogo}
                        style={theme.documentThumbnail}
                        />
                        <Text style={theme.documentName}>dummydoc1.pdf</Text>
                    </View>
                    <View style={theme.documentItemContainer}>
                        <Image
                        source={documentLogo}
                        style={theme.documentThumbnail}
                        />
                        <Text style={theme.documentName}>dummydoc2.pdf</Text>
                    </View>

                </View>
                <View style={theme.buttonContainer2}> 
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText}>Submit Assignment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText}>View Feedback</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </ScrollView>
    )
}; 
export default ViewAssignmentsScreen;

                
