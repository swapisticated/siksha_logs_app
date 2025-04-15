import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const LogsList = ({ logs, loading, currentTheme, selectedDate }) => {
  const renderItem = ({ item }) => {
    let date;
    if (item.timestamp && typeof item.timestamp.toDate === 'function') {
      date = item.timestamp.toDate();
    } else if (item.timestamp && item.timestamp.seconds) {
      date = new Date(item.timestamp.seconds * 1000);
    } else {
      date = new Date();
    }
    
    return (
      <View style={[
        styles.logItem, 
        { backgroundColor: 'rgba(227, 144, 111, 0.18)' }
      ]}>
        <View style={styles.logHeader}>
          <Text style={[styles.timestamp, { color: currentTheme.textSecondary }]}>
            {moment(date).format('dddd, MMMM Do, YYYY • HH:mm:ss')}
          </Text>
        </View>
        <Text style={[styles.message, { color: currentTheme.text }]}>
          {item.message || 'No message'}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.noLogsContainer}>
            <MaterialCommunityIcons 
              name="text-box-outline"
              size={48} 
              color={currentTheme.textSecondary}
            />
            <Text style={[styles.noLogs, { color: currentTheme.textSecondary }]}>
              No logs found for {moment(selectedDate).format('MMM DD, YYYY')}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  logItem: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 13,
    fontWeight: '500',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  noLogsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
  },
  noLogs: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LogsList;
