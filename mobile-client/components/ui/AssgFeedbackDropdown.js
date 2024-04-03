import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "../../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons"; // make sure to import Ionicons

const data = [
  { label: "A - 20 points", value: "20" },
  { label: "B - 15 points", value: "15" },
  { label: "C - 10 points", value: "10" },
  { label: "D - 5 points", value: "5" },
  { label: "F - 0 points", value: "0" },
];

const AssgFeedbackDropdown = (props) => {
  const [selected, setSelected] = useState('');
  const dropdownRef = useRef(null);

  const handleSelection = (item) => {
    const newValue = item.value;
    setSelected(newValue); // Now just set the single value

    // Notify parent component about the change
    if (props.onCategoryChange) {
      props.onCategoryChange(newValue);
    }

    // Close the dropdown
    if (dropdownRef.current) {
      dropdownRef.current.close();
    }
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleSelection(item)}
      >
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        {/* <Ionicons
          name={isItemSelected(item.value) ? "checkbox" : "square-outline"}
          size={20}
          color={Colors.mainPurple}
        /> */}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Dropdown
        ref={dropdownRef}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={`Points ${selected}`}
        value={selected}
        onChange={handleSelection}
        alwaysRenderSelectedItem={false}
        visibleSelectedItem={false}
        renderItem={renderItem}
      />
    </View>
  );
};

export default AssgFeedbackDropdown;

const styles = StyleSheet.create({
  container: { 
    paddingVertical: 10,
    flex: 1, // Takes up equal space within the container
    marginHorizontal: 5, // Gives some space between the dropdowns 
  },
  dropdown: {
    height: 40,
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 12,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,

    // elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.fontSecondary,
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
