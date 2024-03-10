import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Platform, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IP_ADDRESS from '../../constants/ip_address_temp';
import LoadingComponent from '../../components/ui/LoadingComponent';

function CreateGoalsForStudents({ route }) {
  const [practiceGoalCount, setPracticeGoalCount] = useState(0);
  const [assignmentGoalCount, setAssignmentGoalCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const { studentID, studentName } = route.params;

  const [currentPracticeGoalCount, setCurrentPracticeGoalCount] = useState(0);
  const [currentAssignmentGoalCount, setCurrentAssignmentGoalCount] = useState(0);
  const [currentPoints, SetCurrentpoints] = useState(0);

  useEffect(() => {
      const fetchStudentGoals = async () => {
          setLoadingState(true);
          try {
              const fetchStudentGoalsUrl = `${IP_ADDRESS}/goals/student/${studentID}`;
              const response = await axios.get(fetchStudentGoalsUrl);
              if (response.data) {
                  setCurrentPracticeGoalCount(response.data.practiceGoalCount);
                  setCurrentAssignmentGoalCount(response.data.assignmentGoalCount);
                  SetCurrentpoints(response.data.points);
              }
          } catch (error) {
              console.log("Error", "Failed to fetch student goals.");
          } finally {
              setLoadingState(false);
          }
      };

      fetchStudentGoals();
  }, [studentID]);

  const handleSetGoal = async () => {
      setLoadingState(true);

      try {
          const requestBody = {
              practice_goal_count: practiceGoalCount,
              assignment_goal_count: assignmentGoalCount,
              points: points, // 
          };
          const editStudentGoalsUrl = `${IP_ADDRESS}/goals/update-goal/${studentID}`;
          await axios.put(editStudentGoalsUrl, requestBody);
          Alert.alert("Success", "Goals updated successfully.");
      } catch (error) {
          Alert.alert("Error", "Failed to update goals.");
      } finally {
          setLoadingState(false);
      }
  };

  // Function to validate and set the new points from TextInput
  const handleSetPoints = (newPoints) => {
    const validatedPoints = parseInt(newPoints, 10);
    if (!isNaN(validatedPoints)) {
        setPoints(validatedPoints);
    } else {
        setPoints(0); // Reset to 0 if the input is not a number
    }
};
  // Counter component
  const Counter = ({ label, count, setCount }) => (
    <View style={styles.goalCounterContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.counter}>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => setCount(Math.max(0, count - 1))}>
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>
        <View style={styles.countDisplay}>
          <Text style={styles.counterText}>{count}</Text>
        </View>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => setCount(count + 1)}>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CurrentGoals = ({ currentPracticeGoalCount, currentAssignmentGoalCount, currentPoints }) => {
    return (
      <View style={styles.currentGoalsContainer}>
        <Text style={styles.currentGoalsText}>Current Goal:</Text>
        <View style={styles.goalsRow}>
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>Practice Goal</Text>
            <Text style={styles.goalValue}>{currentPracticeGoalCount}</Text>
          </View>
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>Assignment Goal</Text>
            <Text style={styles.goalValue}>{currentAssignmentGoalCount}</Text>
          </View>
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>Points Allocated</Text>
            <Text style={styles.goalValue}>{currentPoints}</Text>
          </View>
        </View>
      </View>
    );
  };

  const isGoalsSet = currentPracticeGoalCount > 0 || currentAssignmentGoalCount > 0;

    return (
      <LoadingComponent isLoading={loadingState}>
      <View style={styles.container}>
          <Text style={styles.title}>Set Weekly Goal for {studentName}</Text>
          {isGoalsSet ? (
              <CurrentGoals
                  currentPracticeGoalCount={currentPracticeGoalCount}
                  currentAssignmentGoalCount={currentAssignmentGoalCount}
                  currentPoints={currentPoints}
              />
          ) : (
              <Text style={styles.createGoalPrompt}>Create a goal to get started!</Text>
          )}
                <View style={styles.goalRow}>
                  <Counter label="Practice Goal" count={practiceGoalCount} setCount={setPracticeGoalCount} />
                  <Counter label="Assignment Goal" count={assignmentGoalCount} setCount={setAssignmentGoalCount} />
                </View>
                <View style={styles.goalRow}>
                  <Text style={[styles.label, styles.pointsLabel]}>Points Awarded</Text>
                  <TextInput 
                    style={styles.pointsInput} 
                    value={points !== 0 ? points.toString() : ''} 
                    placeholder={points === 0 ? currentPoints.toString() : '0'}
                    onChangeText={handleSetPoints}
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    returnKeyType="done"
                    onEndEditing={() => Keyboard.dismiss()}
                  />
                </View>
                <TouchableOpacity style={styles.confirmButton} onPress={handleSetGoal}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </LoadingComponent>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    goalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterText: {
        fontSize: 24,
        minWidth: 50,
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: '#4664EA',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    currentGoalsText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  goalText: {
      fontSize: 16,
      marginBottom: 5,
  },
  goalCounterContainer: {
    alignItems: 'center',
    width: '50%', // Half the container width to fit two counters in one row
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  createGoalPrompt: {
      fontSize: 16,
      fontStyle: 'italic',
      marginBottom: 20,
      textAlign: 'center',
  },
  pointsInput: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,  // If you want some space around your input
    textAlign: 'center',
    fontSize: 18,
    width: 80,  // Fixed width for the input field
    flex: 1,
},
pointsLabel: {
  marginBottom: 10, // Add some space above the text input
},
counter: {
  flexDirection: 'row',
  alignItems: 'center',
},
counterButton: {
  backgroundColor: '#6F66FF',
  paddingHorizontal: 15,
  paddingVertical: 10,
  margin: 5,
  borderRadius: 5,
},
counterButtonText: {
  fontSize: 20,
  color: 'white',
  fontWeight: 'bold',
},
countDisplay: {
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderWidth: 1,
  borderColor: 'lightgrey',
  borderRadius: 5,
  margin: 5,
},
counterText: {
  fontSize: 20,
},
counterContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
},
label: {
  fontSize: 16,
  fontWeight: 'bold',
},
pointsInput: {
  borderWidth: 1,
  borderColor: 'grey',
  borderRadius: 5,
  padding: 10,
  width: 80,
  textAlign: 'center',
  fontSize: 18,
},

currentGoalsContainer: {
  alignItems: 'center',
  marginVertical: 20,
},
currentGoalsText: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 10,
},
goalsRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '100%',
},
goalCard: {
  backgroundColor: 'white',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 10,
  flex: 1, // The flex property allows the card to grow and shrink dynamically
  margin: 5, // Keep some space between cards
  alignItems: 'center',
  justifyContent: 'center',
  // Shadow styles...
},
goalLabel: {
  fontSize: 12,
  color: '#777',
  marginBottom: 5, // Give some space between the label and the value
  textAlign: 'center',
},
goalValue: {
  fontSize: 18,
  fontWeight: 'bold',
},

    // ... other styles
});

export default CreateGoalsForStudents;
