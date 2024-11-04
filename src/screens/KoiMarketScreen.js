// src/screens/KoiMarketScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const KoiMarketScreen = () => {
  const [kois, setKois] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  const fetchKois = async (name = '') => {
    const token = await AsyncStorage.getItem('token');
    const url = `https://koifishproject-production.up.railway.app/api/kois/active${name ? `?name=${name}` : ''}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setKois(response.data.data);
    } catch (error) {
      console.error('Error fetching kois:', error);
    }
  };

  useEffect(() => {
    fetchKois();
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text.trim() === '') {
      fetchKois();
    } else {
      fetchKois(text);
    }
  };

  const handlePressKoi = (koi) => {
    navigation.navigate('KoiPersonDetail', { koi });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Koi by name"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <FlatList
        data={kois}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressKoi(item)}>
            <View style={styles.koiItem}>
              <Text style={styles.koiName}>{item.name}</Text>
              <Image source={{ uri: item.imgUrl }} style={styles.image} />
              <Text>Price: ${item.purchasePrice}</Text>
              <Text>Length: {item.length} cm</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
  },
  koiItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  koiName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    height: 100,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default KoiMarketScreen;
