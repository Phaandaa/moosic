import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

const AssignmentSearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={{ flexDirection: 'row', marginTop: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, borderColor: "#ffffff", backgroundColor: Colors.accentGrey, flex: 1, }}>
        <Ionicons name="search" size={30} color="#A1B2CF" style={{ marginLeft: 10, marginRight: 10 }} />
        <TextInput
          underlineColorAndroid="transparent"
          style={{
            flex: 1,
            paddingVertical: 10,
            fontSize: 16, 
            color: '#333',
          }}
          placeholder="Search"
          placeholderTextColor="#A1B2CF" 
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            onSearch(text.toLowerCase()); 
          }}
        />
      </View>
    </View>
  );
};

export default AssignmentSearchBar;
