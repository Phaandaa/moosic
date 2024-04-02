import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../constants/ip_address_temp";
import Colors from "../../constants/colors";


const RewardsCategoryDropdown = ({ onSelectionChange }) => {
  const [selected, setSelected] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const categories = [
    { key: "1", value: "Avatars" },
    { key: "2", value: "Frames" },
    { key: "3", value: "Stickers" },
    { key: "4", value: "Physical" },
  ];

  useEffect(() => {
    if (onSelectionChange && Array.isArray(selected)) {
      onSelectionChange(selected);
    }
  }, [selected]);

  return (
    <View style={styles.dropdownBox}>
      {/* {isFetching ? (
                <Text style={styles.loadingText}>Loading categories...</Text>
            ) : ( */}
      <MultipleSelectList
        setSelected={(val) => setSelected(val)}
        data={categories}
        label="Categories"
        badgeStyles={styles.badgeStyles}
        badgeTextStyles={styles.badgeTextStyles}
        notFoundText="Category does not exist."
        listParentLabelStyle={styles.listParentLabelStyle}
        dropDownContainer={styles.dropDownContainer}
        save="key"
        onSelect={() => console.log("RewardsCategoryDropdown.js line 43, selected category: ", selected)}
      />
      {/* )} */}
    </View>
  );
};
const styles = StyleSheet.create({
  dropdownBox: {
    // backgroundColor: "#FFFFFF", // Assuming a white background
    // borderWidth: 1,
    borderColor: "#CCCCCC", // Light grey border
    // borderRadius: 5,
    // paddingHorizontal: 20,
    // paddingTop: 20,
    // paddingBottom: 10, // Adjust as needed
    marginBottom: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.fontPrimary, // Black text for the label
    marginBottom: 10,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 16,
    color: "#CCCCCC", // Light grey text while loading
  },
  badgeStyles: {
    backgroundColor: Colors.yellow, // Blue background for selected items
  },
  badgeTextStyles: {
    color: Colors.fontSecondary, // White text for selected items
  },
  listParentLabelStyle: {
    fontSize: 16,
  },
  dropDownContainer: {
    borderWidth: 0, // No border for the dropdown itself
  },
});

export default RewardsCategoryDropdown;
