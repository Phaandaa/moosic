import React from 'react';
import { View, StyleSheet } from 'react-native';

const Box = ({ style, content }) => {
 return <View style={[styles.box, style]}>{content}</View>;
};

const styles = StyleSheet.create({
 box: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 20,
    margin: 10,
 },
});

export default Box;