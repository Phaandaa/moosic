import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockData = [
  { id: '1', description: 'You have earned', points: '+78 Points', date: '10 May 2022' },
  { id: '2', description: 'You have redeemed', points: '-25 Points', date: '08 May 2022' },
  // Add more mock data here
];

const GoalsScreen = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Function to filter data based on the active tab
  const filteredData = mockData.filter((item) => {
    if (activeTab === 'all') return true;
    return activeTab === 'earned' ? item.points.startsWith('+') : item.points.startsWith('-');
  });

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={item.points.startsWith('+') ? styles.itemPointsEarned : styles.itemPointsRedeemed}>
        {item.points}
      </Text>
      <Text style={styles.itemDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <View style={[styles.balanceContainer, { backgroundColor: '#007AFF', overflow: 'hidden', position: 'relative'}]}>
      
        <Ionicons
          name="trophy"
          size={170}
          color='#FFFFFF'
          style={{ position: 'absolute', bottom: 0, right: 0 }}
        />
      
        <Text style={styles.balanceText}>Your Points</Text>
        <Text style={styles.points}>428 Points</Text>
        
      </View>
      <View style={styles.tabContainer}>
        {['All', 'Earned', 'Redeemed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab.toLowerCase() && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.toLowerCase())}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.toLowerCase() && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
    
  },
  balanceText: {
    color: 'white',
    fontSize: 16,
    
  },
  points: {
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
});

export default GoalsScreen;



