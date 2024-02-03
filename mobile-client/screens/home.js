import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import BoxComponent from '../components/ui/homepageModuleBoxes';
import theme from './styles/theme';
import HomepageSearchBar from '../components/ui/homepageSearchbar';



const HomeScreen = ({ navigation }) => {
  const [searchResults, setSearchResults] = useState([]);

  const modules = [
    { id: 'knowledge', color: '#686BFF', title: 'Knowledge', subtitle: 'Hand and Finger Work', iconName: 'bulb', navigationPage: 'CreateAssignmentScreen', iconColor: 'white', buttonText: 'Continue' },
    { id: 'assignment', color: '#466CFF', title: 'Assignment', subtitle: 'Create an assignment', iconName: 'musical-notes', navigationPage: 'CreateAssignmentScreen', iconColor: 'white', buttonText: 'Create' },
    { id: 'students', color: '#EE97BC', title: 'View My Students', subtitle: 'My lovely students', iconName: 'people', navigationPage: 'MyStudentsScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'practice', color: '#EE97BC', title: 'Practice', subtitle: 'Record My Practice Sessions', iconName: 'musical-notes', navigationPage: 'PracticeScreen', iconColor: 'white', buttonText: 'View' },
    { id: 'assignments', color: '#EE97BC', title: 'Assignments', subtitle: 'View My Assignments (student) ', iconName: 'people', navigationPage: 'ViewAssignmentsScreen', iconColor: 'white', buttonText: 'View' },
    // Add more modules as needed
  ];

  const handleSearch = (searchText) => {
    // Perform search logic based on ID
    const results = modules.filter(module => module.id.includes(searchText));
    setSearchResults(results);
  };

  return (
    <View style={[theme.container, {paddingBottom: 50}]}>

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
