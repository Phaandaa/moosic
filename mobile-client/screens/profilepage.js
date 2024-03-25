import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../context/Authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Adjust this import based on the icon library you use
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import IP_ADDRESS from '../constants/ip_address_temp';
import Modal from 'react-native-modal'; // Import react-native-modal

const ProfileScreen = ({ navigation, route }) => {

  const { signOut } = useAuth();
  const { expoPushToken } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userInstrument, setUserInstrument] = useState(''); // Assuming the user's instrument is stored in the user data
  const [userPoints, setUserPoints] = useState(0);
  const [userRole,  setUserRole] = useState(''); // Assuming the user's role is stored in the user data
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState('');
  const [avatar, setAvatar] = useState('');
  const [frame, setFrame] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ownedAvatars, setOwnedAvatars] = useState([]);
  const [ownedFrames, setOwnedFrames] = useState([]);
  const [ownedBadges, setOwnedBadges] = useState([]); // Assuming badges are fetched from the API
  
  const [selectedAvatarId, setSelectedAvatarId] = useState('');
  const [selectedFrameId, setSelectedFrameId] = useState('');

  
  

  // Fetch inventory data
  const fetchInventoryData = async (userId) => {
    try {
      // Fetch avatars
      const avatarResponse = await axios.get(`${IP_ADDRESS}/student-inventory/${userId}/avatar-details`);
      setOwnedAvatars(avatarResponse.data);

      // Fetch frames
      const frameResponse = await axios.get(`${IP_ADDRESS}/student-inventory/${userId}/frame-details`);
      setOwnedFrames(frameResponse.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const loadData = async () => {
    setRefreshing(true);
    setIsLoading(true);
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (!storedData) throw new Error("No stored user data found");
      
      const userData = JSON.parse(storedData);
      setUserName(userData.name);
      setUserEmail(userData.email);
      setUserId(userData.id);
      setUserRole(userData.role);
      setSelectedAvatarId(userData.avatar);
      setSelectedFrameId(userData.avatarFrame);
      setUserInstrument(userData.instrument); 
      setUserPoints(userData.pointsCounter);

      if (userData.role !== 'Teacher') {
        await fetchInventoryData(userData.id);
        // can add renderBadges() here instead in useEffect
      }
    } catch (error) {
      console.error('Error processing stored data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  const loadAvatarAndFrame = async () => {
    if (!selectedAvatarId || !selectedFrameId) return; // Only proceed if both IDs are available
    
    setIsLoading(true);
    try {
      const [avatarResponse, frameResponse] = await Promise.all([
        axios.get(`${IP_ADDRESS}/reward-shop/${selectedAvatarId}`),
        axios.get(`${IP_ADDRESS}/reward-shop/${selectedFrameId}`),
      ]);

      setAvatar(avatarResponse.data.imageLink);
      setFrame(frameResponse.data.imageLink);
    } catch (error) {
      console.error('Error fetching avatar or frame data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    loadAvatarAndFrame();
    renderBadges();
  }, [selectedAvatarId, selectedFrameId]);
  

  // Handle the sign-out process
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      console.log(userId);
      await signOut(userId, expoPushToken);
    } catch (error) {
      console.error('Error signing out', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Component for statistics cards

  const StatsCard = ({ iconName, value, label }) => (
    <View style={styles.statCard}>
      <Icon name={iconName} size={24} color="#FFA500" style={styles.statIcon} />
      <View style={styles.statDetails}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
  
  const onEditPress = () => {
    setIsModalVisible(true);
      if (ownedAvatars.length === 0 && ownedFrames.length === 0) {
        fetchInventoryData(userId); // Assuming fetchInventoryData will handle setting state
      }
  };

  const fetchLatestUserData = async () => {
    setIsLoading(true); // Show loading indicator during data fetch
    try {
      const response = await axios.get(`${IP_ADDRESS}/students/${userId}`);
      const userData = response.data;
      // Update the state with the latest fetched data
      setUserName(userData.name);
      setUserEmail(userData.email);
      setUserRole(userData.role);
      setSelectedAvatarId(userData.avatar);
      setSelectedFrameId(userData.avatarFrame);
      setUserInstrument(userData.instrument);
      setUserPoints(userData.pointsCounter);
      // Optionally, update the local storage if caching user data
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      loadAvatarAndFrame(); 
      renderBadges();
    } catch (error) {
      console.error('Error fetching latest user data:', error);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const updateStudentAvatarAndFrame = async () => {
    setIsLoading(true); // Indicate loading
    console.log('selectedAvatarId', selectedAvatarId)
    console.log('selectedFrameId', selectedFrameId)
    console.log('userId', userId)

    try {
      // Update Avatar if selected
      if (selectedAvatarId) {
        await axios.put(`${IP_ADDRESS}/students/${userId}/update-avatar?avatar=${selectedAvatarId}`);
      }
  
      // Update Frame if selected
      if (selectedFrameId) {
        await axios.put(`${IP_ADDRESS}/students/${userId}/update-avatar-frame?avatarFrame=${selectedFrameId}`);

      }


      await fetchLatestUserData();
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile. Please try again.');
    } finally {
      setIsLoading(false); // Hide loading indicator
      setIsModalVisible(false); // Optionally close modal
    }
  };

  const renderBadges = async() => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${IP_ADDRESS}/student-inventory/${userId}/badge-details`);
      setOwnedBadges(response.data);
      console.log(ownedBadges);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  }

  const InventoryModal = () => {
    const [selectedTab, setSelectedTab] = useState('avatars'); // 'avatars' or 'frames'
    
    const renderAvatarItem = ({ item, index }) => (
      <TouchableOpacity
        key={index}
        style={styles.itemOption}
        onPress={() => onAvatarSelect(item)}
      >
        <Image source={{ uri: item.imageLink }} style={styles.itemImage} />
      </TouchableOpacity>
    );
  
    const renderFrameItem = ({ item, index }) => (
      <TouchableOpacity
        key={index}
        style={styles.itemOption}
        onPress={() => {
          onFrameSelect(item);
        }}
      >
        <Image source={{ uri: item.imageLink }} style={styles.itemImage} />
      </TouchableOpacity>
    );

    // Function to handle removing the avatar
      const onRemoveAvatar = () => {
        setAvatar(''); // Reset avatar to default
        setSelectedAvatarId(''); // Clear selected avatar ID
        
      };

      // Function to handle removing the frame
      const onRemoveFrame = () => {
        setFrame(''); // Reset frame to default
        setSelectedFrameId(''); // Clear selected frame ID
        
      };

      const onAvatarSelect = (item) => {
        setAvatar(item.imageLink); // Update avatar preview
        AsyncStorage.setItem('avatar', item.imageLink);
        setSelectedAvatarId(item.id); // Store selected avatar ID
      };
      
      const onFrameSelect = (item) => {
        setFrame(item.imageLink); // Update frame preview
        AsyncStorage.setItem('avatarFrame', item.imageLink);
        setSelectedFrameId(item.id); // Store selected frame ID
      };
      

      const renderRemoveOption = (type) => (
        <TouchableOpacity
          style={styles.itemOption}
          onPress={type === 'avatars' ? onRemoveAvatar : onRemoveFrame}
        >
          <View style={styles.removeOptionContainer}>
            <Ionicons name="trash" size={24} color="#FF0000" />
            <Text style={styles.removeText}>Remove {type === 'avatars' ? 'Avatar' : 'Frame'}</Text>
          </View>
        </TouchableOpacity>
      );
      
      
    return (
      <Modal
      isVisible={isModalVisible} // Use isVisible prop for visibility
      onBackdropPress={() => setIsModalVisible(false)} // Close modal on backdrop press
      onSwipeComplete={() => setIsModalVisible(false)} // Optional: close modal on swipe
      style={styles.modalOverlay} // Apply custom styles as needed
        
      >
        
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
            <TouchableOpacity
                style={[styles.tab, selectedTab === 'avatars' && styles.selectedTab]}
                onPress={() => setSelectedTab('avatars')}
              >
                <Text style={styles.tabText}>Avatars</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'frames' && styles.selectedTab]}
                onPress={() => setSelectedTab('frames')}
              >
                <Text style={styles.tabText}>Frames</Text>
              </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={[styles.itemsContainer, { flexGrow: 1 }]} >

                {renderRemoveOption(selectedTab)}
                {selectedTab === 'avatars' && ownedAvatars.map((item, index) => renderAvatarItem({ item, index }))}
                {selectedTab === 'frames' && ownedFrames.map((item, index) => renderFrameItem({ item, index }))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                console.log('Done pressed'); // Debugging line to ensure the function is triggered
                setIsModalVisible(false);
                updateStudentAvatarAndFrame();
              }}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
        </View>
      
    </Modal>
    );

  };



  const onRefresh = async () => {
    setRefreshing(true);
    try{
      await fetchLatestUserData(); 
      console.log(avatar, frame)
    }
    catch (error) {
      console.error('Error fetching latest user data:', error);
    }
    // Directly call fetchLatestUserData to update state
    setRefreshing(false);
  };


  return (
    <SafeAreaView style={styles.safeArea} >
      <ScrollView contentContainerStyle={styles.container} 
      refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.header}>
          {userRole !== 'Teacher' ? (
            <TouchableOpacity style={styles.avatarContainer} onPress={onEditPress}>
              <Image
                style={styles.avatar}
                source={avatar ? { uri: avatar } : require('../assets/favicon.png')}
              />
              {frame ? (
                <Image
                  style={styles.frame}
                  source={{ uri: frame }}
                />
              ) : null}
              <Icon name="edit" size={24} color="white" style={styles.editIcon} />
            </TouchableOpacity>
          ) : (
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={avatar ? { uri: avatar } : require('../assets/favicon.png')}
              />
            </View>
          )}
          <Text style={styles.username}>{userName}</Text>
          <Text style={styles.joinDate}>{userEmail}</Text>
          <Text style={styles.joinDate}>{userInstrument}</Text>
          
        </View>

        {userRole !== 'Teacher' && (
        <><View style={styles.statsContainer}>
            {/* Render stats using StatsCard component */}
            <StatsCard iconName="local-fire-department" value="2" label="Day Streak" />
            <StatsCard iconName="star" value={userPoints} label="Points" />
            <StatsCard iconName="emoji-events" value="5" label="Total crowns" />
            <StatsCard iconName="military-tech" value="Bronze" label="League" />

          </View>
          <View style={styles.badgesContainer}>
            <Text style={styles.sectionTitle}> Your Badges</Text>
            
            </View>
            </>
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleSignOut}>
          <Text style={styles.addButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <InventoryModal />
    </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: '#fff',
  },
  container: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 20,
  },
  header: {
      marginTop: 60, // This should be adjusted based on your layout and SafeAreaView
      alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative', // This enables absolute positioning for children
    width: 80, // Set the desired size
    height: 80,
    borderRadius: 40, // Half the width/height to make it circular
   marginVertical: 20,
   justifyContent: 'center',
   alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40, // Half the width/height to make it circular
  },
  editIcon: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    backgroundColor: '#007bff',
    width: 40, // Adjust as necessary
    height: 40, // Adjust as necessary
    borderRadius: 20, // Make sure this is half of the width/height
    overflow: 'hidden', // Hide any overflow
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
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
    marginTop: 20,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  frame: {
    position: 'absolute',
    width: 110, // The frame should be larger than the avatar to fit around it
    height: 110,
    resizeMode: 'contain',
    // Adjust these if needed to align the frame with the avatar
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    height: '50%', // Adjust this to control how much of the screen the modal covers
    borderTopLeftRadius: 20, // Round the top corners
    borderTopRightRadius: 20,
    shadowColor: '#000', // Optional, for shadow on modal
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20, // Ensure there's padding at the bottom for scrollable content
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%', // Adjust this to control the modal height
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 16,
    paddingTop: 10,
  },
  modalCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemOption: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10, // adjust the margin as needed
    width: '25%', // this should match the size of your avatars/frames
    width: '25%', // this should match the size of your avatars/frames
    aspectRatio: 1, // ensure the items are square
  },
  itemImage: {
    width: 80,
    height: 80,
    
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  selectedTab: {
    borderColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'grey',
  },
  removeOption: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  removeText: {
    fontSize: 16,
    color: '#FF0000', // Red color to indicate a remove action
    textDecorationLine: 'underline',
  },
  removeOptionContainer: {
    width: 80, // set this to match the width of your avatars/frames
    height: 80, // set this to match the height of your avatars/frames
    margin: 10, 
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10, // adjust if your items are rounded
    backgroundColor: '#f9f9f9',
    marginBottom: 20,

  },
  removeText: {
    fontSize: 14, // adjust as needed to fit the text inside the square
    color: '#FF0000',
    textAlign: 'center', // ensure text is centered
    // You might need to adjust the padding or margins if the text doesn't fit well
  },
  badgesContainer: {

  },
});


export default ProfileScreen;
