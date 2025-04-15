import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';
import LogsList from '../components/LogsList.js';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      const fetchLogs = async () => {
        const snapshot = await firestore()
          .collection('YFS_Shiksha')
          .where('date', '==', selectedDate)
          .orderBy('timestamp', 'asc')
          .get();

        const fetchedLogs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(fetchedLogs);
      };
      fetchLogs();
    }
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true } }}
      />
      <Text style={styles.title}>Logs for {selectedDate || 'Select a date'}</Text>
      <LogsList logs={logs} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default HomeScreen;
