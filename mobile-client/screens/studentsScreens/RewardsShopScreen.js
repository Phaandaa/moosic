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
import ConfirmPurchaseModal from "../../components/ui/confirmPurchaseModal";

// Dimensions to calculate the window width
const { width } = Dimensions.get("window");

function RewardsShopScreen() {
  const [items, setItems] = useState([]);
  const [userData, setUserData] = useState({});
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
      result = result.filter((item) =>
        item.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      result = result.filter((item) =>
        selectedCategories.includes(item.type.toLowerCase())
      );
    }

    setFilteredResults(result);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handlePressPurchase = (item) => {
    setSelectedItem(item); // Set the selected item
    setModalVisible(true); // Show confirmation modal
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem || !userData.id) return;

    try {
      const response = await fetch(
        `${IP_ADDRESS}/reward-shop/digital/${selectedItem.id}?student_id=${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // If the server response is not ok, throw an error
        const errorText =
          (await response.text()) || "An unknown error occurred";
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Parse the JSON response from the server
      const updatedItem = await response.json();

      // Update local state to reflect the redeemed item and the new points total
      setUserData((previousUserData) => ({
        ...previousUserData,
        pointsCounter: previousUserData.pointsCounter - updatedItem.points, // Subtract points from user's total
      }));

      Alert.alert("Success", "Item redeemed successfully!");
      setModalVisible(false);
      setSelectedItem(null); // Reset selected item on successful redemption
    } catch (error) {
      console.error("Redemption error:", error);
      Alert.alert("Redemption Failed", error.toString());
      setModalVisible(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null); // Reset selected item on modal close
  };

  const ShopItem = ({ description, points, type, imageLink, id }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          handlePressPurchase({ description, points, type, imageLink, id })
        }
      >
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ConfirmPurchaseModal
        isVisible={modalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPurchase}
        item={selectedItem}
        user={userData}
      />
      <View style={styles.shadowContainer}>
        <View style={styles.headerButtons}>
          <HomepageSearchBar onSearch={handleSearch} />
          {/* <RewardsCategoryDropdown /> */}
          <RewardsCategoryDropdown1 onCategoryChange={setSelectedCategories} />
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
    backgroundColor: Colors.accentYellow,
    padding: 5,
    marginTop: 20,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    // iOS shadow styles
    shadowColor: Colors.primary500,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    // Android elevation
    elevation: 5,
  },
  itemType: {
    fontWeight: "bold",
    color: Colors.fontPrimary,
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
    color: Colors.fontSecondary,
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
