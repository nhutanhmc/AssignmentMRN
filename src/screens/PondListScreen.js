import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Button, Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

const PondListScreen = ({ navigation }) => {
  const [ponds, setPonds] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  // State for modal and pond data
  const [pondName, setPondName] = useState('');
  const [volume, setVolume] = useState('');
  const [depth, setDepth] = useState('');
  const [drainCount, setDrainCount] = useState('');
  const [skimmerCount, setSkimmerCount] = useState('');
  const [pumpCapacity, setPumpCapacity] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const fetchPonds = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = JSON.parse(await AsyncStorage.getItem('user'));

    try {
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/ponds', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userPonds = response.data.data.filter(pond => pond.userId === user.id);
      setPonds(userPonds);
    } catch (error) {
      console.error('Error fetching ponds:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPonds();
    }, [])
  );

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
      setModalVisible(false);
      fetchPonds();
      Alert.alert('Success', 'Pond created successfully!');
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
              <Button
                title="View Koi"
                icon={<Icon name="fish" type="material-community" color="white" />}
                buttonStyle={styles.viewKoiButton}
                onPress={() => navigation.navigate('KoiList', { pondId: item.id })}
              />
              <Button
                title="View Details"
                icon={<Icon name="information" type="material-community" color="white" />}
                buttonStyle={styles.viewDetailsButton}
                onPress={() => navigation.navigate('Detail', { pond: item })}
              />
            </View>
          </View>
        )}
      />
      <Button title="Create Pond" onPress={() => setModalVisible(true)} />
      {/* Modal for creating pond */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          {/* Form fields for creating pond */}
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
    marginBottom: 10,
  },
  pondName: {
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewKoiButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  viewDetailsButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default PondListScreen;
