import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl, FlatList, Dimensions } from 'react-native';
import { useAuth } from '../context/Authcontext';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Adjust this import based on the icon library you use
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import IP_ADDRESS from '../constants/ip_address_temp';
import Modal from 'react-native-modal'; // Import react-native-modal
import theme from '../styles/theme';

const ProfileScreen = ({ navigation, route }) => {

  const { signOut, state, dispatch } = useAuth();
  const { expoPushToken } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userInstrument, setUserInstrument] = useState(''); 
  const [userPoints, setUserPoints] = useState(0);
  const [userRole,  setUserRole] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ownedAvatars, setOwnedAvatars] = useState([]);
  const [ownedFrames, setOwnedFrames] = useState([]);
  const [ownedBadges, setOwnedBadges] = useState([]); 
  
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('');
  
  // Fetch inventory data
  const fetchInventoryData = async (userId) => {
    try {
      const response = await axios.get(`${IP_ADDRESS}/student-inventory/${userId}`, state.authHeader);
      setOwnedAvatars(response.data.ownedAvatarList);
      setOwnedFrames(response.data.ownedFrameList);
      setOwnedBadges(response.data.ownedBadgeList);
    } catch (error) {
      console.error('profilepage.js line 38, Error fetching inventory:', error);
    }
  };

  const loadData = async () => {
    setRefreshing(true);
    setIsLoading(true);
    try {
      setUserName(state.userData.name);
      setUserEmail(state.userData.email);
      setUserId(state.userData.id);
      setUserRole(state.userData.role);
      setSelectedAvatar(state.userData.avatar);
      setSelectedFrame(state.userData.avatarFrame);
      setUserInstrument(state.userData.instrument); 
      setUserPoints(state.userData.pointsCounter);

      if (state.userData.role === 'Student') {
        await fetchInventoryData(state.userData.id);
      }
    } catch (error) {
      console.error('profilepage.js line 94, Error processing stored data:', error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  

  // Handle the sign-out process
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(userId, expoPushToken);
      //await signOut();
    } catch (error) {
      console.error('profilepage.js line 150, Error signing out', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Component for statistics cards

  const StatsCard = ({ value, label }) => (
    <View style={styles.statCard}>
      <Image 
        source={require('../assets/currency.png')} 
        style={[theme.currencyImage, styles.statIcon]}
      />
      <View style={styles.statDetails}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
  
  const onEditPress = () => {
    setIsModalVisible(true);
      if (ownedAvatars.length === 0 && ownedFrames.length === 0) {
        fetchInventoryData(state.userData.id);
      }
  };

  const fetchLatestUserData = async () => {
    setIsLoading(true); // Show loading indicator during data fetch
    var userData;
    try {
      if (state.userData.role === 'Student') {
        const response = await axios.get(`${IP_ADDRESS}/students/${userId}`, state.authHeader);
        userData = response.data;
      } else if (state.userData.role === 'Teacher') {
        const response = await axios.get(`${IP_ADDRESS}/teachers/${userId}`, state.authHeader);
        userData = response.data;
      }
      setUserName(userData.name);
      setUserEmail(userData.email);
      setUserRole(userData.role);
      setUserInstrument(userData.instrument);
      if (state.userData.role === 'Student') {
        setSelectedAvatar(userData.avatar);
        setSelectedFrame(userData.avatarFrame);
        setUserPoints(userData.pointsCounter);
        fetchInventoryData(userData.id);
      }
      dispatch({ type: 'UPDATE_USER_DATA', payload: { userData } }) 
    } catch (error) {
      console.error('profilepage.js line 197, Error fetching latest user data:', error);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const updateStudentAvatarAndFrame = async () => {
    setIsLoading(true);

    try {
      if (selectedAvatar) {
        const response = await axios.put(`${IP_ADDRESS}/students/${userId}/update-avatar?avatar=${selectedAvatar}`, {}, state.authHeader);
        console.log("profile page line 139 Upadting avatar response: ", response.data)
      }

      if (selectedFrame) {
        await axios.put(`${IP_ADDRESS}/students/${userId}/update-avatar-frame?avatarFrame=${selectedFrame}`, {}, state.authHeader);

      }
      await fetchLatestUserData();
      
    } catch (error) {
      console.error('profilepage.js line 148, Error updating profile:', error);
      alert('profilepage.js line 149 An error occurred while updating your profile. Please try again.');
    } finally {
      setIsLoading(false); 
      setIsModalVisible(false); 
    }
  };

  const InventoryModal = () => {
    const [selectedTab, setSelectedTab] = useState('avatars'); // 'avatars' or 'frames'
    
    const renderAvatarItem = ({ item, index }) => (
      <TouchableOpacity
        key={index}
        style={styles.itemOption}
        onPress={() => onAvatarSelect(item)}
      >
        <Image source={{ uri: item }} style={styles.itemImage} />
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
        <Image source={{ uri: item }} style={styles.itemImage} />
      </TouchableOpacity>
    );

    // Function to handle removing the avatar
      const onRemoveAvatar = () => {
        setSelectedAvatar(''); 
      };

      // Function to handle removing the frame
      const onRemoveFrame = () => {
        setSelectedFrame(''); 
      };

      const onAvatarSelect = (item) => {
        setSelectedAvatar(item); 
      };
      
      const onFrameSelect = (item) => {
        setSelectedFrame(item); 
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
    }
    catch (error) {
      console.error('profilepage.js line 325, Error fetching latest user data:', error);
    }
    setRefreshing(false);
  };

  const makeBadgeObject = (badgeUriList) => {
    let badgeObjectArr = [];
    for (let i = 0; i < badgeUriList.length; i++){
      var singleBadgeObject = {}
      singleBadgeObject["id"] = i;
      singleBadgeObject["uri"] = badgeUriList[i];
      badgeObjectArr.push(singleBadgeObject);
    }

    return badgeObjectArr;
  }

  const renderBadge = ({ item }) => (
    <Image
      source={{ uri: item.uri }}
      style={styles.badgeImage}
    />
  );


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
                source={selectedAvatar ? { uri: selectedAvatar } : require('../assets/favicon.png')}
              />
              {selectedFrame ? (
                <Image
                  style={styles.frame}
                  source={{ uri: selectedFrame }}
                />
              ) : null}
              <Icon name="edit" size={24} color="white" style={styles.editIcon} />
            </TouchableOpacity>
          ) : (
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={selectedAvatar ? { uri: selectedAvatar } : require('../assets/favicon.png')}
              />
            </View>
          )}
          <Text style={styles.username}>{userName}</Text>
          <Text style={styles.joinDate}>{userEmail}</Text>
          <Text style={styles.joinDate}>{userInstrument}</Text>
          
        </View>

        {userRole !== 'Teacher' && (
          <>
            <View style={styles.statsContainer}>
              {/* Render stats using StatsCard component */}
              <StatsCard iconName="star" value={userPoints} label="Points" />

            </View>
            <View style={styles.badgesContainer}>
              <Text style={styles.sectionTitle}> Your Badges</Text>
              <View style={styles.badgesContainer}>
                <FlatList
                  data={makeBadgeObject(ownedBadges)}
                  renderItem={renderBadge}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={true}
                />
              </View>
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
      paddingHorizontal: 20
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
    justifyContent: 'flex-start',
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
    width: '100%', // Ensure the badges container takes the full width
    alignItems: 'center', // Center badges horizontally
    justifyContent: 'center', // Center badges vertically
    paddingHorizontal: 0,
    marginVertical: 10 // Match horizontal padding with other content
  },
  badgeImage: {
    width: (Dimensions.get('window').width)/3, // full width of screen for each image
    height: (Dimensions.get('window').width)/3, // specify a height for images
    resizeMode: 'cover', // or 'contain' based on what you need
  },
});


export default ProfileScreen;
