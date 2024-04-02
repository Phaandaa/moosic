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
import HomepageSearchBar from "../../components/ui/homepageSearchbar";
import IP_ADDRESS from "../../constants/ip_address_temp";
import Colors from "../../constants/colors";
import theme from "../../styles/theme";
import { useAuth } from "../../context/Authcontext";
import { Ionicons } from "@expo/vector-icons";

import TypeCategoryDropdown from "../../components/ui/TypeCategoryDropdown";
import GradeCategoryDropdown from "../../components/ui/GradeCategoryDropdown";
import InstrumentCategoryDropdown from "../../components/ui/InstrumentCategoryDropdown";
import axios from "axios";


// Dimensions to calculate the window width
const { width } = Dimensions.get("window");

function ResourceRepositoryScreen() {
    const { state } = useAuth();
    const [centralFiles, setCentralFiles] = useState([]);
    const [teacherFiles, setTeacherFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const [userData, setUserData] = useState({});
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedTab, setSelectedTab] = useState("central");

    const [selectedTypes, setSelectedTypes] = useState([]); 
    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [selectedGrades, setSelectedGrades] = useState([]); 

    useEffect(() => {
        const fetchMaterials = async() => {
            try {
                const [centralFilesResponse, teacherFilesResponse] = await Promise.all([
                    axios.get(`${IP_ADDRESS}/material-repository/teacher`, state.authHeader),
                    axios.get(`${IP_ADDRESS}/material-repository/teacher/${state.userData.id}`, state.authHeader),
                ]);
                setCentralFiles(centralFilesResponse.data);
                setTeacherFiles(teacherFilesResponse.data);
                console.log("Central files: ", centralFilesResponse.data);
                console.log("Teacher files: ", teacherFilesResponse.data);
                setFilteredResults(centralFilesResponse.data);
            } catch (error) {
                console.error("ResourceRepositoryScreen.js line 94, ", error);
            }
        };
        fetchMaterials();
    }, [state.authHeader, state.userData.id]);
    
    useEffect(() => {
        if (selectedTab == "central") {
            setFilteredResults(applyFilters(centralFiles));
        } 
        if (selectedTab == "teacher") {
            setFilteredResults(applyFilters(teacherFiles));
        }
    }, [files, searchText, selectedTypes, selectedInstruments, selectedGrades, selectedTab]);

    const applyFilters = useCallback((files) => {
        let result = files;

        // Filter by search text
        if (searchText) {
            result = result.filter((file) =>
                file.title.toLowerCase().includes(searchText.toLowerCase())
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
        setFilteredResults(result);

        return result;
    }, [searchText, selectedTypes, selectedInstruments, selectedGrades]);

    useEffect(() => {
        let source = selectedTab == "central" ? centralFiles : teacherFiles;
        setFilteredResults(applyFilters(source));
    }, [centralFiles, teacherFiles, applyFilters, selectedTab]);

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const RepoFile = ({ title, instrument, type, grade, fileLink, creationTime, status }) => {
        return (
        <TouchableOpacity style={styles.item}>
            <View style={styles.itemImageContainer}> 
                {selectedTab === "teacher" && <View style={styles.statusHeader}>
                    <Ionicons
                        name={status === 'Approved' ? "checkmark-circle" : status === 'Rejected' ? "close-circle" : "timer"}
                        size={30}
                        color={status === 'Approved' ? Colors.accentGreen : status === 'Rejected' ? Colors.accentRed : Colors.accentBlue}
                        style={styles.statusLogo}
                    />
                </View>}
                <Image
                    source={{ uri: fileLink }}
                    style={styles.itemImage}
                    resizeMode="cover"
                />
            </View>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.date}>{creationTime.slice(0, 10)}</Text>
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
                <ScrollView horizontal={true}> 
                    <View style={styles.dropdownContainer}> 
                        <TypeCategoryDropdown onCategoryChange={setSelectedTypes}/>
                        <InstrumentCategoryDropdown onCategoryChange={setSelectedInstruments}/>
                        <GradeCategoryDropdown onCategoryChange={setSelectedGrades}/>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    {filteredResults?.length ? filteredResults.length : 0} Files Found
                </Text>
                <TouchableOpacity style={[selectedTab === "central" ? styles.pressedNavigationBtn : styles.navigationBtn, { width: width/4 }]} onPress={() => setSelectedTab("central")}>
                    <Text style={selectedTab === "central" ? styles.pressedNavigationText : styles.navigationText}>Central</Text>
                </TouchableOpacity>
                <TouchableOpacity style={selectedTab === "teacher" ? styles.pressedNavigationBtn : styles.navigationBtn} onPress={() => setSelectedTab("teacher")}>
                    <Text style={selectedTab === "teacher" ? styles.pressedNavigationText : styles.navigationText}>My Resources</Text>
                </TouchableOpacity>
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
export default ResourceRepositoryScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    width: "100%",
    height: "100%",
    flex: 1,
  },
  shadowContainer: {
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 15, // Optional: If you want some space inside the container
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
    marginVertical: 0,
    overflow: 'hidden',
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
        marginVertical: 0
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
        paddingHorizontal: 18,
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
    navigationRow:{
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center', 
        width: '100%',
    },
    navigationBtn:{
        padding: 8,
        backgroundColor: Colors.accentGrey,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: width/3,
        marginHorizontal: 3
    },
    pressedNavigationBtn:{
        padding: 8,
        backgroundColor: Colors.mainPurple,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignSelf: 'center',
        width: width/3,
        marginHorizontal: 3
    },
    navigationText:{
        fontSize: 12,
        color: Colors.fontSecondary
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
    pressedNavigationText:{
        fontSize: 12,
        color: Colors.bgWhite
    }
});