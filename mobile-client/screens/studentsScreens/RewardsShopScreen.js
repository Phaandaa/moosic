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
import { useAuth } from "../../context/Authcontext";
import axios from "axios";

// Dimensions to calculate the window width
const { width } = Dimensions.get("window");

function RewardsShopScreen() {
  const { state } = useAuth();
  const [items, setItems] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [userData, setUserData] = useState({});
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchaseCounter, setPurchaseCounter] = useState(0);

  useEffect(() => {
    console.log("RewardsShopScreen.js line 38", state.userData);
    setUserData(state.userData);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {

        const [itemResponse, purchaseHistoryResponse] = await Promise.all([
          axios.get(`${IP_ADDRESS}/reward-shop`, state.authHeader),
          axios.get(`${IP_ADDRESS}/purchase-history/${state.userData.id}`, state.authHeader),
        ]);
        setItems(itemResponse.data); 
        setPurchaseHistory(purchaseHistoryResponse.data); 
      } catch (error) {
        console.error("RewardsShopScreen.js line 64, Error fetching items:", error);
      }
    };
    fetchItems();
  }, [purchaseCounter, state.userData]);

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

      const response = await axios.put(`${IP_ADDRESS}/reward-shop/digital/${selectedItem.id}?student_id=${userData.id}`, {}, state.authHeader);

      // Parse the JSON response from the server
      const updatedItem = response.data;

      // Update local state to reflect the redeemed item and the new points total
      setUserData((previousUserData) => ({
        ...previousUserData,
        pointsCounter: previousUserData.pointsCounter - updatedItem.points, // Subtract points from user's total
      }));

      Alert.alert("Success", "Item redeemed successfully!");
      setModalVisible(false);
      setSelectedItem(null); // Reset selected item on successful redemption
      if (selectedItem.type === "DIGITAL") {
        setPurchaseCounter((prevPurchaseCounter) => prevPurchaseCounter + 1); // just for refreshing the page bro dont delete hehe
      }
    } catch (error) {
      console.error("RewardsShopScreen.js line 140, Redemption error:", error);
      Alert.alert("Redemption Failed", error.toString());
      setModalVisible(false);
    }
  };

  const hasBeenFullyPurchased = (itemId, purchaseHistory, limitation, stock) => {
    const totalPurchased = purchaseHistory.reduce((total, purchase) => {
      if (purchase.itemId === itemId) {
        return total + purchase.purchaseAmount;
      }
      return total;
    }, 0); 
    return totalPurchased >= limitation || stock <= 0;
  };
  

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null); // Reset selected item on modal close
  };

  const ShopItem = ({ description, points, type, imageLink, id, limitation, stock }) => {
    const isFullyPurchased = hasBeenFullyPurchased(id, purchaseHistory, limitation, stock);
    const canPurchase = userData.pointsCounter >= points;
    return (
      <TouchableOpacity
        style={[styles.item, isFullyPurchased ? styles.itemDisabled : null]}
        onPress={() =>
          isFullyPurchased ? null : handlePressPurchase({ description, points, type, imageLink, id })
        }
        disabled={isFullyPurchased || !canPurchase}
        // style={styles.item}
        // onPress={() =>
        //   handlePressPurchase({ description, points, type, imageLink, id })
        // }
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
            {!isFullyPurchased && <Image 
              source={require('../../assets/currency.png')} 
              style={styles.currencyImage}
            />}
            <Text style={[styles.itemPoints, canPurchase ? null : styles.pointsDisabledText]}>
              {!isFullyPurchased ? points : "Item sold out"}
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
          <View style={styles.currentPointsContainer}> 
            <Text style={styles.headerText}>
              Current Points:{"  "}
            </Text>
            <Image 
                source={require('../../assets/currency.png')} 
                style={styles.currencyImage}
              />
            <Text style={[styles.itemPoints, {color: Colors.fontSecondary}]}>
              {userData.pointsCounter}
            </Text>
          </View>
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
  itemDisabled: {
    opacity: 0.5,
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
  currentPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    // Remove width: "100%" to let the container shrink-wrap its content
  },
  pointsContainer: {
    backgroundColor: Colors.primary500, // Button background
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pointsDisabledText: {
    opacity: 0.5
  },
  itemPoints: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 5,
    fontSize: 18
  },
  currencyImage:{
    height: 22,
    width: 22
  }
});
