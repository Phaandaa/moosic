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
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomepageSearchBar from "../../components/ui/homepageSearchbar";
import IP_ADDRESS from "../../constants/ip_address_temp";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import RewardsCategoryDropdown1 from "../../components/ui/RewardsCategoryDropdown1";
import theme from "../../styles/theme";

// Dimensions to calculate the window width
const { width } = Dimensions.get("window");

function RewardsShopScreen() {
  const [items, setItems] = useState([]);
  const [userData, setUserData] = useState({});
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const parsedUserData = JSON.parse(userData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error processing user data", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${IP_ADDRESS}/reward-shop`, {
          method: "GET",
        });

        if (!response.ok) {
          const errorText = response.statusText || "Unknown error occurred";
          throw new Error(
            `Request failed with status ${response.status}: ${errorText}`
          );
        }
        const responseData = await response.json();
        setItems(responseData); // Set the state with the response data
        setFilteredResults(responseData);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    // Combine search and category filters
    applyFilters();
  }, [items, searchText, selectedCategories]);

  const applyFilters = () => {
    let result = items;

    // Filter by search text
    if (searchText) {
      result = result.filter(item =>
        item.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      result = result.filter(item =>
        selectedCategories.includes(item.type.toLowerCase())
      );
    }

    setFilteredResults(result);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const ShopItem = ({ description, points, type, imageLink }) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemType}>{type}</Text>
        </View>
        <Image
          source={{ uri: imageLink }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.itemTitle}>{description}</Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.itemPoints}>
            <Ionicons name="star" size={16} color="#ffffff" /> {points}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <View style={styles.headerButtons}>
          <HomepageSearchBar onSearch={handleSearch} />
          {/* <RewardsCategoryDropdown /> */}
          <RewardsCategoryDropdown1 onCategoryChange={setSelectedCategories}/>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {filteredResults?.length ? filteredResults.length : 0} Items Found
          </Text>
          <Text style={styles.headerText}>
            Current Points:{" "}
            <Ionicons name="star" size={16} color={Colors.fontSecondary} />{" "}
            {userData.pointsCounter}
          </Text>
        </View>
      </View>

      <View style={styles.itemList}>
          <FlatList
            data={filteredResults}
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
    marginTop: 30,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: 10,
    alignItems: "center",
    paddingTop: 18,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.fontSecondary,
  },
  itemList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginVertical: 0,
  },
  item: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    margin: 5,
    width: width / 2 - 20, // Two items per row with padding
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    justifyContent: "space-between",
    minHeight: 250,
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
    minHeight: 40, // Adjust this value as needed to accommodate two lines of text
    justifyContent: "center", // This vertically centers the text
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
