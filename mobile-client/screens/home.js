import React, { useState, useEffect, useRef  } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions,Image, ScrollView } from 'react-native';
import BoxComponent from '../components/ui/homepageModuleBoxes';
import theme from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import IP_ADDRESS from '../constants/ip_address_temp';
import Colors from '../constants/colors';

const { width } = Dimensions.get('window');


const HomeScreen = ({ navigation }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [user, setUser] = useState({}); 
  const [goals, setGoals] = useState([]);
  const [loadingstate, setLoadingState] = useState(false);
  const [progress, setProgress] = useState(0);

  const [progressbar, setProgressBar] = useState(0);

  const flatListRef = useRef();
  const intervalId = useRef(null);

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

  const checkStoredUserData = async () => {
    try {
      setLoadingState(true);
      const storedData = await AsyncStorage.getItem('userData');
      if (!storedData) {
        throw new Error('No user data found.');
      }
      const userData = JSON.parse(storedData);
      setUser(userData); // Set user with userData including points
      
      // Fetch student's goals
      const fetchStudentsGoalsUrl = `${IP_ADDRESS}/goals/student/${userData.id}`;
      const goalsResponse = await axios.get(fetchStudentsGoalsUrl);
      setGoals(goalsResponse.data ? goalsResponse.data : []);
      console.log(goals)

    } catch (error) {
      console.error('Error retrieving data from AsyncStorage', error);
    } finally {
      setLoadingState(false);
    }
  };

   const bannerImages = [
    require('../assets/homepage-banners/cowbanner.png'),
    require('../assets/homepage-banners/notebanner.png'),
    require('../assets/homepage-banners/treblecleffbanner.png'),
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authData = await checkStoredData();
        setUserRole(authData.role);
        await checkStoredUserData(); // This now correctly sets user state
      } catch (error) {
        console.error('Error processing stored data', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const changeBanner = () => {
      if (flatListRef.current) {
        const currentIndex = Math.round(progress / width);
        const nextIndex = (currentIndex + 1) % bannerImages.length; // Using bannerImages.length directly
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    };

    intervalId.current = setInterval(changeBanner, 3000);

    return () => clearInterval(intervalId.current); // Clear interval on unmount
  }, [progress, bannerImages.length]); 
  
  useEffect(() => {
    const totalGoals = goals.practiceGoalCount + goals.assignmentGoalCount;
    const completedGoals = goals.practiceCount + goals.assignmentCount;
    const newProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    setProgressBar(Math.round(newProgress));
  }, [goals]);

  

  const CurrentGoals = ({ completedPractice, completedAssignment, currentPracticeGoalCount, currentAssignmentGoalCount, currentPoints }) => {
    
    return (
      <View style={styles.currentGoalsContainer}>
        <Text style={styles.currentGoalsText}>Goals At a Glance</Text>
        
        <View style={styles.goalsRow}>
          <View style={[styles.goalCard, {backgroundColor: Colors.green}]}>
            <Text style={styles.goalLabel}>Practices Completed</Text>
            <Text style={styles.goalValue}>{completedPractice} / {currentPracticeGoalCount}</Text>
          </View>
          <View style={[styles.goalCard, {backgroundColor:  Colors.orange}]}>
            <Text style={styles.goalLabel}>Assignment Completed</Text>
            <Text style={styles.goalValue}>{completedAssignment} / {currentAssignmentGoalCount}</Text>
          </View>
          <View style={[styles.goalCard, {backgroundColor:  Colors.pink}]}>
            <Text style={styles.goalLabel}>Points Upon Completion</Text>
            <Text style={styles.goalValue}>{currentPoints}</Text>
          </View>
        </View>


        <View style={styles.progressContainer}>
          {/* Background of the progress bar (the track) */}
          <View style={styles.progressTrack}>
              {/* Foreground of the progress bar */}
              <View style={[styles.progressBar, {width: `${progressbar}%`}]} />
          </View>
          <Text style={styles.progressText}>
              {progressbar}% Completed
          </Text>
        </View>

        
      </View>
    );
  };

  const isGoalsSet = !goals.length > 0;
  

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

 

  const modules = userRole === 'Teacher' ? teacherModules : studentModules;

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
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => {
    return (
      <>
        <Text style={[theme.textTitle]}> Welcome, {user?.name?.split(" ")[0]}! </Text>
        {userRole === 'Student' && (
          <>
            <Text style={[theme.textSubtitle, { marginBottom: 10 }]}>
              Your current points: {user?.pointsCounter ? user.pointsCounter : 0}
            </Text>
          </>
        )}
        {/* Display Images */}
        <FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={bannerImages}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={item} style={styles.bannerImage} />
            </View>
          )}
          onScroll={(event) => {
            setProgress(event.nativeEvent.contentOffset.x);
          }}
          style={{ height: 200 }} // Set the height of the FlatList itself
          contentContainerStyle={{ alignItems: 'center' }} // Ensure items are centered
        />
        {userRole === 'Student' && (
          isGoalsSet ? (
            <CurrentGoals
              completedPractice={goals.practiceCount}
              completedAssignment={goals.assignmentCount}
              currentPracticeGoalCount={goals.practiceGoalCount}
              currentAssignmentGoalCount={goals.assignmentGoalCount}
              currentPoints={goals.points}
            />
          ) : (
            <Text style={styles.createGoalPrompt}>Aim High, Start your Goals!</Text>
          )
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
  currentGoalsContainer: {
    marginBottom: 20,
    marginVertical: 20,
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
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1, // The flex property allows the card to grow and shrink dynamically
    margin: 5, // Keep some space between cards
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5, // Give some space between the label and the value
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
    position: 'relative', // Ensures the text can be absolutely positioned within
},

progressTrack: {
    backgroundColor: '#e0e0e0', // Light grey for the unfilled track
    borderRadius: 20,
    height: 30,
    width: '100%', // Ensure it fills the container
    position: 'hidden', // Position it behind the progress bar
},

progressBar: {
    backgroundColor: 'lightgreen', // Primary color for the filled track
    height: '100%',
    borderRadius: 20,
    minWidth: 20, // Minimum visibility
    maxWidth: '100%', // Ensure it doesn't overflow the container
    position: 'absolute', // Position it behind the progress bar
},

progressText: {
    position: 'absolute',
    padding: 20,
    color: 'black',
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