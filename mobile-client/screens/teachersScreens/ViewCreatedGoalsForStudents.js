import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../styles/theme';
import HomepageSearchBar from '../../components/ui/homepageSearchbar';
import BottomTabNavigator from '../../components/ui/navbar';


const ViewCreatedGoalsForStudents = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [studentData, setStudentData] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [fetchError, setFetchError] = useState(false);
    const [goals, setStudentGoals] = useState([]);
    
    // Fetch goals using studentID
    useEffect(() => {
        const fetchGoalsAndStudentData = async () => {
          try {
            const storedData = await AsyncStorage.getItem('authData');
            if (!storedData) {
              throw new Error('No user data found.');
            }
            const parsedData = JSON.parse(storedData);
            const userId = parsedData.userId;
            
            // Fetch student data
            const fetchStudentDataUrl = `${IP_ADDRESS}/students/${userId}`;
            const studentResponse = await axios.get(fetchStudentDataUrl);
            if (studentResponse.data) {
              setStudentData(studentResponse.data); // Update student data
            } else {
              setStudentData({ pointsCounter: 0 }); // Set default if no student data found
            }
      
            // Fetch student's goals
            const fetchStudentsGoalsUrl = `${IP_ADDRESS}/goals/teacher/${userId}`;
            const goalsResponse = await axios.get(fetchStudentsGoalsUrl);
            if (goalsResponse.data) {
              // Since the data is an object, we wrap it in an array
              setGoals([goalsResponse.data]); // Wrap the object in an array and update goals
              console.log(goalsResponse.data);
            } else {
              setGoals([]); // Set goals to an empty array if no goals were fetched
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            setFetchError(true); // Set fetch error to true to indicate there was an error
          }
        };
      
        fetchGoalsAndStudentData();
      }, []);

    return (
        <View style={[theme.container, {paddingBottom: 0}]}>
            <Text> Create Goals for Students </Text>
            
        </View>
    );
}



export default ViewCreatedGoalsForStudents;