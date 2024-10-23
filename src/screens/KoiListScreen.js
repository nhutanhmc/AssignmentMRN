import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Button, Image, TextInput, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Modal from 'react-native-modal';

const KoiListScreen = ({ route, navigation }) => {
  const { pondId } = route.params; // Nhận pondId từ params
  const [kois, setKois] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('MALE'); // Mặc định là MALE
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Lọc Koi theo pondId
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalVisible(false); // Đóng modal
      Alert.alert('Success', 'Koi created successfully!'); // Thông báo thành công
      // Refresh the Koi list
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/kois', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const pondKois = response.data.data.filter(koi => koi.pondId === pondId);
      setKois(pondKois);
    } catch (error) {
      console.error('Error creating koi:', error);
      Alert.alert('Error', 'Failed to create koi.');
    }
  };

  const handleViewDetail = (koi) => {
    navigation.navigate('KoiDetail', { koi }); // Điều hướng đến màn hình chi tiết koi
  };

  const handleFeedKoi = (koi) => {
    Alert.alert('Feed Koi', `Feeding ${koi.name}`); // Thay đổi với logic thực tế nếu cần
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
              <TouchableOpacity onPress={() => handleFeedKoi(item)}>
                <Text style={styles.button}>Feed</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleViewDetail(item)}>
                <Text style={styles.button}>Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button title="Create Koi" onPress={() => setModalVisible(true)} />

      {/* Modal for creating koi */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="In Pond Since"
            value={inPondSince}
            onChangeText={setInPondSince}
          />
          <TextInput
            style={styles.input}
            placeholder="Purchase Price"
            value={purchasePrice}
            onChangeText={setPurchasePrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={imgUrl}
            onChangeText={setImgUrl}
          />
          <TextInput
            style={styles.input}
            placeholder="Origin"
            value={origin}
            onChangeText={setOrigin}
          />
          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={breed}
            onChangeText={setBreed}
          />
          <TextInput
            style={styles.input}
            placeholder="Length"
            value={length}
            onChangeText={setLength}
          />
          <Button title="Create Koi" onPress={handleCreateKoi} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
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
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default KoiListScreen;
