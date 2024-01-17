import {View, Text, TextInput, StyleSheet} from 'react-native';
function CreateAssignmentScreen({  }){
    return (
        <View style={styles.container}>
            <Text>Create Assignment</Text>
        </View>
    )
};
export default CreateAssignmentScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginTop: 100,
        alignItems: 'center',
    }
})