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

    useEffect(() => {
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
            fileName: 'ABRSM Theory.pdf',
            creationTime: '2024-03-21T16:53:25.758+00:00',
            fileLink:'https://storage.googleapis.com/moosicfyp/assignments/d8b061f5-525c-4720-b375-cb040ea8b2e7_IMG_0651.jpg',
            type: ['Theory', 'Sight Reading'],
            instrument: ['Piano', 'Guitar'],
            grade: ['3'],
            status: 'Pending'
        }, {
            id: '2',
            fileName: 'SightReading5.png',
            creationTime: '2024-03-21T16:54:31.761+00:00',
            fileLink:'https://storage.googleapis.com/moosicfyp/assignments/4428ebb0-9309-46c1-bc4f-e914d6c79d83_IMG_0653.jpg',
            type: ['Theory', 'Sight Reading'],
            instrument: ['Piano'],
            grade: ['3'],
            status: 'Approved'
        }, {
            id: '3',
            fileName: 'Defying Gravity.jpg',
            creationTime: '2024-03-21T16:54:31.761+00:00',
            fileLink:'https://storage.googleapis.com/moosicfyp/assignments/40482763-d96c-4b8e-9fb0-0c92f8a57a3e_IMG_1845.jpg',
            type: ['Music Sheet'],
            instrument: ['Violin'],
            grade: ['1'],
            status: 'Rejected'
        }, {
            id: '4',
            fileName: 'Sun and Moon.jpg',
            creationTime: '2024-03-21T16:54:31.761+00:00',
            fileLink:'https://storage.googleapis.com/moosicfyp/assignments/060d391c-d3a4-4adb-aa65-0e4b1933289c_IMG_1846.jpg',
            type: ['Music Sheet'],
            instrument: ['Violin'],
            grade: ['4', '5'],
            status: 'Rejected'
        }];
        
        setFiles(MockFiles);
        setFilteredResults(MockFiles);
        console.log('files: ', files);
    }, []);

    useEffect(() => {
        console.log('files: ', files); 
    }, [files]); 

    useEffect(() => {
        console.log('Filtered Results:', filteredResults);
    }, [filteredResults]);

    const RepoFile = ({ fileName, instrument, type, grade, fileLink, status }) => {
        return (
        <TouchableOpacity style={styles.item}>
            <View style={styles.itemImageContainer}> 
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
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryText}>
                    Types: {type.map((typeItem, index) => (
                        <Text key={'type-' + index} style={styles.categoryTextLight}>
                            {typeItem}{index < type.length - 1 ? ', ' : ''}
                        </Text>
                    ))}
                </Text>
                <Text style={styles.categoryText}>
                    Instruments: {instrument.map((instrumentItem, index) => (
                        <Text key={'instrument-' + index} style={styles.categoryTextLight}>
                            {instrumentItem}{index < instrument.length - 1 ? ', ' : ''}
                        </Text>
                    ))}
                </Text>
                <Text style={styles.categoryText}>
                    Grades: {grade.map((gradeItem, index) => (
                        <Text key={'grade-' + index} style={styles.categoryTextLight}>
                            {gradeItem}{index < grade.length - 1 ? ', ' : ''}
                        </Text>
                    ))}
                </Text>
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
                        <StatusDropdown onCategoryChange={setSelectedStatus}/>
                    </View>
                </ScrollView>
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
        width: width / 2 - 20, 
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
    categoryContainer:{
        margin:10
    },
    categoryText:{
        fontWeight: '600',
        marginBottom: 2
    },
    categoryTextLight:{
        fontWeight: '300'
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
        overflow: 'hidden', 
    },
    itemImage: {
        width: '100%',
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
    filterBar:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dropdownContainer:{
        flexDirection: 'row',
        height: 60,
        marginTop: 10
    },
    selectionCount: {
        textAlign: 'center', 
        color: Colors.fontSecondary, 
        fontSize: 12, 
        marginTop: 4,
        fontWeight: 'bold', 
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
        justifyContent: "space-around", 
        alignItems: 'center', 
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