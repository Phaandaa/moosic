import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, Alert, StyleSheet,View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomepageSearchBar from '../../components/ui/homepageSearchbar';
import theme from '../../styles/theme';
import IP_ADDRESS from '../../constants/ip_address_temp';
import LoadingComponent from '../../components/ui/LoadingComponent';
import Colors from '../../constants/colors';
import { useAuth } from '../../context/Authcontext';

function MyStudentsScreen({ navigation }) {
    const { state } = useAuth();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [teacherID, setTeacherID] = useState(state.userData.id);
    const [fetchError, setFetchError] = useState(false);
    const [loadingstate, setLoadingState] = useState(false);

    useEffect(() => {
        const fetchStudentsApi = `${IP_ADDRESS}/students/teacher/${teacherID}/`;
        const fetchStudents = async() => {
            try {
                setLoadingState(true);
                const response = await axios.get(fetchStudentsApi, state.authHeader);
                const data = response.data;
                
                if (data.length > 0) {
                    setStudents(data);
                    setFilteredStudents(data);
                } else {
                    setFetchError(true);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                setFetchError(true);
            }
            finally{
                setLoadingState(false);
            }
        };
        if(teacherID){
            fetchStudents();
        }
    }, [teacherID]);

    const handleSearch = (query) => {
        if (!query.trim()) {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(student =>
                student.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    };

    return (
        <LoadingComponent isLoading={loadingstate}>
        <ScrollView style={theme.container}>
            <HomepageSearchBar onSearch={handleSearch} />
            
            {fetchError ? (
                <Text style={[theme.textTitle, {marginTop: 10}]}>You have no students.</Text>
            ) : (
                <>
                    <Text style={[theme.textTitle, {marginTop: 10}]}>My Students</Text>
                    {filteredStudents.map((student, index) => (
                        student.name ? (
                            <View key={index} style={styles.card}>
                                <Text style={theme.cardTextBold}>{student.name || "Unnamed Student"}</Text>
                                <View style={theme.buttonContainer}>
                                    <TouchableOpacity style={theme.smallButtonLeftMarginBlue} onPress={() => navigation.navigate('PracticeListTeacherScreen', { studentID: student.id, studentName: student.name })}>
                                        <Text style={theme.smallButtonText}>Practice</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={theme.smallButtonLeftMargin} onPress={() => navigation.navigate('CreatedAssignmentsListScreen', { studentID: student.id, studentName: student.name })}>
                                        <Text style={theme.smallButtonText}>Assignments</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={theme.smallButtonLeftMarginGreen} onPress={() => navigation.navigate('CreateGoalsForStudents', { studentID: student.id, studentName: student.name })}>
                                        <Text style={theme.smallButtonText}>Goals</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null
                    ))}
                    
                </>
            )}
            
        </ScrollView>
        </LoadingComponent>
    );    
}

export default MyStudentsScreen;


const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.accentGrey,
        padding: 20,
        borderRadius: 15,
        marginTop: 10, 
        flexDirection: 'column',
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    cardTextContainer: {
        flex: 1, 
        marginRight: 8, 
    },
    cardText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cardTextBold:{
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
        paddingVertical: 5
      },
    buttonContainer: {
        flexDirection: 'row',
        width : '100%',
    },
})
