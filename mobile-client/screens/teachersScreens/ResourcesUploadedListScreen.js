import React, { useState, useEffect, useCallback } from "react";
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
import theme from "../../styles/theme";

import TypeCategoryDropdown from "../../components/ui/TypeCategoryDropdown";
import GradeCategoryDropdown from "../../components/ui/GradeCategoryDropdown";
import InstrumentCategoryDropdown from "../../components/ui/InstrumentCategoryDropdown";
import StatusDropdown from "../../components/ui/StatusDropdown";

// Dimensions to calculate the window width
const { width } = Dimensions.get("window");


function ResourcesUploadedListScreen() {
    const [files, setFiles] = useState([]);
    const [userData, setUserData] = useState({});
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [selectedTypes, setSelectedTypes] = useState([]); 
    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [selectedGrades, setSelectedGrades] = useState([]); 
    const [selectedStatus, setSelectedStatus] = useState([]); 

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //     try {
    //         const userData = await AsyncStorage.getItem("userData");
    //         const parsedUserData = JSON.parse(userData);
    //         setUserData(parsedUserData);
    //     } catch (error) {
    //         console.error("Error processing user data", error);
    //     }
    //     };
    //     fetchUserData();
    // }, []);

    // useEffect(() => {
    //     const fetchItems = async () => {
    //     try {
    //         const response = await fetch(`${IP_ADDRESS}/reward-shop`, {
    //         method: "GET",
    //         });

    //         if (!response.ok) {
    //         const errorText = response.statusText || "Unknown error occurred";
    //         throw new Error(
    //             `Request failed with status ${response.status}: ${errorText}`
    //         );
    //         }
    //         const responseData = await response.json();
    //         setItems(responseData); // Set the state with the response data
    //         setFilteredResults(responseData);
    //         console.log('responseData', responseData)
    //     } catch (error) {
    //         console.error("Error fetching items:", error);
    //     }
    //     };
    //     fetchItems();
    // }, []);

    useEffect(() => {
        // Combine search and category filters
        applyFilters();
    }, [files, searchText, selectedTypes, selectedInstruments, selectedGrades, selectedStatus]);

    const applyFilters = () => {
        let result = files;

        // Filter by search text
        if (searchText) {
        result = result.filter((file) =>
            file.fileName.toLowerCase().includes(searchText.toLowerCase())
        );
        }

        // Filter by selected types
        if (selectedTypes.length > 0) {
            result = result.filter((file) =>
                file.type.some(type => selectedTypes.includes(type.toLowerCase()))
            );
        }
    
        // Filter by selected instruments
        if (selectedInstruments.length > 0) {
            result = result.filter((file) =>
            file.instrument.some(instrument => selectedInstruments.includes(instrument.toLowerCase()))
        )};

        // Filter by selected grades
        if (selectedGrades.length > 0) {
            result = result.filter((file) =>
            file.grade.some(grade => selectedGrades.includes(grade.toLowerCase()))
        )};

        // Filter by selected status
        if (selectedStatus.length > 0) {
            result = result.filter((file) => {
                const doesMatchStatus = selectedStatus.includes(file.status.toLowerCase());
                
                // Log for debugging
                // console.log(`Checking file: ${file.fileName}, Status: ${file.status}, Matches: ${doesMatchStatus}`);
                
                return doesMatchStatus;
            });
        }
        setFilteredResults(result)
    };

    useEffect(() => {
        console.log('Selected Statuses:', selectedStatus);
    }, [selectedStatus]);
      

    const handleSearch = (text) => {
        setSearchText(text);
    };

    useEffect(() => {
        const MockFiles = [{
            id: '1', 
            fileName: 'ABRSM Theory.png',
            creationTime: '2024-03-21T16:53:25.758+00:00',
            fileLink:'https://storage.googleapis.com/moosicfyp/shop/438d678a-414d-47b3-a039-23f1de415879_6.png',
            type: ['Theory', 'Sight Reading'],
            instrument: ['Piano', 'Guitar'],
            grade: ['3'],
            status: 'Pending'
        }, {
            id: '2',
            fileName: 'SightReadingG3.png',
            creationTime: '2024-03-21T16:54:31.761+00:00',
            fileLink:'https://storage.googleapis.com/moosicfyp/shop/5040a13d-c236-467d-87cd-1649456aad45_8.png',
            type: ['Theory', 'Sight Reading'],
            instrument: ['Piano'],
            grade: ['3'],
            status: 'Approved'
        }, {
            id: '3',
            fileName: 'Let It Go.png',
            creationTime: '2024-03-21T16:54:31.761+00:00',
            fileLink:'https://storage.googleapis.com/moosicfyp/shop/5040a13d-c236-467d-87cd-1649456aad45_8.png',
            type: ['Music Sheet'],
            instrument: ['Violin'],
            grade: ['1'],
            status: 'Rejected'
        }, {
            id: '4',
            fileName: 'Beethoven.png',
            creationTime: '2024-03-21T16:54:31.761+00:00',
            fileLink:'https://storage.googleapis.com/moosicfyp/shop/5040a13d-c236-467d-87cd-1649456aad45_8.png',
            type: ['Music Sheet'],
            instrument: ['Violin'],
            grade: ['4'],
            status: 'Rejected'
        }];
        
        setFiles(MockFiles);
        setFilteredResults(MockFiles);
        console.log('files: ', files);
    }, []);

    useEffect(() => {
        console.log('files: ', files); // This will now log the updated state, but only after re-renders.
    }, [files]); // Log the `files` state when it changes

    useEffect(() => {
        console.log('Filtered Results:', filteredResults);
    }, [filteredResults]);

    const RepoFile = ({ fileName, instrument, type, grade, fileLink, status }) => {
        return (
        <TouchableOpacity style={styles.item}>
            <View style={styles.itemImageContainer}> 
                {/* <View style={styles.itemHeader}>
                    <Text style={styles.itemType}>{status}</Text>
                </View> */}
                <View style={styles.statusHeader}>
                    <Ionicons
                        name={status === 'Approved' ? "checkmark-circle" : status === 'Rejected' ? "close-circle" : "timer"}
                        size={30}
                        color={status === 'Approved' ? Colors.accentGreen : status === 'Rejected' ? Colors.accentRed : Colors.accentBlue}
                        style={styles.statusLogo}
                    />
                </View>
                <Image
                    source={{ uri: fileLink }}
                    style={styles.itemImage}
                    resizeMode="cover"
                />
            </View>
            <Text style={styles.itemTitle}>{fileName}</Text>
            <Text style={styles.date}>{'24/03/2024' /* Replace with actual date if needed */}</Text>
            <View style={styles.chipContainer}>
                {type.map((typeItem, index) => (
                    <View key={index} style={styles.chip}>
                        <Text style={styles.pinkChipText}>{typeItem}</Text>
                    </View>
                ))}
                {instrument.map((instrumentItem, index) => (
                    <View key={index} style={[styles.chip, styles.instrumentChip]}>
                        <Text style={styles.blueChipText}>{instrumentItem}</Text>
                    </View>
                ))}
                {grade.map((gradeItem, index) => (
                    <View key={index} style={[styles.chip, styles.gradeChip]}>
                        <Text style={styles.greenChipText}>Grade {gradeItem}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
        <View style={styles.shadowContainer}>
            <View style={styles.headerButtons}>
                <HomepageSearchBar onSearch={handleSearch} />
                {/* <RewardsCategoryDropdown1 onCategoryChange={setSelectedCategories} /> */}
                <View style={styles.dropdownContainer}> 
                    <TypeCategoryDropdown onCategoryChange={setSelectedTypes}/>
                    <InstrumentCategoryDropdown onCategoryChange={setSelectedInstruments}/>
                    <GradeCategoryDropdown onCategoryChange={setSelectedGrades}/>
                    <StatusDropdown onCategoryChange={setSelectedStatus}/>
                </View>
                <View style={styles.selectedChipsContainer}>
                    <View style={styles.selectedChip}>
                        <Text style={styles.pinkSelectedChipText}>{`${selectedTypes.length} Selected`}</Text>
                    </View>
                    <View style={[styles.selectedChip, styles.instrumentChip]}>
                        <Text style={styles.blueSelectedChipText}>{`${selectedInstruments.length} Selected`}</Text>
                    </View>
                    <View style={[styles.selectedChip, styles.gradeChip]}>
                        <Text style={styles.greenSelectedChipText}>{`${selectedGrades.length} Selected`}</Text>
                    </View>
                    <View style={[styles.selectedChip, styles.statusChip]}>
                        <Text style={styles.purpleSelectedChipText}>{`${selectedStatus.length} Selected`}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.header}>
            <Text style={styles.headerText}>
                {filteredResults?.length ? filteredResults.length : 0} Files Found
            </Text>
            </View>
        </View>

        <View style={styles.itemList}>
            <FlatList
            data={filteredResults}
            renderItem={({ item }) => <RepoFile {...item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            />
        </View>
        </View>
    );
};
export default ResourcesUploadedListScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    width: "100%",
    height: "100%",
    flex: 1,
  },
  shadowContainer: {
    paddingHorizontal: 15, 
    paddingBottom: 15,
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
    marginTop: 5,
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
        backgroundColor: '#ffffff',
        borderRadius: 15,
        margin: 5,
        width: width / 2 - 20, // Two items per row with padding
        alignItems: 'center',
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    itemHeader: {
        backgroundColor: Colors.pastelPurple,
        borderColor: Colors.mainPurple,
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,

        marginTop: 0,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
    },
    itemType: {
        color: Colors.mainPurple,
        fontWeight: '500',
        fontSize: 12
    },
    statusHeader: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: '#ffffff',        
        borderRadius: 50,
        paddingHorizontal: 2,
    },
    itemImageContainer:{
        backgroundColor: Colors.accentGrey, // Light grey background
        borderRadius: 15,
        borderColor: Colors.accentGrey,
        borderWidth: 15,
        borderBottomWidth: 0,
        overflow: 'hidden', // Ensures the image doesn't bleed outside the border radius
        // height: 200
    },
    itemImage: {
        width: '100%',
        // height: 100,
        aspectRatio: 1.5,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,   
        resizeMode: 'contain' 
    },
    grade: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 5,
        borderRadius: 5,
        fontWeight: 'bold',
    },
    itemTitle: {
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    date: {
        color: 'grey',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal: 5
    },
    chip: {
        backgroundColor: Colors.pastelPink,
        borderColor: Colors.accentPink,
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 2,
    },
    instrumentChip: {
        backgroundColor: Colors.pastelBlue,
        borderColor: Colors.accentBlue,
    },
    gradeChip: {
        backgroundColor: Colors.pastelGreen,
        borderColor: Colors.accentGreen
    },
    statusChip:{
        backgroundColor: Colors.pastelPurple,
        borderColor: Colors.mainPurple
    },
    pinkChipText: {
        color: Colors.accentPink,
        fontWeight: '500',
        fontSize: 12
    },
    blueChipText: {
        color: Colors.accentBlue,
        fontWeight: '500',
        fontSize: 12
    },
    greenChipText:{
        color: Colors.accentGreen,
        fontWeight: '600',
        fontSize: 12
    },
    dropdownContainer:{
        flexDirection: 'row',
        justifyContent: "space-around", // Try 'space-around' for equal spacing
        alignItems: 'center', // This centers the dropdowns vertically in the container
        height: 40,
        marginTop: 10
    },
    selectionCount: {
        textAlign: 'center', // Center the text horizontally
        color: Colors.fontSecondary, // Use your theme's secondary font color
        fontSize: 12, // Adjust the size as needed
        marginTop: 4, // Adjust the space between the dropdown and this text
        fontWeight: 'bold', // Optional: if you want the text to be bold
    },
    selectedChip: {
        backgroundColor: Colors.pastelPink,
        borderColor: Colors.accentPink,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        margin: 2,
    },
    selectedChipsContainer:{
        flexDirection: 'row',
        justifyContent: "space-around", // Try 'space-around' for equal spacing
        alignItems: 'center', // This centers the dropdowns vertically in the container
        marginVertical: 3
    },
    pinkSelectedChipText:{
        color: Colors.accentPink,
        fontWeight: '500',
        fontSize: 16
    },
    blueSelectedChipText:{
        color: Colors.accentBlue,
        fontWeight: '500',
        fontSize: 16
    },
    greenSelectedChipText:{
        color: Colors.accentGreen,
        fontWeight: '500',
        fontSize: 16
    },
    purpleSelectedChipText:{
        color: Colors.mainPurple,
        fontWeight: '500',
        fontSize: 16
    }
    
});