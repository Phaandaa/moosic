import React, { useState } from 'react';
import { View, TextInput } from 'react-native';

const HomepageSearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={{ flexDirection: 'row', margin: 10, backgroundColor: '#F2F3F8' }}>
      <TextInput
        underlineColorAndroid="transparent"
        style={{
          flex: 1,
          borderWidth: 1,
          padding: 8,
          fontSize: 16, // Adjust the font size as needed
          color: '#333', // Adjust the color as needed
        }}
        placeholder="Search by Title"
        placeholderTextColor="#999" // Adjust the placeholder text color as needed
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          onSearch(text.toLowerCase()); // Trigger search on every text change
        }}
      />
    </View>
  );
};

export default HomepageSearchBar;
