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

  useEffect(() => {
  }, [state.notifications]);
  

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
    { id: 'students', color: Colors.green, title: 'My Students', subtitle: 'View my students', iconName: 'people', navigationPage: 'MyStudentsScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'setGoals', color: Colors.red, title: 'Set Goals', subtitle: 'Set goals for students', iconName: 'golf', navigationPage: 'ViewCreatedGoalsForStudents', iconColor: 'white', buttonText: 'Create' },
    { id: 'repository', color: Colors.pink, title: 'Repository', subtitle: 'View teaching resources', iconName: 'file-tray-full', navigationPage: 'ResourceRepositoryScreen', iconColor: 'white', buttonText: 'View' },
    // { id: 'repository', color: Colors.mainPurple, title: 'My Uploads', subtitle: 'View resources uploaded', iconName: 'file-tray-full', navigationPage: 'ResourcesUploadedListScreen', iconColor: 'white', buttonText: 'View' },
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
        { state.userData.role === "Student" &&
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
        </View>}
        {state.userData.role === 'Student' && (
            <CurrentGoals isStudent={true} studentId={state.userData.id} />
        )}
      </>
    );
  };
  
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
      numColumns={2}
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
    height: 100,
  },
  logoStyle: {
    height: "70%", 
    resizeMode: 'contain',
    flex: 1, 
    width: undefined,
  },
  notificationButton: {
    padding: 10, 
    
  },
  searchBar: {
    flex: 1,
    marginRight: 10, 
  },
  timeText: {
    fontSize: 16,
  },
  headerText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', 
    textAlign: 'center', 
  },
  boxContainer: {
    
    width: width * 0.8, 
    marginRight: width * 0.05, 
    height: 200, 
    verticalAlign: 'center',
  },
  imageContainer: {
    width: width, 
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  bannerImage: {
    height: '100%',
    borderRadius: 15,
    resizeMode: 'cover',
    aspectRatio: 1.9, 
    marginRight: 30, 
  },
});