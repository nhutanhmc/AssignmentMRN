import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Modal, Alert, StyleSheet, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const UpdateKoiModal = ({ isVisible, closeModal, koi = {}, navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [category, setCategory] = useState('');
  const [inPondSince, setInPondSince] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [status, setStatus] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [origin, setOrigin] = useState('');
  const [breed, setBreed] = useState('');
  const [length, setLength] = useState('');

  useEffect(() => {
    if (koi) {
      setName(koi.name || '');
      setAge(koi.age?.toString() || '');
      setSex(koi.sex || '');
      setCategory(koi.category || '');
      setInPondSince(koi.inPondSince || '');
      setPurchasePrice(koi.purchasePrice?.toString() || '');
      setStatus(koi.status || '');
      setImgUrl(koi.imgUrl || '');
      setOrigin(koi.origin || '');
      setBreed(koi.breed || '');
      setLength(koi.length?.toString() || '');
    }
  }, [koi]);

  const handleUpdateKoi = async () => {
    // Kiểm tra định dạng ngày
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(inPondSince)) {
      Alert.alert('Invalid Date Format', 'Please enter the date in yyyy-mm-dd format.');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const updatedKoiData = {
      name,
      age: parseInt(age),
      sex,
      category,
      inPondSince,
      purchasePrice: parseFloat(purchasePrice),
      status,
      imgUrl,
      origin,
      breed,
      length: parseInt(length),
      koiRecords: koi.koiRecords,
      feedingSchedules: koi.feedingSchedules,
    };

    try {
      await axios.put(`https://koifishproject-production.up.railway.app/api/kois/${koi.id}`, updatedKoiData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Koi updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            closeModal();
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating koi:', error);
      Alert.alert('Error', 'Failed to update koi.');
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.modalContent}>
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
          <TextInput
            style={styles.input}
            placeholder="In Pond Since (yyyy-mm-dd)"
            value={inPondSince}
            onChangeText={setInPondSince}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Purchase Price</Text>
          <TextInput style={styles.input} placeholder="Purchase Price" value={purchasePrice} onChangeText={setPurchasePrice} keyboardType="numeric" />

          <Text style={styles.label}>Status</Text>
          <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
            <Picker.Item label="ACTIVE" value="ACTIVE" />
            <Picker.Item label="DECEASED" value="DECEASED" />
          </Picker>

          <Text style={styles.label}>Image URL</Text>
          <TextInput style={styles.input} placeholder="Image URL" value={imgUrl} onChangeText={setImgUrl} />

          <Text style={styles.label}>Origin</Text>
          <TextInput style={styles.input} placeholder="Origin" value={origin} onChangeText={setOrigin} />

          <Text style={styles.label}>Breed</Text>
          <TextInput style={styles.input} placeholder="Breed" value={breed} onChangeText={setBreed} />

          <Text style={styles.label}>Length</Text>
          <TextInput style={styles.input} placeholder="Length" value={length} onChangeText={setLength} keyboardType="numeric" />

          <Button title="Save" onPress={handleUpdateKoi} />
          <Button title="Cancel" onPress={closeModal} />
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  input: { 
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 5, 
    paddingHorizontal: 8, 
    marginBottom: 12 
  },
  picker: { 
    height: 50, 
    width: '100%', 
    marginBottom: 12 
  }
});

export default UpdateKoiModal;
