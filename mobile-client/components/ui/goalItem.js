import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GoalItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false);
  
    if (item === 'empty') {
      return null;
    }
  
    return (
      <View>
        <TouchableOpacity style={styles.itemContainer} onPress={() => setExpanded(!expanded)}>
          <Text style={[styles.cell, styles.title]}>{item.title}</Text>
          <Text style={[styles.cell, styles.points]}>{`${item.points} Points`}</Text>
          <Text style={[styles.cell, styles.status]}>{item.status}</Text>
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
        paddingHorizontal: 5, // Adjust padding as needed
      },
      title: {
        flex: 2, // Gives title more space
        fontWeight: 'bold',
        fontSize: 16, // Larger font size for title
      },
      points: {
        flex: 1, // Adjust as needed
        // textAlign applies to Text components
      },
      status: {
        flex: 1, // Adjust as needed
        // textAlign applies to Text components
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