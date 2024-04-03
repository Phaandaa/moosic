import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";

const HomepageSearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  return (
    <View style={{ flexDirection: "row", marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderRadius: 10,
          borderColor: Colors.grey,
          backgroundColor: Colors.grey,
          flex: 1,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          paddingVertical:4,
          elevation: 2,
        }}
      >
        <Ionicons
          name="search"
          size={30}
          color={Colors.fontQuaternary}
          style={{ marginLeft: 10, marginRight: 10 }}
        />
        <TextInput
          underlineColorAndroid="transparent"
          style={{
            flex: 1,
            paddingVertical: 10,
            fontSize: 16,
            color: "#333",
          }}
          placeholder="Search"
          placeholderTextColor={Colors.fontQuaternary}
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

export default HomepageSearchBar;
