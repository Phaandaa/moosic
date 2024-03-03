import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import BoxComponent from '../components/ui/homepageModuleBoxes';
import theme from '../styles/theme';
import HomepageSearchBar from '../components/ui/homepageSearchbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [userRole, setUserRole] = useState('');

  const checkStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('authData');
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        return parsedData.role;
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage', error);
    }
    return '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = await checkStoredData();
        setUserRole(role);
      } catch (error) {
        console.error('Error processing stored data', error);
      }
    };
    fetchData();
  }, []);

  const teacherModules = [
    { id: 'assignment', color: '#466CFF', title: 'Assignment', subtitle: 'Create an assignment', iconName: 'musical-notes', navigationPage: 'CreateAssignmentScreen', iconColor: 'white', buttonText: 'Create' },
    { id: 'students', color: '#EE97BC', title: 'View My Students', subtitle: 'My lovely students', iconName: 'people', navigationPage: 'MyStudentsScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'setGoals', color: '#686BFF', title: 'Set Goals', subtitle: 'Set goals for students', iconName: 'golf', navigationPage: 'ViewCreatedGoalsForStudents', iconColor: 'white', buttonText: 'Create' },
    // Add more modules specific to teacher
  ];

  const studentModules = [
    // { id: 'knowledge', color: '#686BFF', title: 'Knowledge', subtitle: 'Hand and Finger Work', iconName: 'bulb', navigationPage: 'CreateAssignmentScreen', iconColor: 'white', buttonText: 'Continue' },
    { id: 'practice', color: '#EE97BC', title: 'Practice', subtitle: 'Record My Practice Sessions', iconName: 'musical-notes', navigationPage: 'CreatePracticeScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'assignments', color: '#466CFF', title: 'Assignments', subtitle: 'View My Assignments', iconName: 'people', navigationPage: 'AssignmentListScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'practicelog', color: '#EE97BC', title: 'Practice Log', subtitle: 'View My Practice Sessions', iconName: 'musical-notes', navigationPage: 'PracticeListStudentScreen', iconColor: 'white', buttonText: 'View' },
    // Add more modules specific to student
  ];

  const modules = userRole === 'Teacher' ? teacherModules : studentModules;

  const handleSearch = (searchText) => {
    const results = modules.filter(module => module.id.includes(searchText));
    setSearchResults(results);
  };

  return (
    <View style={[theme.container, {paddingBottom: 0}]}>

      {/* Search bar */}
      <HomepageSearchBar onSearch={handleSearch} />
      
      <Text style={[theme.textTitle, {marginTop: 10}]}> Welcome!</Text>

      {/* Display modules or search results */}
      <FlatList
        data={searchResults.length > 0 ? searchResults : modules}
        keyExtractor={item => item.id}
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
    </View>
  );
};

export default HomeScreen;
