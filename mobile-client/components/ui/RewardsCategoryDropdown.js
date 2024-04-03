import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../constants/ip_address_temp";
import Colors from "../../constants/colors";


const RewardsCategoryDropdown = ({ onSelectionChange }) => {
  const [selected, setSelected] = useState([]);
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
    </View>
  );
};
const styles = StyleSheet.create({
  dropdownBox: {
    borderColor: "#CCCCCC",
    marginBottom: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.fontPrimary, 
    marginBottom: 10,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 16,
    color: "#CCCCCC",
  },
  badgeStyles: {
    backgroundColor: Colors.yellow,
  },
  badgeTextStyles: {
    color: Colors.fontSecondary,
  },
  listParentLabelStyle: {
    fontSize: 16,
  },
  dropDownContainer: {
    borderWidth: 0,
  },
});

export default RewardsCategoryDropdown;
