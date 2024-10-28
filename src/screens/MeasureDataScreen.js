import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MeasureDataScreen = ({ route }) => {
  const { measureId } = route.params;
  const [measureDataList, setMeasureDataList] = useState([]);
  const [unitLists, setUnitLists] = useState({});
  const [volume, setVolume] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUnitModalVisible, setUnitModalVisible] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  
  // State cho dữ liệu Unit
  const [unitName, setUnitName] = useState('');
  const [unitFullName, setUnitFullName] = useState('');
  const [unitValue, setUnitValue] = useState('');
  const [info, setInfo] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [selectedMeasureDataId, setSelectedMeasureDataId] = useState(null);

  const fetchMeasureData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/measure-data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredData = response.data.data.filter(data => data.measurementId === measureId);
      setMeasureDataList(filteredData);

      // Fetch units for each measureData in parallel
      filteredData.forEach((data) => {
        fetchUnits(data.id);
      });
    } catch (error) {
      console.error('Error fetching measure data:', error);
    }
  };

  const fetchUnits = async (measureDataId) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/units', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredUnits = response.data.data.filter(unit => unit.measureData === measureDataId);
      setUnitLists(prev => ({ ...prev, [measureDataId]: filteredUnits }));
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  useEffect(() => {
    fetchMeasureData();
  }, []);

  const handleCreateMeasureData = async () => {
    const token = await AsyncStorage.getItem('token');
    const measureData = {
      measurementId: measureId,
      unitId: [], 
      volume: parseFloat(volume),
    };

    try {
      await axios.post('https://koifishproject-production.up.railway.app/api/measure-data', measureData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Measure data created successfully!');
      setModalVisible(false);
      setVolume('');
      fetchMeasureData();
    } catch (error) {
      console.error('Error creating measure data:', error);
      Alert.alert('Error', 'Failed to create measure data.');
    }
  };

  const handleCreateUnit = async () => {
    const token = await AsyncStorage.getItem('token');
    const unitData = {
      unitName,
      unitFullName,
      unitValue: parseFloat(unitValue),
      info,
      minValue: parseFloat(minValue),
      maxValue: parseFloat(maxValue),
      measureData: selectedMeasureDataId, // ID của measureData mà ta click vào
    };

    try {
      await axios.post('https://koifishproject-production.up.railway.app/api/units', unitData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Unit created successfully!');
      setUnitModalVisible(false);
      fetchUnits(selectedMeasureDataId); // Refresh danh sách Unit sau khi tạo
    } catch (error) {
      console.error('Error creating unit:', error);
      Alert.alert('Error', 'Failed to create unit.');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.createButtonText}>Create Measure Data</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Volume</Text>
            <TextInput
              style={styles.input}
              placeholder="Volume"
              value={volume}
              onChangeText={setVolume}
              keyboardType="numeric"
            />
            <Button title="Save" onPress={handleCreateMeasureData} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <FlatList
        data={measureDataList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.measureDataItem}>
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text>Volume: {item.volume}</Text>
            </TouchableOpacity>
            {expandedId === item.id && (
              <View style={styles.expandedContent}>
                <TouchableOpacity onPress={() => { 
                  setSelectedMeasureDataId(item.id);
                  setUnitModalVisible(true);
                }} style={styles.addUnitButton}>
                  <Icon name="plus" size={16} color="green" />
                  <Text style={styles.addUnitText}> Add Unit</Text>
                </TouchableOpacity>
                
                {/* Danh sách Unit của measureData */}
                <FlatList
                  data={unitLists[item.id] || []}
                  keyExtractor={(unit) => unit.id}
                  renderItem={({ item }) => (
                    <View style={styles.unitItem}>
                      <Text>Name: {item.unitName} - Full Name: {item.unitFullName}</Text>
                      <Text>Info: {item.info}</Text>
                      <Text>Min: {item.minValue} - Max: {item.maxValue}</Text>
                      <Text>Value: {item.unitValue}</Text>
                    </View>
                  )}
                />
              </View>
            )}
          </View>
        )}
      />

      <Modal visible={isUnitModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Unit</Text>
            <TextInput style={styles.input} placeholder="Unit Name" value={unitName} onChangeText={setUnitName} />
            <TextInput style={styles.input} placeholder="Full Name" value={unitFullName} onChangeText={setUnitFullName} />
            <TextInput style={styles.input} placeholder="Value" value={unitValue} onChangeText={setUnitValue} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Info" value={info} onChangeText={setInfo} />
            <TextInput style={styles.input} placeholder="Min Value" value={minValue} onChangeText={setMinValue} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Max Value" value={maxValue} onChangeText={setMaxValue} keyboardType="numeric" />
            <Button title="Save" onPress={handleCreateUnit} />
            <Button title="Cancel" onPress={() => setUnitModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  createButton: { backgroundColor: 'green', padding: 12, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  createButtonText: { color: 'white', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 10 },
  measureDataItem: { padding: 12, marginVertical: 6, borderRadius: 8, backgroundColor: '#f9f9f9' },
  expandedContent: { marginTop: 10, padding: 8, backgroundColor: '#e0e0e0', borderRadius: 5 },
  addUnitButton: { flexDirection: 'row', alignItems: 'center', padding: 5, marginTop: 5 },
  addUnitText: { color: 'green', marginLeft: 5 },
  unitItem: { padding: 8, backgroundColor: '#ffffff', marginVertical: 4, borderRadius: 5 },
});

export default MeasureDataScreen;
