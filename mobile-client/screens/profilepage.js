import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '../context/Authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Adjust this import based on the icon library you use
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {

  const {signOut} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setuserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const onEditPress = () => {
    // Placeholder for navigation or edit function.
    // Replace this with your own code to handle the edit press event.
    console.log('Edit icon pressed');
    // If using React Navigation you might call `navigation.navigate('EditProfile')`
};

  const checkStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('authData');
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        return parsedData;
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage', error);
    }
    return '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkStoredData();
        setuserName(data.name);
        setUserEmail(data.email);
      } catch (error) {
        console.error('Error processing stored data', error);
      }
    };
    fetchData();
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out', error);
    } finally {
      setIsLoading(false);
    }
  }

  const StatsCard = ({ iconName, value, label }) => {
    return (
      <View style={styles.statCard}>
        <Icon name={iconName} size={24} color="#FFA500" style={styles.statIcon} />
        <View style={styles.statDetails}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <View style={styles.header}>
          <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={require('../assets/favicon.png')} // Replace with your local image
              />
              <TouchableOpacity style={styles.editIcon} onPress={onEditPress}>
                <Ionicons name="pencil" size={20} color="white" />
              </TouchableOpacity>
          </View>
            
              <Text style={styles.username}>{userName}</Text>
            <Text style={styles.joinDate}>{userEmail}</Text>
            <Text style={styles.joinDate}>Joined March 2024</Text>
          </View>

        
          <Text style={styles.headerText}>Statistics</Text>
            <View style={styles.statsContainer}>
              <StatsCard iconName="local-fire-department" value="2" label="Day streak" />
              <StatsCard iconName="star" value="268" label="Total XP" />
              <StatsCard iconName="emoji-events" value="5" label="Total crowns" />
              <StatsCard iconName="military-tech" value="Bronze" label="League" />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleSignOut}>
              <Text style={styles.addButtonText}>Log Out</Text>
            </TouchableOpacity>
      </View>

      
      
    </SafeAreaView>
  
  );
};

const styles = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: '#fff',
  },
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 20,
  },
  header: {
      marginTop: 60, // This should be adjusted based on your layout and SafeAreaView
      alignItems: 'center',
  },
  headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 30,
      textAlign: 'left',
  },
  avatarContainer: {
    position: 'relative', // This enables absolute positioning for children
    width: 80, // Set the desired size
    height: 80,
    borderRadius: 50, // Half the width/height to make it circular
   marginVertical: 20,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  editIcon: {
    position: 'absolute', // Position the edit button absolutely so it can be placed in relation to the corner of the avatar
    justifyContent: 'center',
    right: -20, // Adjust these values as needed to place the icon correctly over the avatar image
    bottom: -20,
    backgroundColor: 'white', // Match the background with your design
    borderRadius: 50, // Make the background circle
    padding: 10, // Space between icon and border
    backgroundColor: '#007bff',
    
  },
  username: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 10,
  },
  joinDate: {
      fontSize: 16,
      color: 'gray',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  statCard: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    minWidth: '40%', // ensure two stats fit within the same row
  },
  statIcon: {
    marginRight: 10,
  },
  statDetails: {
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 16,
    color: 'gray',
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default ProfileScreen;
