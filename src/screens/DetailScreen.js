import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, Button, TextInput, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DetailScreen = ({ route, navigation }) => {
  const { pond } = route.params;
  const [measures, setMeasures] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [note, setNote] = useState('');

  // State cho các field update Pond
  const [pondName, setPondName] = useState(pond.pondName || '');
  const [volume, setVolume] = useState(pond.volume ? pond.volume.toString() : '');
  const [depth, setDepth] = useState(pond.depth ? pond.depth.toString() : '');
  const [drainCount, setDrainCount] = useState(pond.drainCount ? pond.drainCount.toString() : '');
  const [skimmerCount, setSkimmerCount] = useState(pond.skimmerCount ? pond.skimmerCount.toString() : '');
  const [pumpCapacity, setPumpCapacity] = useState(pond.pumpCapacity ? pond.pumpCapacity.toString() : '');
  const [imgUrl, setImgUrl] = useState(pond.imgUrl || '');
  const [status, setStatus] = useState(pond.status || 'ACTIVE');
  const [isQualified, setIsQualified] = useState(pond.isQualified !== undefined ? pond.isQualified : true);

  // Fetch các measures với pondId
  const fetchMeasures = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/measurements', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredMeasures = response.data.data.filter(measure => measure.pondId === pond.id);
      setMeasures(filteredMeasures);
    } catch (error) {
      console.error('Error fetching measures:', error);
    }
  };

  useEffect(() => {
    fetchMeasures();
  }, []);

  // Xử lý xóa Pond
  const handleDeletePond = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.delete(`https://koifishproject-production.up.railway.app/api/ponds/${pond.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Pond deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting pond:', error);
      Alert.alert('Error', 'Failed to delete pond.');
    }
  };

  const confirmDeletePond = () => {
    Alert.alert(
      'Delete Pond',
      'Are you sure you want to delete this pond?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: handleDeletePond },
      ]
    );
  };

  // Xử lý tạo mới Measure
  const handleCreateMeasure = async () => {
    const token = await AsyncStorage.getItem('token');
    const measureData = {
      pondId: pond.id,
      measureData: [],
      measureOn: new Date().toISOString(),
      note: note,
    };

    try {
      await axios.post('https://koifishproject-production.up.railway.app/api/measurements', measureData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Measure created successfully!');
      setModalVisible(false);
      setNote('');
      fetchMeasures();
    } catch (error) {
      console.error('Error creating measure:', error);
      Alert.alert('Error', 'Failed to create measure.');
    }
  };

  // Xử lý cập nhật Pond
  const handleUpdatePond = async () => {
    const token = await AsyncStorage.getItem('token');
    const updatedPondData = {
      pondName,
      volume: parseFloat(volume),
      depth: parseFloat(depth),
      drainCount: parseInt(drainCount),
      skimmerCount: parseInt(skimmerCount),
      pumpCapacity: parseInt(pumpCapacity),
      imgUrl,
      status,
      isQualified,
      koi: pond.koi,
      measurements: pond.measurements,
      userId: pond.userId,
    };

    try {
      await axios.put(`https://koifishproject-production.up.railway.app/api/ponds/${pond.id}`, updatedPondData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Pond updated successfully!');
      setUpdateModalVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating pond:', error);
      Alert.alert('Error', 'Failed to update pond.');
    }
  };

  const navigateToMeasureDataScreen = (measureId) => {
    navigation.navigate('MeasureDataScreen', { measureId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{pond.pondName}</Text>
        <TouchableOpacity onPress={confirmDeletePond} style={styles.deleteIcon}>
          <Icon name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: pond.imgUrl }} style={styles.image} />
      <Text>Volume: {pond.volume}</Text>
      <Text>Depth: {pond.depth}</Text>
      <Text>Drain Count: {pond.drainCount}</Text>
      <Text>Skimmer Count: {pond.skimmerCount}</Text>
      <Text>Pump Capacity: {pond.pumpCapacity}</Text>

      <Button title="Update Pond" onPress={() => setUpdateModalVisible(true)} />
      <Button title="Create Measure" onPress={() => setModalVisible(true)} />

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Measure</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter note"
              value={note}
              onChangeText={setNote}
            />
            <Button title="Save Measure" onPress={handleCreateMeasure} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={isUpdateModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Pond</Text>
            <TextInput style={styles.input} placeholder="Pond Name" value={pondName} onChangeText={setPondName} />
            <TextInput style={styles.input} placeholder="Volume" value={volume} onChangeText={setVolume} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Depth" value={depth} onChangeText={setDepth} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Drain Count" value={drainCount} onChangeText={setDrainCount} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Skimmer Count" value={skimmerCount} onChangeText={setSkimmerCount} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Pump Capacity" value={pumpCapacity} onChangeText={setPumpCapacity} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Image URL" value={imgUrl} onChangeText={setImgUrl} />
            <TextInput style={styles.input} placeholder="Status" value={status} onChangeText={setStatus} />
            <TextInput style={styles.input} placeholder="Is Qualified" value={isQualified ? 'true' : 'false'} onChangeText={(val) => setIsQualified(val === 'true')} />

            <Button title="Save Pond" onPress={handleUpdatePond} />
            <Button title="Cancel" onPress={() => setUpdateModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Text style={styles.measureListTitle}>Measures:</Text>
      <FlatList
        data={measures}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToMeasureDataScreen(item.id)}>
            <View style={styles.measureItem}>
              <Text>Date: {new Date(item.measureOn).toLocaleString()}</Text>
              <Text>Note: {item.note}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.measureListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  deleteIcon: {
    paddingHorizontal: 10,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  measureListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  measureListContainer: {
    paddingBottom: 20,
  },
  measureItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default DetailScreen;
