import {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import InstructionText from '../components/ui/InstructionText';
import Input from '../components/Input';

function CreateAssignmentScreen({  }){
    // const [assignmentName, setAssignmentName] = useState('');
    // const [assignmentDesc, setAssignmentDesc] = useState('');
    function assignmentNameChangedHandler(){}

    return (
        <View>
            <Input label="Assignment Name" textInputConfig={{
                // keyboardType: 'decimal-pad',
                autoCapitalize: 'words',
                onChangeText:assignmentNameChangedHandler,
            }} />
            <Input label="Description" textInputConfig={{
                multiline: true,
                // autocorrect: false // default is true
            }}/>
            <Input label="Deadline" textInputConfig={{
                placeholder: 'DD-MM-YYYY',
                maxLength: 10,
                onChangeText: () => {}
            }}/>
        </View>
        // <View style={styles.container}>
        //     <Text>Create Assignment</Text>
        //     <InstructionText>Assignment Name:</InstructionText>
        //     <TextInput
        //         // placeholder="Assignment Name"
        //         value={assignmentName}
        //         onChangeText={setAssignmentName}
        //     />
        //     <InstructionText>Description:</InstructionText>
        //     <TextInput
        //         // placeholder="Description"
        //         value={assignmentDesc}
        //         onChangeText={setAssignmentDesc}
        //     />
        //     <InstructionText>Assignment Deadline:</InstructionText>
        //     <TextInput
        //         // placeholder="Deadline"
        //         value={assignmentDeadline}
        //         onChangeText={setAssignmentDeadline}
        //     />

        //     // attach files from Google Drive or own device
        //     // assign students to assignment
        // </View>
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