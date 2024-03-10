import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LoadingComponent from '../../components/ui/LoadingComponent';
import IP_ADDRESS from '../../constants/ip_address_temp';
import moment from 'moment';

const GoalsScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [goals, setGoals] = useState([]);
  const [studentData, setStudentData] = useState({ pointsCounter: 0 });
  const [loadingstate, setLoadingState] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pointsLog, setPointsLog] = useState([]);
  const [points, setPoints] = useState(0);
  const [sortDescending, setSortDescending] = useState(true);
  
  const [progress, setProgress] = useState(0);


  
  // Fetch goals and student data
  const fetchGoalsAndStudentData = async () => {
    try {
      setLoadingState(true);
      const storedData = await AsyncStorage.getItem('userData');
      if (!storedData) {
        throw new Error('No user data found.');
      }
      const parsedData = JSON.parse(storedData);
      const userId = parsedData.id;
      setPoints(parsedData.pointsCounter);
      
      // Fetch student data
      const fetchPointsLog = `${IP_ADDRESS}/points-logs/student/${userId}`;
      console.log(fetchPointsLog)
      const PointsLogresponse = await axios.get(fetchPointsLog);
      setPointsLog(PointsLogresponse.data ? PointsLogresponse.data : []);
      
      // Fetch student's goals
      const fetchStudentsGoalsUrl = `${IP_ADDRESS}/goals/student/${userId}`;
      const goalsResponse = await axios.get(fetchStudentsGoalsUrl);
      setGoals(goalsResponse.data ? goalsResponse.data : []);


    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    fetchGoalsAndStudentData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchGoalsAndStudentData();
    setRefreshing(false);
  }; 

  const toggleSortOrder = () => {
    const reversedList = [...pointsLog].reverse(); // Create a shallow copy and reverse it
    setPointsLog(reversedList);
  };


  // Function to render the header
  const renderHeader = () => {
    return (
      <View style={styles.headerRow}>
        <Text style={[styles.headerItem, { flex: 1 }]}>Title</Text>
        <Text style={[styles.headerItem, { flex: 3, textAlign: 'center' }]}>Points</Text>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.headerItem}>
          <Text style={[styles.headerItem, { flex: 1 }]}>Date</Text>
          <Ionicons name={sortDescending ? 'arrow-down' : 'arrow-up'} size={15} color="white" />
      </TouchableOpacity>
      </View>
    );
  };

  
  const renderPointsLogItem = ({ item }) => {
    const changeAmount = item.changeAmount;
    const changeText = changeAmount > 0 ? `+${changeAmount}` : `${changeAmount}`;
    const changeTextStyle = changeAmount > 0 ? styles.greenText : styles.redText;
    return (
      <View style={styles.logItemContainer}>
        <Text style={styles.logDescription}>{item.description}</Text>
        <Text style={[styles.logChangeAmount, changeTextStyle]}>
        {changeText}
      </Text>
      <Text style={styles.logDate}>
        {moment(item.date, "MMM DD YYYY").format("MMMM D, YYYY")}
      </Text>
      </View>
    );
  };

  useEffect(() => {
    if (goals.practiceGoalCount + goals.assignmentGoalCount > 0) {
      const newProgress = ((goals.practiceCount + goals.assignmentCount) / (goals.practiceGoalCount + goals.assignmentGoalCount)) * 100;
      setProgress(Math.round(newProgress)); // Round to nearest whole number
    } else {
      setProgress(0); // Reset progress if there are no goals
    }
  }, [goals]);

  const CurrentGoals = ({ completedPractice, completedAssignment, currentPracticeGoalCount, currentAssignmentGoalCount, currentPoints }) => {
    
    return (
      <View style={styles.currentGoalsContainer}>
        <Text style={styles.currentGoalsText}>Your Weekly Goal:</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, {width: `${progress}%`}]} />
          <Text style={styles.progressText}>{progress}% Completed</Text>
        </View>
        <View style={styles.goalsRow}>
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>Practice Goal</Text>
            <Text style={styles.goalValue}>{completedPractice} / {currentPracticeGoalCount}</Text>
          </View>
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>Assignment Goal</Text>
            <Text style={styles.goalValue}>{completedAssignment} / {currentAssignmentGoalCount}</Text>
          </View>
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>Points Allocated</Text>
            <Text style={styles.goalValue}>{currentPoints}</Text>
          </View>
        </View>
      </View>
    );
  };

  const isGoalsSet = !goals.length > 0;

  return (
    <LoadingComponent isLoading={loadingstate}>
      
        <View style={styles.container}>
          <Text style={[theme.textTitle, {marginTop: 50, marginHorizontal: 15}]}>Your Goals</Text>  
          <View style={[styles.balanceContainer, { backgroundColor: '#007AFF', overflow: 'hidden', position: 'relative'}]}>
            <Ionicons name="trophy" size={170} color='#FFFFFF' style={{ position: 'absolute', bottom: 0, right: 0 }} />
            <Text style={styles.balanceText}>Your Points</Text>
            <Text style={styles.pointsIndicator}>{points}</Text>
          </View>

          {isGoalsSet ? (
              <CurrentGoals
                completedPractice={goals.practiceCount}
                completedAssignment={goals.assignmentCount}
                  currentPracticeGoalCount={goals.practiceGoalCount}
                  currentAssignmentGoalCount={goals.assignmentGoalCount}
                  currentPoints={goals.points}
              />
          ) : (
              <Text style={styles.createGoalPrompt}>Aim High, Start your Goals!</Text>
          )}

          <FlatList
            data={pointsLog}
            keyExtractor={item => item.id}
            renderItem={renderPointsLogItem}
            ListHeaderComponent={renderHeader}
            stickyHeaderIndices={[0]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            extraData={[sortDescending, pointsLog]}
          />
          
          
        </View>
      
    </LoadingComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: '#FFD700', // Accent Color
  },
  activeTabText: {
    color: '#FFD700', // Accent Color
  },
  balanceContainer: {
    backgroundColor: '#686BFF', // Primary Color
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 60,
    verticalAlign: 'center',
    
  },
  balanceText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold', // Standardize font weight
  },
  pointsIndicator: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#686BFF', // Primary Color
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20, // Add some space below the tab container
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12, // Ensure tabs are adequately spaced
  },
  tabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#686BFF', // Primary Color
    marginHorizontal: 20,
    borderRadius: 10,
  },
  headerItem: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  logItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    
  },
  logDescription: {
    flex: 2,
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
  },
  logChangeAmount: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
  },
  greenText: {
    color: 'green', // or a specific shade of green you prefer
  },
  redText: {
    color: 'red', // or a specific shade of red you prefer
  },
  logDate: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 2,
  },
  currentGoalsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentGoalsText: {
    fontSize: 16,
    fontWeight: 'bold',
    
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    height: 20,
    margin: 20,
    overflow: 'hidden', // Important to ensure the inner bar does not overflow
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 20, // Rounded corners for the progress bar
    borderColor: 'black',
  },
  progressText: {
    position: 'absolute', // Position text over the bar
    right: 10,
    color: 'black',
  },
});


export default GoalsScreen;



