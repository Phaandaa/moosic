import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomepageSearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={{ flexDirection: 'row', marginTop: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, borderColor: "#F2F3F8", backgroundColor: '#F2F3F8', flex: 1, }}>
        <Ionicons name="search" size={30} color="#A1B2CF" style={{ marginLeft: 10, marginRight: 10 }} />
        <TextInput
          underlineColorAndroid="transparent"
          style={{
            flex: 1,
            paddingVertical: 10,
            fontSize: 16, // Adjust the font size as needed
            color: '#333',
          }}
          placeholder="Search your Lesson"
          placeholderTextColor="#A1B2CF" // Adjust the placeholder text color as needed
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            onSearch(text.toLowerCase()); // Trigger search on every text change
          }}
        />
      </View>
    </View>
  );
};

export default HomepageSearchBar;
