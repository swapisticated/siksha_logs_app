import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Predefined collections - replace with your actual collections
const AVAILABLE_COLLECTIONS = [
  'YFS_Shiksha',
  'Demo_Shiksha',
  'YFS_Pilot_1',
  'YFS_Pilot_2',
  // Add more collections here
];

const LandingScreen = ({ onSelectCollection, currentTheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCollections = AVAILABLE_COLLECTIONS.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.collectionItem, { backgroundColor: currentTheme.pill.background }]}
      onPress={() => onSelectCollection(item)}
    >
      <MaterialCommunityIcons 
        name="folder-outline" 
        size={24} 
        color={currentTheme.text} 
      />
      <Text style={[styles.collectionName, { color: currentTheme.text }]}>
        {item}
      </Text>
      <MaterialCommunityIcons 
        name="chevron-right" 
        size={24} 
        color={currentTheme.textSecondary} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* <View style={styles.logoContainer}>
        <Image 
          source={require('../components/images/exp.png')} // Update with your image path
          style={styles.logo}
          resizeMode="contain" // Ensures the image is fully visible
        />
      </View> */}
      <View style={[styles.searchContainer, { backgroundColor: currentTheme.pill.background }]}>
        <MaterialCommunityIcons 
          name="magnify" 
          size={24} 
          color={currentTheme.textSecondary} 
        />
        <TextInput
          style={[styles.searchInput, { color: currentTheme.text }]}
          placeholder="Search collections..."
          placeholderTextColor={currentTheme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredCollections}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="folder-search-outline" 
              size={48} 
              color={currentTheme.textSecondary} 
            />
            <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
              No collections found
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  logoContainer: {
    alignItems: 'center', // Center the image horizontally
    marginBottom: 16,
  },
  logo: {
    width: '100%', // Adjust width as needed
    height: 100, // Adjust height as needed
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  listContainer: {
    flexGrow: 1,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  collectionName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default LandingScreen; 