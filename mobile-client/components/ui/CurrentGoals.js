import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from "../../constants/colors"; 
import { useAuth } from '../../context/Authcontext';
import IP_ADDRESS from '../../constants/ip_address_temp';
import axios from 'axios';

const CurrentGoals = ({ isStudent, studentId }) => {
    const { state } = useAuth();
    const [goals, setGoals] = useState([]);
    const [progressbar, setProgressBar] = useState(0);
    const [loadingstate, setLoadingState] = useState(false);

    const fetchDataAndUpdateState = async () => {
        setLoadingState(true);
        try {
            const fetchStudentsGoalsUrl = `${IP_ADDRESS}/goals/student/${studentId}`;      
            const goalsResponse = await axios.get(fetchStudentsGoalsUrl, state.authHeader);
            setGoals(goalsResponse.data ? goalsResponse.data : []);
        } catch (error) {
            console.error('CurrentGoals.js line 20 error: ', error);
        } finally {
            setLoadingState(false);
        }
    };
      
    useEffect(() => {
        fetchDataAndUpdateState();
    }, []); 

    useEffect(() => {
    const totalGoals = goals.practiceGoalCount + goals.assignmentGoalCount;
    const completedGoals = Math.min(goals.practiceCount, goals.practiceGoalCount) + Math.min(goals.assignmentCount, goals.assignmentGoalCount);
    const newProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    setProgressBar(Math.round(newProgress));
    }, [goals]);
    
    return (
        
        <View style={styles.currentGoalsContainer}>
            {!loadingstate && <>
                <Text style={styles.currentGoalsText}>{isStudent ? "Goals At a Glance" : "Student's Current Progress"}</Text>
                
                <View style={[styles.goalsRow]}>
                <View style={[styles.goalCard, {backgroundColor: isStudent ? Colors.green : 'white'}]}>
                    <Text style={[styles.goalLabel, !isStudent ? { color: '#777' } : null]}>Practices Completed</Text>
                    <Text style={[styles.goalValue, !isStudent ? { color: '#777' } : null]}>{goals.practiceCount} / {goals.practiceGoalCount}</Text>
                </View>
                <View style={[styles.goalCard, {backgroundColor: isStudent ? Colors.orange : 'white'}]}>
                    <Text style={[styles.goalLabel, !isStudent ? { color: '#777' } : null]}>Assignment Completed</Text>
                    <Text style={[styles.goalValue, !isStudent ? { color: '#777' } : null]}>{goals.assignmentCount} / {goals.assignmentGoalCount}</Text>
                </View>
                <View style={[styles.goalCard, {backgroundColor: isStudent ? Colors.pink : 'white'}]}>
                    <Text style={[styles.goalLabel, !isStudent ? { color: '#777' } : null]}>Points Upon Completion</Text>
                    <Text style={[styles.goalValue, !isStudent ? { color: '#777' } : null]}>{goals.points}</Text>
                </View>
                </View>

                <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressBar, {width: `${Math.min(100,progressbar)}%`}]} />
                </View>
                <Text style={styles.progressText}>
                    {Math.min(100,progressbar)}% Completed
                </Text>
                </View>
            </>}
            {loadingstate && <Text>Loading...</Text>}
        </View>
          
    );
  };

  const styles = StyleSheet.create({
    currentGoalsContainer: {
      marginBottom: 20,
      marginVertical: 10,
    },
    currentGoalsText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    goalsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      
    },
    goalCard: {
      backgroundColor: 'white',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 10,
      flex: 1, 
      margin: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    goalLabel: {
      fontSize: 12,
      color: '#777',
      marginBottom: 5,
      textAlign: 'center',
      color: 'white'
    },
    goalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white'
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 20,
      position: 'relative', 
  },
  
  progressTrack: {
      backgroundColor: '#e0e0e0', 
      borderRadius: 20,
      height: 30,
      width: '100%', 
      position: 'hidden', 
  },
  
  progressBar: {
      backgroundColor: 'lightgreen',
      height: '100%',
      borderRadius: 20,
      minWidth: 20,
      maxWidth: '100%',
      position: 'absolute', 
  },
  
  progressText: {
      position: 'absolute',
      padding: 20,
      color: 'black',
  },
});

export default CurrentGoals;
