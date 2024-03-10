import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomepageSearchBar from "../../components/ui/homepageSearchbar";
import theme from "../../styles/theme";
import IP_ADDRESS from "../../constants/ip_address_temp";
import LoadingComponent from "../../components/ui/LoadingComponent";
import RewardsCategoryDropdown from "../../components/ui/RewardsCategoryDropdown";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import RewardsCategoryDropdown1 from "../../components/ui/RewardsCategoryDropdown1";

// Dimensions to calculate the window width
const { width } = Dimensions.get("window");
function RewardsShopScreen() {
  const items = [
    {
      id: "1",
      title: "Cat Frame",
      points: "70",
      type: "Digital",
      imageUrl: require("../../assets/catframe.jpeg"),
    },
    {
      id: "2",
      title: "Love Frame",
      points: "70",
      type: "Digital",
      imageUrl: require("../../assets/loveframe.jpeg"),
    },
    // ... other items
  ];

  const ShopItem = ({ title, points, type, imageUrl }) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemType}>{type}</Text>
        </View>
        <Image source={imageUrl} style={styles.itemImage} />
        <View style={styles.titleContainer}>
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.itemPoints}>
            <Ionicons name="star" size={16} color="#ffffff" />
            {points}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <View style={styles.headerButtons}>
          <HomepageSearchBar />
          {/* <RewardsCategoryDropdown /> */}
          <RewardsCategoryDropdown1 />
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>4 Items Found</Text>
        <Text style={styles.headerText}>Current Points: 1900</Text>
      </View>
      <View style={styles.itemList}>
        <FlatList
          data={items}
          renderItem={({ item }) => <ShopItem {...item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      </View>
    </View>
  );
}
export default RewardsShopScreen;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    width: "100%",
    height: "100%",
    flex: 1,
  },
  shadowContainer: {
    padding: 15, // Optional: If you want some space inside the container
    backgroundColor: "#fff", // A background color is required
    // iOS shadow styles
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1.41,
    // Android elevation
    elevation: 5,
  },
  headerButtons: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    paddingTop: 18,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemList: {
    flex: 1,
    alignItems: "center",
  },
  item: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    margin: 10,
    width: width / 2 - 40, // Two items per row with padding
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    height: "80",
  },
  itemHeader: {
    backgroundColor: "#F6D855",
    padding: 5,
    marginTop: 20,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    borderBottomRightRadius: 10,
  },
  itemType: {
    fontWeight: "bold",
  },
  itemImage: {
    width: "100%",
    height: 150,
    marginVertical: 10,
  },
  titleContainer: {
    backgroundColor: "#EEF0F7",
    paddingVertical: 5,
    paddingHorizontal: 20,
    width: "100%",
  },
  itemTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  pointsContainer: {
    backgroundColor: Colors.primary500, // Button background
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  itemPoints: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
