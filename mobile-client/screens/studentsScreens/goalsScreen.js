import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import axios from 'axios';
import GoalItem from '../../components/ui/goalItem';



const GoalsScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [goals, setGoals] = useState([]);
  const [studentData, setStudentData] = useState({ pointsCounter: 0 });
  const [fetchError, setFetchError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  
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
          const fetchStudentsGoalsUrl = `${IP_ADDRESS}/goals/student/ongoing/${userId}`;
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
    


  // Function to filter data based on the active tab
  const filteredData = goals.filter((item) => {
    if (activeTab === 'all') return true;
    return activeTab === 'in progress' ? item.status == "Not done" : item.status == "Done";
  });
  

  // Function to render the header
  const renderHeader = () => {
    // Check if there are actual goals (not just the 'empty' placeholder)
    if (filteredData.length === 0 || (filteredData.length === 1 && filteredData[0] === 'empty')) {
      return null;
    }
  
    return (
      <View style={styles.headerRow}>
        <Text style={[styles.headerItem, { flex: 2 }]}>Title</Text>
        <Text style={[styles.headerItem, { flex: 1 }]}>Points</Text>
        <Text style={[styles.headerItem, { flex: 1 }]}>Status</Text>
      </View>
    );
  };
  
  

  return (
    <View style={styles.container}>
    <View style={[styles.balanceContainer, { backgroundColor: '#007AFF', overflow: 'hidden', position: 'relative'}]}>
      <Ionicons name="trophy" size={170} color='#FFFFFF' style={{ position: 'absolute', bottom: 0, right: 0 }} />
      <Text style={styles.balanceText}>Your Points</Text>
      <Text style={styles.pointsIndicator}>{studentData.pointsCounter}</Text>
    </View>
    <View style={styles.tabContainer}>
      {['All', 'In Progress', 'Completed'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab.toLowerCase() && styles.activeTab]}
          onPress={() => setActiveTab(tab.toLowerCase())}>
          <Text style={[styles.tabText, activeTab === tab.toLowerCase() && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
    <FlatList
      data={filteredData.length > 0 ? filteredData : ['empty']}
      renderItem={({ item }) => <GoalItem item={item} />}
      keyExtractor={item => item.id || 'empty'}
      ListHeaderComponent={renderHeader()}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 24,
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: '#FFD700', // Gold color for the active tab underline
  },
  activeTabText: {
    color: '#FFD700', // Gold color for the active tab text
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  balanceContainer: {
    backgroundColor: '#686BFF',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 40,
    paddingHorizontal: 20,
    paddingVertical: 60,
    height: 200,
    
  },
  balanceText: {
    color: 'white',
    fontSize: 20,
    
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
    backgroundColor: '#686BFF',
    paddingVertical: 1,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  tab: {
    padding: 8,
  },
  tabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E7E7E7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDescription: {
    fontSize: 16,
  },
  itemPointsEarned: {
    color: '#4CAF50', // Green color for earned points
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPointsRedeemed: {
    color: '#F44336', // Red color for redeemed points
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDate: {
    color: '#757575', // Grey color for the date
    fontSize: 14,
  },
  itemPoints: {
    color: '#4CAF50', // Or any other color you prefer
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemStatus: {
    color: '#757575', // Or any other color you prefer
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#686BFF',
    marginTop: 24,
    marginHorizontal: 20,
  },
  headerItem: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  // Assuming these are the styles applied to cells in GoalItem
  title: {
    flex: 2, // Adjust according to your layout
    textAlign: 'left', // Ensure text alignment matches GoalItem
  },
  points: {
    flex: 1, // Adjust according to your layout
    textAlign: 'center', // Ensure text alignment matches GoalItem
  },
  status: {
    flex: 1, // Adjust according to your layout
    textAlign: 'right', // Ensure text alignment matches GoalItem
  },
  
  
});

export default GoalsScreen;



