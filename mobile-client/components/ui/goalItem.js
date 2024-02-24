import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GoalItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  if (item === 'empty') {
    return null; // or a View component with a message
  }

  return (
    <View>
    <TouchableOpacity style={[styles.itemContainer, styles.cell, styles.title]} onPress={() => setExpanded(!expanded)}>
        <View>
            <Text>{item.title}</Text>
        </View>
        <View style={[styles.cell, styles.points]}>
            <Text>{`${item.points} Points`}</Text>
        </View>
        <View style={[styles.cell, styles.status]}>
            <Text>{item.status}</Text>
        </View>
        <Ionicons name={expanded ? "chevron-up-outline" : "chevron-down-outline"} size={24} color="black" />
    </TouchableOpacity>
      {expanded && item.goalChecklist && item.goalChecklist.length > 0 && (
        <View style={styles.checklistContainer}>
          {item.goalChecklist.map((checkItem, index) => (
            <Text key={index} style={styles.checklistItem}>{checkItem}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderColor: '#E7E7E7',
      backgroundColor: '#fff',
      marginHorizontal: 15,
    },
    cell: {
      flex: 1,
      paddingHorizontal: 10,
    },
    title: {
      flex: 2,
      alignContent: 'left',
    },
    points: {
      flex: 1,
      alignContent: 'center',
    },
    status: {
      flex: 1,
        alignContent: 'right',
    },
    checklistContainer: {
      padding: 16,
      backgroundColor: '#F0F0F0',
    },
    checklistItem: {
      fontSize: 14,
      color: '#333',
    },
});

export default GoalItem;
