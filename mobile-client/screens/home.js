import React, { useState, useEffect, useRef  } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions,Image, ScrollView } from 'react-native';
import BoxComponent from '../components/ui/homepageModuleBoxes';
import CurrentGoals from '../components/ui/CurrentGoals';
import theme from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import IP_ADDRESS from '../constants/ip_address_temp';
import Colors from '../constants/colors';
import { useAuth } from '../context/Authcontext';

const { width } = Dimensions.get('window');


const HomeScreen = ({ navigation }) => {
  const { state } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [loadingstate, setLoadingState] = useState(false);
  const [userToken, setUserToken] = useState('');
  

  const flatListRef = useRef();

  const bannerImages = [
    require('../assets/homepage-banners/cowbanner.png'),
    require('../assets/homepage-banners/notebanner.png'),
    require('../assets/homepage-banners/treblecleffbanner.png'),
  ];

  const renderItem = ({ item }) => (
    <Image source={item} style={{ width, height: 200 }} resizeMode="cover" />
  );
  
  const hasUnread = (notifications) => {
    return notifications.some(notification => notification.readStatus === 'unread');
  } 
  

  const teacherModules = [
    { id: 'assignment', color: Colors.blue, title: 'Assignment', subtitle: 'Create an assignment', iconName: 'musical-notes', navigationPage: 'CreateAssignmentScreen', iconColor: 'white', buttonText: 'Create' },
    { id: 'students', color: Colors.green, title: 'View My Students', subtitle: 'My students', iconName: 'people', navigationPage: 'MyStudentsScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'setGoals', color: Colors.red, title: 'Set Goals', subtitle: 'Set goals for students', iconName: 'golf', navigationPage: 'ViewCreatedGoalsForStudents', iconColor: 'white', buttonText: 'Create' },
    // Add more modules specific to teacher
  ];

  const studentModules = [
    // { id: 'practice', color: '#EE97BC', title: 'Practice', subtitle: 'Record My Practice Sessions', iconName: 'musical-notes', navigationPage: 'CreatePracticeScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'assignments', color: Colors.turquoise, title: 'Assignments', subtitle: 'View My Assignments', iconName: 'documents', navigationPage: 'AssignmentListScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'practicelog', color: Colors.babyPurple, title: 'Practice Log', subtitle: 'View My Practice Sessions', iconName: 'musical-notes', navigationPage: 'PracticeListStudentScreen', iconColor: 'white', buttonText: 'View' },
 
  ];

  const modules = state.userData.role === 'Teacher' ? teacherModules : studentModules;

  const Header = () => (
    <View style={styles.headerContainer}>
      <Image 
        source={require('../assets/learn2playlogo.png')} 
        style={styles.logoStyle}
      />
      <TouchableOpacity 
        style={styles.notificationButton} 
        onPress={() => navigation.navigate('Notifications')}>
        <Ionicons name="notifications-outline" size={30} color="black" />
        {hasUnread(state.notifications) && <View style={[theme.notificationDot, { right: 12, top: 12 }]} />}
        
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => {
    return (
      <>
        <Text style={[theme.textTitle]}> Welcome, {state.userData.name.split(" ")[0]}! </Text>
        {state.userData.role === 'Student' && (
          <>
            <Text style={[theme.textSubtitle, { marginBottom: 10 }]}>
              Your current points: {state.userData.pointsCounter ? state.userData.pointsCounter : 0}
            </Text>
          </>
        )}
        {/* Display Images */}
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={bannerImages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={true}
          />
        </View>
        {state.userData.role === 'Student' && (
            <CurrentGoals isStudent={true} studentId={state.userData.id} />
        )}
      </>
    );
  };
  

  const ITEM_HEIGHT = 200; // Example height, adjust as needed

  return (
    <><Header /><FlatList
      ListHeaderComponent={renderHeader}
      style={[theme.container, { height: '100%', marginBottom:0 }]}
      contentContainerStyle={{ paddingBottom: 50 }} 
      data={searchResults.length > 0 ? searchResults : modules}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <BoxComponent
          style={styles.modulesComponent}
          color={item.color}
          title={item.title}
          subtitle={item.subtitle}
          iconName={item.iconName}
          navigation={navigation}
          navigationPage={item.navigationPage}
          iconColor={item.iconColor}
          buttonText={item.buttonText}
          id={item.id} />
      )}
      numColumns={2} // Adjust based on your content
    /></>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
    height: 100, // You can adjust this height as needed
  },
  logoStyle: {
    height: "70%", // Set a fixed height for your logo
    resizeMode: 'contain',
    flex: 1, // If you want the logo to scale with the container
    width: undefined, // Necessary when using flex in combination with resizeMode: 'contain'
  },
  notificationButton: {
    // Define styles for the notification button if needed
    padding: 10, // Padding for touch area
    
  },
  searchBar: {
    // Assuming HomepageSearchBar accepts a style prop to adjust its styling
    flex: 1,
    marginRight: 10, // Give some space between search bar and time
  },
  timeText: {
    fontSize: 16,
  },
  headerText: {
    marginTop: 10, // Space from the logo
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Adjust the color to match the design
    textAlign: 'center', // Center the text
  },
  boxContainer: {
    
    width: width * 0.8, // Each item will take up 80% of the screen width, adjust as needed
    marginRight: width * 0.05, // Spacing between items, adjust as needed
    height: 200, // Adjust the height as needed
    verticalAlign: 'center',
    // If your BoxComponent has its own padding or margins adjust this accordingly
  },
  imageContainer: {
    width: width, // full width of the screen
    height: 200, // the height of the carousel
    justifyContent: 'center',
    alignItems: 'center', // center the image within the container
  },
  bannerImage: {
    // height will be less than or equal to 200 to maintain aspect ratio
    // width will scale accordingly
    height: '100%',
    borderRadius: 15,
    resizeMode: 'cover', // the image will be scaled to fit within the view
    aspectRatio: 1.9, // aspect ratio of the image
    marginRight: 30, // space between images
  },
});