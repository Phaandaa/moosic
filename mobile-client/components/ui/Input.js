import { Text, TextInput, View, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
function Input({label, textInputConfig}){
    return (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput style={styles.input} {...textInputConfig}/>
    </View>
    );
}
export default Input;

const styles = StyleSheet.create({
    inputContainer: {
        marginHorizonal: 4, 
        marginVertical: 8
    }, 
    label: {
        fontSize: 12, 
        color: Colors.primary500,
        marginBottom: 4
    },
    input: {
        backgroundColor: Colors.primary500,
        color: Colors.primary700,
        padding: 6,
        borderRadius: 6,
        fontSize: 18,
    //     height: 40,
    // borderColor: 'gray',
    // borderWidth: 1,
    // marginBottom: 20,
    }
})