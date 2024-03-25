import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import Colors from "../../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons"; // make sure to import Ionicons

const data = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
  { label: "8", value: "8" },
];

const GradeCategoryDropdown = (props) => {
  const [selected, setSelected] = useState([]);
  const dropdownRef = useRef(null);

  const isItemSelected = (value) => {
    return selected.includes(value);
  };

  const handleSelection = (item) => {
    const newValue = item.value;
    const isSelected = isItemSelected(newValue);

    let newSelected;
    if (isSelected) {
      newSelected = selected.filter((value) => value !== newValue);
    } else {
      newSelected = [...selected, newValue];
    }
    setSelected(newSelected);

    // Notify parent component about the change
    if (props.onCategoryChange) {
      props.onCategoryChange(newSelected);
    }

    // Close the dropdown
    // if (dropdownRef.current) {
    //   dropdownRef.current.close();
    // }
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleSelection(item)}
      >
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <Ionicons
          name={isItemSelected(item.value) ? "checkbox" : "square-outline"}
          size={20}
          color={Colors.accentGreen}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        ref={dropdownRef}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Grades"
        value={selected}
        onChange={handleSelection}
        alwaysRenderSelectedItem={false}
        visibleSelectedItem={false}
        renderItem={renderItem}
      />
    </View>
  );
};

export default GradeCategoryDropdown;

const styles = StyleSheet.create({
  container: { 
    paddingVertical: 16,
    flex: 1, // Takes up equal space within the container
    marginHorizontal: 5, // Gives some space between the dropdowns 
  },
  dropdown: {
    height: 40,
    backgroundColor: Colors.accentGreen,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.bgWhite,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: Colors.bgWhite,
    color: Colors.bgWhite,
    shadowColor: "#000",
    marginTop: 12,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
    color: Colors.fontQuaternary,
  },
});
