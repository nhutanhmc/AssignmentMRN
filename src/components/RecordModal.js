import React, { useState } from 'react';
import { View, TextInput, Button, Modal, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecordModal = ({ isVisible = false, closeModal, koiId, onRecordCreated }) => {
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [physique, setPhysique] = useState('NORMAL');

  const handleCreateRecord = async () => {
    const token = await AsyncStorage.getItem('token');
    const recordData = {
      koiId,
      weight: parseFloat(weight),
      length: parseFloat(length),
      recordOn: new Date().toISOString(),
      physique,
      developmentStageId: "46cf3f40-b342-482f-8006-1c775525d034",
    };

    try {
      await axios.post('https://koifishproject-production.up.railway.app/api/koi-records', recordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Record created successfully!');
      if (onRecordCreated) onRecordCreated();
      closeModal();
    } catch (error) {
      console.error('Error creating record:', error);
      Alert.alert('Error', 'Failed to create record.');
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Weight"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Length"
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
          />
          <Picker selectedValue={physique} onValueChange={setPhysique}>
            <Picker.Item label="NORMAL" value="NORMAL" />
            <Picker.Item label="CORPULENT" value="CORPULENT" />
            <Picker.Item label="SLIM" value="SLIM" />
          </Picker>
          <Button title="Create Record" onPress={handleCreateRecord} />
          <Button title="Cancel" onPress={closeModal} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
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

export default RecordModal;
