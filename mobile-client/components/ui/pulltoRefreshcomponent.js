import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

const PullToRefreshComponent = ({ onRefresh, children }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh(); // Execute the passed refresh function
    } catch (error) {
      console.error('PullToRefreshComponent - Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {children}
    </ScrollView>
  );
};

export default PullToRefreshComponent;
