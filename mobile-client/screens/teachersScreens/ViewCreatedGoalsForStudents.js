import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../styles/theme';
import HomepageSearchBar from '../../components/ui/homepageSearchbar';
import axios from 'axios';
import IP_ADDRESS from '../../constants/ip_address_temp';
import LoadingComponent from '../../components/ui/LoadingComponent';
import { useAuth } from '../../context/Authcontext';


function ViewCreatedGoalsForStudents ({ navigation }) {
    const { state } = useAuth();
    const [search, setSearch] = useState('');
    const [studentData, setStudentData] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [fetchError, setFetchError] = useState(false);
    const [goals, setStudentGoals] = useState([]);
    const [loadingstate, setLoadingState] = useState(false);

    

    
    useEffect(() => {
        const fetchGoalsAndStudentData = async () => {
          try {
            setLoadingState(true);
            
            const fetchStudentDataUrl = `${IP_ADDRESS}/students/teacher/${state.userData.id}/`;
            const studentResponse = await axios.get(fetchStudentDataUrl, state.authHeader);
            if (studentResponse.data) {
              setStudentData(studentResponse.data); 
              setFilteredStudents(studentResponse.data);
            } else {
              setStudentData([]); 
            }
      
            const fetchStudentsGoalsUrl = `${IP_ADDRESS}/goals/teacher/${state.userData.id}`;
            const goalsResponse = await axios.get(fetchStudentsGoalsUrl, state.authHeader);
            if (goalsResponse.data) {
              setStudentGoals([goalsResponse.data]);
            } else {
              setStudentGoals([]); 
            }
          } catch (error) {
            console.error('ViewGoalsForStudents.js line 50, Error fetching data:', error);
            setFetchError(true); 
          }
          finally{
            setLoadingState(false);
          }
        };
      
        fetchGoalsAndStudentData();
      }, []);

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
                            <View key={index} style={theme.card2}>
                                <View style={theme.cardTextContainer}>
                                    <Text style={theme.cardTitle}>{student.name || "Unnamed Student"}</Text>
                                </View>
                                <View style={theme.buttonContainer}>
                                    <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('CreateGoalsForStudents', {
                                    studentID: student.id,
                                    studentName: student.name,
                                  })}>
                                        <Text style={theme.smallButtonText}>Update Goal</Text>
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

const styles = StyleSheet.create({
  card: {
      backgroundColor: '#EE97BC',
      padding: 20,
      borderRadius: 15,
      marginTop: 10, 
      flexDirection: 'row',
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
  buttonContainer: {
      flexDirection: 'row',
  },
  smallButton: {
      backgroundColor: '#4664EA',
      padding: 10,
      borderRadius: 15,
      marginLeft: 8, 
  },
  smallButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
      textAlign: 'center',
  }
})

export default ViewCreatedGoalsForStudents;