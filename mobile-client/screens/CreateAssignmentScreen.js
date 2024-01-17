import {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
function CreateAssignmentScreen({  }){
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentDesc, setAssignmentDesc] = useState('');

    return (
        <View style={styles.container}>
            <Text>Create Assignment</Text>
            <TextInput
                placeholder="Assignment Name"
                value={assignmentName}
                onChangeText={setAssignmentName}
            />
            <TextInput
                placeholder="Description"
                value={assignmentDesc}
                onChangeText={setAssignmentDesc}
            />
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