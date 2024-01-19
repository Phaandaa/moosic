import {useState} from 'react';
import { View } from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';

function CreateAssignmentScreen({  }){
    // function assignmentNameChangedHandler(){}
    return (
        <View style={theme.container}>
            <AnimatedPlaceholderInput 
                placeholder="Assignment Name" 
                secureTextEntry={false} 
                textInputConfig={{autoCapitalize: 'words'}}>
            </AnimatedPlaceholderInput>

            <AnimatedPlaceholderInput 
                placeholder="Description" 
                secureTextEntry={false} 
                textInputConfig={{multiline: true}}>
            </AnimatedPlaceholderInput>

            <AnimatedPlaceholderInput 
                placeholder="Deadline (DD-MM-YYYY)" 
                secureTextEntry={false} 
                textInputConfig={{ 
                    maxLength: 10
                }}>
            </AnimatedPlaceholderInput>
            
            {/* <Input label="Assignment Name" textInputConfig={{
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
            }}/> */}
        </View>
        
    )
};
export default CreateAssignmentScreen;

// const styles = StyleSheet.create({
//     container:{
//         flex: 1,
//         marginTop: 100,
//         alignItems: 'center',
//     }
// })