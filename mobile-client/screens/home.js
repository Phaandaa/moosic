import React, { useState, useEffect, useRef  } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions,Image, ScrollView } from 'react-native';
import BoxComponent from '../components/ui/homepageModuleBoxes';
import theme from '../styles/theme';
import HomepageSearchBar from '../components/ui/homepageSearchbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import IP_ADDRESS from '../constants/ip_address_temp';

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
  let intervalId = useRef(null);

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



  useEffect(() => {
    intervalId.current = setInterval(() => {
      if (flatListRef.current && modules && modules.length > 0) {
        const newProgress = progress + width;
        const maxOffset = width * (searchResults.length > 0 ? searchResults.length : modules.length - 1);
        const nextOffset = newProgress > maxOffset ? 0 : newProgress;
        flatListRef.current.scrollToOffset({
          offset: nextOffset,
          animated: true,
        });
        setProgress(nextOffset);
      }
    }, 3000); // Scrolls to the next item every 3 seconds
    
    return () => clearInterval(intervalId.current); // Clear interval on unmount
  }, [progress, searchResults, modules]);
  
  useEffect(() => {
    if (goals.practiceGoalCount + goals.assignmentGoalCount > 0) {
      const newProgress = ((goals.practiceCount + goals.assignmentCount) / (goals.practiceGoalCount + goals.assignmentGoalCount)) * 100;
      setProgressBar(Math.round(newProgress)); // Round to nearest whole number
    } else {
      setProgressBar(0); // Reset progress if there are no goals
    }
  }, [goals]);

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

  const CurrentGoals = ({ completedPractice, completedAssignment, currentPracticeGoalCount, currentAssignmentGoalCount, currentPoints }) => {
    
    return (
      <View style={styles.currentGoalsContainer}>
        <Text style={styles.currentGoalsText}>Goals At a Glance</Text>
        
        <View style={styles.goalsRow}>
          <View style={[styles.goalCard, {backgroundColor: '#466CFF'}]}>
            <Text style={styles.goalLabel}>Practices Completed</Text>
            <Text style={styles.goalValue}>{completedPractice} / {currentPracticeGoalCount}</Text>
          </View>
          <View style={[styles.goalCard, {backgroundColor: '#EE97BC'}]}>
            <Text style={styles.goalLabel}>Assignments Completed</Text>
            <Text style={styles.goalValue}>{completedAssignment} / {currentAssignmentGoalCount}</Text>
          </View>
          <View style={[styles.goalCard, {backgroundColor: '#686BFF'}]}>
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
    { id: 'assignment', color: '#466CFF', title: 'Assignment', subtitle: 'Create an assignment', iconName: 'musical-notes', navigationPage: 'CreateAssignmentScreen', iconColor: 'white', buttonText: 'Create' },
    { id: 'students', color: '#EE97BC', title: 'View My Students', subtitle: 'My lovely students', iconName: 'people', navigationPage: 'MyStudentsScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'setGoals', color: '#686BFF', title: 'Set Goals', subtitle: 'Set goals for students', iconName: 'golf', navigationPage: 'ViewCreatedGoalsForStudents', iconColor: 'white', buttonText: 'Create' },
    // Add more modules specific to teacher
  ];

  const studentModules = [
    // { id: 'practice', color: '#EE97BC', title: 'Practice', subtitle: 'Record My Practice Sessions', iconName: 'musical-notes', navigationPage: 'CreatePracticeScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'assignments', color: '#466CFF', title: 'Assignments', subtitle: 'View My Assignments', iconName: 'people', navigationPage: 'AssignmentListScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'practicelog', color: '#EE97BC', title: 'Practice Log', subtitle: 'View My Practice Sessions', iconName: 'musical-notes', navigationPage: 'PracticeListStudentScreen', iconColor: 'white', buttonText: 'View' },
 
  ];

  const modules = userRole === 'Teacher' ? teacherModules : studentModules;

  const Header = () => {
    return (
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
  };
  

  const ITEM_HEIGHT = 200; // Example height, adjust as needed

  return (
    <ScrollView style={[theme.container, {paddingBottom: 0}]}>

      <Header />
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
        style= {{height: 200}}
        data={searchResults.length > 0 ? searchResults : modules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.boxContainer, { height: ITEM_HEIGHT }]}>
            
          </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            contentContainerStyle ={{ height: ITEM_HEIGHT }}
            onScroll={(event) => {
              setProgress(event.nativeEvent.contentOffset.x);
            }}
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


           <FlatList
            style={{height: 400}}
            numColumns={2}
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
              id={item.id}
              />
                )}

          />
        

      
      
          
    </ScrollView>
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

  
});