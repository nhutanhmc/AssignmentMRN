import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TextInput, Alert, TouchableOpacity, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';

const KoiListScreen = ({ route, navigation }) => {
  const { pondId } = route.params;
  const [kois, setKois] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('MALE');
  const [category, setCategory] = useState('');
  const [inPondSince, setInPondSince] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [origin, setOrigin] = useState('');
  const [breed, setBreed] = useState('');
  const [length, setLength] = useState('');

  useEffect(() => {
    const fetchKois = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get('https://koifishproject-production.up.railway.app/api/kois', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pondKois = response.data.data.filter(koi => koi.pondId === pondId);
        setKois(pondKois);
      } catch (error) {
        console.error('Error fetching kois:', error);
      }
    };
    fetchKois();
  }, [pondId]);

  const handleCreateKoi = async () => {
    const token = await AsyncStorage.getItem('token');
    const koiData = {
      pondId,
      name,
      age: parseInt(age),
      sex,
      category,
      inPondSince,
      purchasePrice: parseFloat(purchasePrice),
      status: "ACTIVE",
      imgUrl,
      origin,
      breed,
      koiRecords: [],
      feedingSchedules: [],
      length,
    };

    try {
      await axios.post('https://koifishproject-production.up.railway.app/api/kois', koiData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalVisible(false);
      Alert.alert('Success', 'Koi created successfully!');
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/kois', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pondKois = response.data.data.filter(koi => koi.pondId === pondId);
      setKois(pondKois);
    } catch (error) {
      console.error('Error creating koi:', error);
      Alert.alert('Error', 'Failed to create koi.');
    }
  };

  const handleViewDetail = (koi) => {
    navigation.navigate('KoiDetail', { koi });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={kois}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.koiItem}>
            <Text style={styles.koiName}>{item.name}</Text>
            <Image source={{ uri: item.imgUrl }} style={styles.image} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.detailButton} onPress={() => handleViewDetail(item)}>
                <Text style={styles.buttonText}>Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button title="Create Koi" onPress={() => setModalVisible(true)} />

      {/* Modal for creating koi */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Koi</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            
            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
            
            <Text style={styles.label}>Sex</Text>
            <Picker selectedValue={sex} onValueChange={setSex} style={styles.picker}>
              <Picker.Item label="MALE" value="MALE" />
              <Picker.Item label="FEMALE" value="FEMALE" />
              <Picker.Item label="NOT_SPECIFIED" value="NOT_SPECIFIED" />
            </Picker>

            <Text style={styles.label}>Category</Text>
            <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
            
            <Text style={styles.label}>In Pond Since (yyyy-mm-dd)</Text>
            <TextInput style={styles.input} placeholder="In Pond Since" value={inPondSince} onChangeText={setInPondSince} />

            <Text style={styles.label}>Purchase Price</Text>
            <TextInput style={styles.input} placeholder="Purchase Price" value={purchasePrice} onChangeText={setPurchasePrice} keyboardType="numeric" />
            
            <Text style={styles.label}>Image URL</Text>
            <TextInput style={styles.input} placeholder="Image URL" value={imgUrl} onChangeText={setImgUrl} />
            
            <Text style={styles.label}>Origin</Text>
            <TextInput style={styles.input} placeholder="Origin" value={origin} onChangeText={setOrigin} />
            
            <Text style={styles.label}>Breed</Text>
            <TextInput style={styles.input} placeholder="Breed" value={breed} onChangeText={setBreed} />
            
            <Text style={styles.label}>Length</Text>
            <TextInput style={styles.input} placeholder="Length" value={length} onChangeText={setLength} keyboardType="numeric" />
            
            <Button title="Create Koi" onPress={handleCreateKoi} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  koiItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  koiName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    height: 100,
    width: '100%',
    borderRadius: 10,
    marginTop: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 12,
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  detailButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default KoiListScreen;
