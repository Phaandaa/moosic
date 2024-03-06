import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import GoalItem from '../../components/ui/goalItem';
import LoadingComponent from '../../components/ui/LoadingComponent';
import IP_ADDRESS from '../../constants/ip_address_temp';

const GoalsScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [goals, setGoals] = useState([]);
  const [studentData, setStudentData] = useState({ pointsCounter: 0 });
  const [loadingstate, setLoadingState] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch goals and student data
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
      const fetchStudentDataUrl = `${IP_ADDRESS}/students/${userId}`;
      const studentResponse = await axios.get(fetchStudentDataUrl);
      setStudentData(studentResponse.data ? studentResponse.data : { pointsCounter: 0 });
      
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

  // Function to filter data based on the active tab
  const filteredData = goals.filter((item) => {
    if (activeTab === 'all') return true;
    return activeTab === 'in progress' ? item.status === "Not done" : item.status === "Done";
  });

  // Function to render the header
  const renderHeader = () => {
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
    <LoadingComponent isLoading={loadingstate}>
      
        <View style={styles.container}>
          <Text style={[theme.textTitle, {marginTop: 50, marginHorizontal: 15}]}>Your Goals</Text>  
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
});


export default GoalsScreen;



