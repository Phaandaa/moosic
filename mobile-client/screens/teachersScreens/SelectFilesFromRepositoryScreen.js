import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
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
import { useAuth } from "../../context/Authcontext";
import axios from "axios";


const { width } = Dimensions.get("window");

function SelectFilesFromRepositoryScreen({ navigation, route }) {

    const { state } = useAuth();
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [userData, setUserData] = useState({});
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [selectedTypes, setSelectedTypes] = useState([]); 
    const [selectedInstruments, setSelectedInstruments] = useState([]);
    const [selectedGrades, setSelectedGrades] = useState([]); 

    const selectedRepoFiles = route.params?.selectedRepoFiles;

    useEffect(() => {
        if (selectedRepoFiles) {
          console.log(selectedRepoFiles);
          setSelectedFiles(selectedRepoFiles);
        } else {
          console.log("No files selected or navigated from another screen");
        }
    }, [selectedRepoFiles]);



    useEffect(() => {
        const fetchMaterials = async() => {
            try {
                const [centralFilesResponse] = await Promise.all([
                    axios.get(`${IP_ADDRESS}/material-repository/teacher`, state.authHeader)
                ]);
                setFiles(centralFilesResponse.data);
                setFilteredResults(centralFilesResponse.data);
            } catch (error) {
                console.error("ResourceRepositoryScreen.js line 94, ", error);
            }
        };
        fetchMaterials();
    }, [state.authHeader, state.userData.id]);

    useEffect(() => {
        setFilteredResults(applyFilters(files));
    }, [selectedTypes, selectedGrades, selectedInstruments, files, applyFilters]);

    const toggleSelection = (file) => {
        setSelectedFiles(prevSelected => {
          const isAlreadySelected = prevSelected.some(selectedFile => selectedFile.id === file.id);
          if (isAlreadySelected) {
            return prevSelected.filter(selectedFile => selectedFile.id !== file.id);
          } else {
            return [...prevSelected, file];
          }
        });
    };

    const confirmSelection = () => {
        navigation.navigate('CreateAssignmentScreen', { selectedFiles });
    };


    const applyFilters = useCallback((files) => {
        let result = files;

        if (searchText) {
            result = result.filter((file) =>
                file.title.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (selectedTypes.length > 0) {
            result = result.filter((file) =>
                file.type.some(type => selectedTypes.includes(type.toLowerCase()))
            );
        }
    
        if (selectedInstruments.length > 0) {
            result = result.filter((file) =>
            file.instrument.some(instrument => selectedInstruments.includes(instrument.toLowerCase()))
        )};

        if (selectedGrades.length > 0) {
            result = result.filter((file) =>
            file.grade.some(grade => selectedGrades.includes(grade.toLowerCase()))
        )};
        setFilteredResults(result);

        return result;
    }, [searchText, selectedTypes, selectedInstruments, selectedGrades]);

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const RepoFile = ({ title, instrument, type, grade, fileLink, creationTime, status, id }) => {
        return (
        <TouchableOpacity style={styles.item} onPress={() => toggleSelection({id, title, fileLink})}>
            <View style={styles.itemImageContainer}> 
            <Ionicons
              name={selectedFiles.some(selectedFile => selectedFile.id === id) ? "checkbox" : "checkbox-outline"}
              size={24}
              color={Colors.mainPurple}
              style={styles.checkboxIcon}
            />
                
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
            <View style={styles.confirmButtonContainer}>
                {selectedFiles.length > 0 && <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={confirmSelection}>
                <Text style={styles.buttonText}>Confirm File Selection</Text>
                </TouchableOpacity>}
            </View>
        </View>
    );
};

export default SelectFilesFromRepositoryScreen;
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
  confirmButtonContainer: {
    padding: 15
  },
  button: {
    backgroundColor: Colors.mainPurple,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
        width: width / 2 - 20,
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
        overflow: 'hidden',
        // height: 200
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
        justifyContent: "space-around", 
        alignItems: 'center', 
        marginVertical: 0
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
        paddingHorizontal: 18,
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
    },
    checkboxIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 2
    },
});