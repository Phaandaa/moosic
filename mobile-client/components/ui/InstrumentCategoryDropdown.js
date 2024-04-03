import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import Colors from "../../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons"; 

const data = [
  { label: "Piano", value: "piano" },
  { label: "Guitar", value: "guitar" },
  { label: "Violin", value: "violin" },
];

const InstrumentCategoryDropdown = (props) => {
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

    if (props.onCategoryChange) {
      props.onCategoryChange(newSelected);
    }
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
          color={Colors.accentBlue}
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
        placeholder={`Instruments (${selected.length})`}
        value={selected}
        onChange={handleSelection}
        alwaysRenderSelectedItem={false}
        visibleSelectedItem={false}
        renderItem={renderItem}
      />
    </View>
  );
};

export default InstrumentCategoryDropdown;

const styles = StyleSheet.create({
  container: { 
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  dropdown: {
    height: 40,
    backgroundColor: Colors.accentBlue,
    borderRadius: 12,
    padding: 12,
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
