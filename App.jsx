import React, {useState, useEffect} from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ActivityIndicator, 
  ScrollView, 
  StyleSheet,
  TouchableOpacity,
  Animated,
  useColorScheme,
  Modal,
  BackHandler,
  Platform,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Example with Material 
import LandingScreen from './components/LandingScreen';

function App() {
  // System hooks first
  const systemColorScheme = useColorScheme();
  
  // State hooks
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [datesWithLogs, setDatesWithLogs] = useState(new Set());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCollections, setShowCollections] = useState(false);

  // Animation hooks
  const [calendarAnimation] = useState(new Animated.Value(0));
  const [screenAnimation] = useState(new Animated.Value(0));
  const [calendarHeight] = useState(new Animated.Value(0));
  const [collectionsHeight] = useState(new Animated.Value(0));

  // Add collections array
  const collections = [
    'YFS_Shiksha',
    'Demo_Shiksha',
    'YFS_Pilot_1',
    'YFS_Pilot_2',
 
    // Add more collections as needed
  ];

  // Theme definition
  const theme = {
    light: {
      background: '#FFFFFF',
      glass: 'rgba(255, 255, 255, 0.95)',
      border: 'rgba(45, 38, 64, 0.08)',
      text: '#2D2640',
      textSecondary: 'rgba(45, 38, 64, 0.75)',
      glassBackground: 'rgba(255, 255, 255, 0.95)',
      pill: {
        background: 'rgba(247, 144, 111, 0.1)',
        shadow: 'transparent',
      },
      calendar: {
        selected: '#E3906F',
        text: '#2D2640',
        textSelected: '#FFFFFF',
        highlight: '#FFA500'
      }
    },
    dark: {
      background: '#000000',
      glass: 'rgba(255, 255, 255, 0.12)',
      border: 'rgba(255, 255, 255, 0.12)',
      text: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.75)',
      glassBackground: 'rgba(255, 255, 255, 0.12)',
      pill: {
        background: 'rgba(227, 144, 111, 0.1)',
        shadow: 'transparent',
      },
      calendar: {
        selected: '#E3906F',
        text: 'rgba(255, 255, 255, 0.9)',
        textSelected: '#FFFFFF',
        highlight: '#FFA500'
      }
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const onDateChange = (date) => {
    setSelectedDate(date);
    fetchLogs(date);
  };

  const fetchLogs = async (date) => {
    if (!selectedCollection) return;
    
    try {
      setLoading(true);
      let query = firestore().collection(selectedCollection);
      
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        query = query
          .where('timestamp', '>=', startOfDay)
          .where('timestamp', '<=', endOfDay);
      }

      query = query.orderBy('timestamp', 'desc');
      const snapshot = await query.get();
      const fetchedLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthLogs = async (date) => {
    if (!selectedCollection) return;
    
    try {
      const currentDate = date || new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const snapshot = await firestore()
        .collection(selectedCollection)
        .where('timestamp', '>=', startOfMonth)
        .where('timestamp', '<=', endOfMonth)
        .get();

      const dates = new Set();
      snapshot.docs.forEach(doc => {
        const timestamp = doc.data().timestamp;
        if (timestamp) {
          const date = timestamp.toDate();
          dates.add(date.toDateString());
        }
      });
      
      setDatesWithLogs(dates);
    } catch (error) {
      console.error('Error fetching month logs:', error);
    }
  };

  const renderLog = (log) => {
    const date = log.timestamp 
      ? new Date(log.timestamp.seconds * 1000)
      : new Date();

    return (
      <View key={log.id} style={styles.logItem}>
        <Text style={styles.timestamp}>
          {moment(date).format('MM/DD/YYYY HH:mm:ss')}
        </Text>
        <Text style={styles.message}>{log.message || 'No message'}</Text>
      </View>
    );
  };

  useEffect(() => {
    if (!selectedCollection) return;
    
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const snapshot = await firestore()
          .collection(selectedCollection)
          .where('timestamp', '>=', startOfDay)
          .where('timestamp', '<=', endOfDay)
          .orderBy('timestamp', 'desc')
          .get();

        const fetchedLogs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setLogs(fetchedLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [selectedDate, selectedCollection]);

  useEffect(() => {
    if (!selectedCollection) return;
    
    fetchMonthLogs();
  }, [selectedCollection]);

  const toggleCalendar = () => {
    Animated.spring(calendarHeight, {
      toValue: showCalendar ? 0 : 1,
      useNativeDriver: false,
      friction: 12,
      tension: 40,
    }).start();
    setShowCalendar(!showCalendar);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleCollections = () => {
    Animated.spring(collectionsHeight, {
      toValue: showCollections ? 0 : 1,
      useNativeDriver: false,
      friction: 12,
      tension: 40,
    }).start();
    setShowCollections(!showCollections);
  };

  const handleCollectionSelect = (collection) => {
    Animated.sequence([
      Animated.timing(screenAnimation, {
        toValue: -1,  // Slide left
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(screenAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
    
    setSelectedCollection(collection);
    fetchLogs();
  };

  const handleBack = () => {
    Animated.sequence([
      Animated.timing(screenAnimation, {
        toValue: 1,  // Slide right
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(screenAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
    
    setSelectedCollection(null);
  };

  useEffect(() => {
    const backAction = () => {
      if (selectedCollection) {
        setSelectedCollection(null);
        return true; // Prevent default back action
      }
      return false; // Let default back action happen
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [selectedCollection]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {!selectedCollection ? (
        <LandingScreen 
          onSelectCollection={(collection) => {
            setSelectedCollection(collection);
            fetchLogs();
          }}
          currentTheme={currentTheme}
        />
      ) : (
        <View style={styles.container}>
          <Animated.View style={[
            styles.headerContainer,
            {
              backgroundColor: currentTheme.glass,
              height: Animated.add(
                calendarHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [70, 400],
                }),
                collectionsHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, collections.length * 60],
                })
              ),
            }
          ]}>
            <View style={styles.headerContent}>
              <TouchableOpacity 
                style={styles.dateSection} 
                onPress={toggleCalendar}
              >
                <MaterialCommunityIcons name="calendar" size={16} color={currentTheme.text} />
                <Text style={[styles.dateText, { color: currentTheme.text }]}>
                  {selectedDate ? moment(selectedDate).format('MMM DD, YYYY') : currentDate}
                </Text>
                <MaterialCommunityIcons 
                  name={showCalendar ? "chevron-up" : "chevron-down"} 
                  size={12} 
                  color={currentTheme.text} 
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.dropdownButton} 
                onPress={toggleCollections}
              >
                <Text style={[styles.dropdownButtonText, { color: currentTheme.text }]} numberOfLines={1}>
                  {selectedCollection}
                </Text>
                <MaterialCommunityIcons 
                  name={showCollections ? "chevron-up" : "chevron-down"} 
                  size={12} 
                  color={currentTheme.text} 
                />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.themeToggle} 
                onPress={toggleTheme}
              >
                <MaterialCommunityIcons 
                  name={isDarkMode ? "weather-sunny" : "weather-night"} 
                  size={16} 
                  color={currentTheme.text} 
                />
              </TouchableOpacity>
            </View>

            <Animated.View style={[
              styles.collectionsWrapper,
              {
                opacity: collectionsHeight,
                height: collectionsHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, collections.length * 52],
                }),
              }
            ]}>
              {showCollections && (
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {collections.map((collection) => (
                    <TouchableOpacity
                      key={collection}
                      style={[styles.collectionItem, {
                        backgroundColor: collection === selectedCollection 
                          ? currentTheme.calendar.selected 
                          : 'transparent'
                      }]}
                      onPress={() => {
                        setSelectedCollection(collection);
                        toggleCollections();
                      }}
                    >
                      <Text style={[styles.collectionItemText, { 
                        color: currentTheme.text,
                        fontWeight: collection === selectedCollection ? '600' : '400'
                      }]}>
                        {collection}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </Animated.View>

            <Animated.View style={[
              styles.calendarWrapper,
              {
                opacity: calendarHeight,
                height: calendarHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 330],
                }),
              }
            ]}>
              {showCalendar && (
                <CalendarPicker
                  onDateChange={onDateChange}
                  onMonthChange={fetchMonthLogs}
                  customDatesStyles={(date) => {
                    if (!date) return null;
                    const dateString = new Date(date.toString()).toDateString();
                    const hasLogs = datesWithLogs.has(dateString);
                    const isSelected = selectedDate && 
                      new Date(date.toString()).toDateString() === new Date(selectedDate.toString()).toDateString();
                    const isToday = new Date(date.toString()).toDateString() === new Date().toDateString();
                    
                    return {
                      containerStyle: {
                        position: 'relative',
                      },
                      textStyle: {
                        color: isSelected ? '#ffffff' : (hasLogs ? '#ffffff' : currentTheme.calendar.text),
                        fontWeight: (isSelected || hasLogs || isToday) ? '600' : '400',
                        position: 'relative',
                        zIndex: 1,
                        fontSize: 14,
                      },
                      style: {
                        position: 'absolute',
                        backgroundColor: isSelected ? '#E3906F' : (hasLogs ? '#4ade80' : (isToday ? 'rgba(96, 165, 250, 0.15)' : 'transparent')),
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        top: '50%',
                        left: '50%',
                        transform: [
                          { translateX: -16 },
                          { translateY: -16 }
                        ],
                      }
                    };
                  }}
                  selectedDayStyle={{}}
                  textStyle={{ 
                    color: currentTheme.calendar.text,
                    fontSize: 14,
                    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                  }}
                  selectedDayTextStyle={{ 
                    color: currentTheme.calendar.textSelected,
                    fontWeight: '600',
                  }}
                  monthTitleStyle={{
                    color: currentTheme.text,
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                  yearTitleStyle={{
                    color: currentTheme.text,
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                  previousComponent={
                    <MaterialCommunityIcons 
                      name="chevron-left" 
                      size={24} 
                      color={currentTheme.text}
                      style={{ padding: 8 }}
                    />
                  }
                  nextComponent={
                    <MaterialCommunityIcons 
                      name="chevron-right" 
                      size={24} 
                      color={currentTheme.text}
                      style={{ padding: 8 }}
                    />
                  }
                  dayLabelsWrapper={{
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                  }}
                  weekdays={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                  weekdaysStyle={{
                    color: currentTheme.textSecondary,
                    fontSize: 12,
                    fontWeight: '500',
                  }}
                  width={380}
                  style={{
                    alignSelf: 'center',
                    width: '100%',
                    paddingTop: 8,
                  }}
                />
              )}
            </Animated.View>
          </Animated.View>

          <ScrollView 
            style={styles.logsContainer} 
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={currentTheme.text} />
                <Text style={[styles.loadingText, { color: currentTheme.textSecondary }]}>
                  Loading logs...
                </Text>
              </View>
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <View 
                  key={log.id} 
                  style={[
                    styles.logItem, 
                    { 
                      backgroundColor: currentTheme.pill.background,
                      shadowColor: currentTheme.pill.shadow,
                    }
                  ]}
                >
                  <View style={styles.logHeader}>
                    <Text style={[styles.timestamp, { color: currentTheme.textSecondary }]}>
                      {moment(log.timestamp.toDate()).format('hh:mm A')}
                    </Text>
                    <View style={[styles.dot, { backgroundColor: currentTheme.textSecondary }]} />
                  </View>
                  <Text style={[styles.message, { color: currentTheme.text }]}>
                    {log.message || 'No message'}
                  </Text>
                </View>
              ))
            ) : (
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
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  calendarWrapper: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 12,
    gap: 8,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  themeToggle: {
    padding: 8,
    marginLeft: 12,
  },
  logsContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 2,

    padding: 16,
  },
  logItem: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
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
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginLeft: 8,
    opacity: 0.5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
  collectionsWrapper: {
    overflow: 'hidden',
    paddingHorizontal: 12,
    height: 200,
  },
  collectionItem: {
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
  },
  collectionItemText: {
    fontSize: 14,
  },
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hasLogsIndicator: {
    backgroundColor: 'rgba(96, 165, 250, 0.2)', // Light blue background
  },
  noLogsIndicator: {
    backgroundColor: 'transparent',
  },
  selectedDay: {
    backgroundColor: 'transparent',
  },
  selectedDayIndicator: {
    backgroundColor: '#60A5FA', // Solid blue for selected date
  },
  dayText: {
    fontSize: 14,
    fontWeight: '400',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default App;

