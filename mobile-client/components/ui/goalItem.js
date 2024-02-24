
import React, { useState } from 'react';
import { View, Text, TouchableOpacity  } from 'react-native';

const GoalItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false);
  
    return (
      <View>
        <TouchableOpacity style={styles.itemContainer} onPress={() => setExpanded(!expanded)}>
          <Text style={[styles.cell, styles.title]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.cell, styles.points]}>{item.points} Points</Text>
          <Text style={[styles.cell, styles.status]}>{item.status}</Text>
        </TouchableOpacity>
        {expanded && item.goalChecklist && item.goalChecklist.length > 0 && (
          <View style={styles.checklistContainer}>
            {item.goalChecklist.map((checkItem, index) => (
              <Text key={index} style={styles.checklistItem}>
                {checkItem}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  export default GoalItem;
  