import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../styles/theme';
import HomepageSearchBar from '../../components/ui/homepageSearchbar';
import axios from 'axios';
import IP_ADDRESS from '../../constants/ip_address_temp';
import LoadingComponent from '../../components/ui/LoadingComponent';


function ViewCreatedGoalsForStudents ({ navigation }) {
    const [search, setSearch] = useState('');
    const [studentData, setStudentData] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [fetchError, setFetchError] = useState(false);
    const [goals, setStudentGoals] = useState([]);
    const [loadingstate, setLoadingState] = useState(false);

    

    
    // Fetch goals using teacherID
    useEffect(() => {
        const fetchGoalsAndStudentData = async () => {
          try {
            setLoadingState(true);
            const storedData = await AsyncStorage.getItem('authData');
            if (!storedData) {
              throw new Error('No user data found.');
            }
            const parsedData = JSON.parse(storedData);
            const userId = parsedData.userId;
            
            // Fetch student data
            const fetchStudentDataUrl = `${IP_ADDRESS}/students/teacher/${userId}/`;
            const studentResponse = await axios.get(fetchStudentDataUrl);
            if (studentResponse.data) {
              setStudentData(studentResponse.data); // Update student data
              console.log(studentResponse.data)
              setFilteredStudents(studentResponse.data);
            } else {
              setStudentData([]); // Set default if no student data found
            }
      
            // Fetch student's goals
            const fetchStudentsGoalsUrl = `${IP_ADDRESS}/goals/teacher/${userId}`;
            const goalsResponse = await axios.get(fetchStudentsGoalsUrl);
            if (goalsResponse.data) {
              // Since the data is an object, we wrap it in an array
              setStudentGoals([goalsResponse.data]); // Wrap the object in an array and update goals
              
            } else {
              setStudentGoals([]); // Set goals to an empty array if no goals were fetched
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            setFetchError(true); // Set fetch error to true to indicate there was an error
          }
          finally{
            setLoadingState(false);
          }
        };
      
        fetchGoalsAndStudentData();
      }, []);

      // Handle search functionality
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
                            <TouchableOpacity key={index} style={styles.card}>
                                <View style={styles.cardTextContainer}>
                                    <Text style={theme.cardTextBold}>{student.name || "Unnamed Student"}</Text>
                                </View>
                                <View style={theme.buttonContainer}>
                                    <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('CreateGoalsForStudents', {
                                          studentID: student.id,
                                          studentName: student.name, // Assuming 'id' is the property that holds the student ID
                                        })}>
                                        <Text style={theme.smallButtonText}>Create Goal</Text>
                                    </TouchableOpacity>
                          
                                </View>
                            </TouchableOpacity>
                        ) : null
                    ))}
                    
                </>
            )}
            </ScrollView>
      </LoadingComponent>
    );
}

const styles = StyleSheet.create({
  card: {
      backgroundColor: '#EE97BC',
      padding: 20,
      borderRadius: 15,
      marginTop: 10, 
      flexDirection: 'row',
      justifyContent: 'space-between', // Align items on both ends
      alignItems: 'center', // Center items vertically
      
  },
  cardTextContainer: {
      flex: 1, // Take up as much space as possible
      marginRight: 8, // Add some margin to the right of the text
  },
  cardText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
  },
  buttonContainer: {
      flexDirection: 'row',
      // If you need space between buttons add justifyContent: 'space-between',
  },
  smallButton: {
      backgroundColor: '#4664EA',
      padding: 10,
      borderRadius: 15,
      marginLeft: 8, // Add some margin to separate the buttons
  },
  smallButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
  }
})

export default ViewCreatedGoalsForStudents;