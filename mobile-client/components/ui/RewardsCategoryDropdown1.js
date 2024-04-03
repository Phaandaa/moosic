import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "../../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const data = [
  { label: "Digital Items", value: "digital" },
  { label: "Physical Items", value: "physical" },
];

const RewardsCategoryDropdown1 = (props) => {
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
        <Ionicons
          name={isItemSelected(item.value) ? "checkbox" : "square-outline"}
          size={20}
          color={Colors.fontQuaternary}
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
        placeholder="Select category"
        value={selected}
        onChange={handleSelection}
        renderItem={renderItem}
        renderSelectedItem={(item) => (
          <TouchableOpacity
            onPress={() => {
              setSelected((currentSelected) =>
                currentSelected.filter((value) => value !== item.value)
              );
              if (props.onCategoryChange) {
                props.onCategoryChange(
                  selected.filter((value) => value !== item.value)
                );
              }
            }}
          >
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign
                color={Colors.fontQuaternary}
                name="delete"
                size={17}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default RewardsCategoryDropdown1;

const styles = StyleSheet.create({
  container: { paddingVertical: 16 },
  dropdown: {
    height: 50,
    backgroundColor: Colors.fontQuaternary,
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
