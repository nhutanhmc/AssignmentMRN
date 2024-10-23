import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Button, Image, TextInput, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Modal from 'react-native-modal';

const PondListScreen = ({ navigation }) => {
  const [ponds, setPonds] = useState([]);

  // State for modal and pond data
  const [isModalVisible, setModalVisible] = useState(false);
  const [pondName, setPondName] = useState('');
  const [volume, setVolume] = useState('');
  const [depth, setDepth] = useState('');
  const [drainCount, setDrainCount] = useState('');
  const [skimmerCount, setSkimmerCount] = useState('');
  const [pumpCapacity, setPumpCapacity] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    const fetchPonds = async () => {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      try {
        const response = await axios.get('https://koifishproject-production.up.railway.app/api/ponds', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response from API:', response.data);

        const userPonds = response.data.data.filter(pond => pond.userId === user.id);
        setPonds(userPonds);
      } catch (error) {
        console.error('Error fetching ponds:', error);
      }
    };

    fetchPonds();
  }, []);

  const handleCreatePond = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = JSON.parse(await AsyncStorage.getItem('user'));

    const pondData = {
      pondName,
      volume: parseFloat(volume),
      depth: parseFloat(depth),
      drainCount: parseInt(drainCount),
      skimmerCount: parseInt(skimmerCount),
      pumpCapacity: parseInt(pumpCapacity),
      imgUrl,
      status: "ACTIVE",
      isQualified: true,
      koi: [],
      measurements: [],
      userId: user.id,
    };

    try {
      await axios.post('https://koifishproject-production.up.railway.app/api/ponds', pondData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalVisible(false); // Đóng modal

      // Refresh the list of ponds
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/ponds', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userPonds = response.data.data.filter(pond => pond.userId === user.id);
      setPonds(userPonds);
    } catch (error) {
      console.error('Error creating pond:', error);
      Alert.alert('Error', 'Failed to create pond.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ponds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.pondItem}>
            <Text style={styles.pondName}>{item.pondName}</Text>
            <Image source={{ uri: item.imgUrl }} style={styles.image} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('KoiList', { pondId: item.id })}>
                <Text style={styles.button}>View Koi</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Detail', { pond: item })}>
                <Text style={styles.button}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button title="Create Pond" onPress={() => setModalVisible(true)} />

      {/* Modal for creating pond */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Pond Name"
            value={pondName}
            onChangeText={setPondName}
          />
          <TextInput
            style={styles.input}
            placeholder="Volume"
            value={volume}
            onChangeText={setVolume}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Depth"
            value={depth}
            onChangeText={setDepth}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Drain Count"
            value={drainCount}
            onChangeText={setDrainCount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Skimmer Count"
            value={skimmerCount}
            onChangeText={setSkimmerCount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Pump Capacity"
            value={pumpCapacity}
            onChangeText={setPumpCapacity}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={imgUrl}
            onChangeText={setImgUrl}
          />
          <Button title="Create Pond" onPress={handleCreatePond} />
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
  pondItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  pondName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    height: 100,
    width: '100%',
    borderRadius: 10,
    marginTop: 10,
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
});

export default PondListScreen;
