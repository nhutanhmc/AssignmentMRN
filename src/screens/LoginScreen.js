import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../utils/api';
import axios from 'axios';
import Modal from 'react-native-modal';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for modal and pond data
  const [isModalVisible, setModalVisible] = useState(false);
  const [pondName, setPondName] = useState('');
  const [volume, setVolume] = useState('');
  const [depth, setDepth] = useState('');
  const [drainCount, setDrainCount] = useState('');
  const [skimmerCount, setSkimmerCount] = useState('');
  const [pumpCapacity, setPumpCapacity] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);
      
      if (data.user.role === "MEMBER") {
        if (data.user.ponds.length === 0) {
          setModalVisible(true); // Hiển thị modal để người dùng nhập thông tin hồ
        } else {
          navigation.navigate('Home'); // Chuyển đến TabNavigator
        }
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  const handleCreatePond = async () => {
    const token = await AsyncStorage.getItem('token');
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
      userId: JSON.parse(await AsyncStorage.getItem('user')).id,
    };

    try {
      await axios.post('https://koifishproject-production.up.railway.app/api/ponds', pondData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalVisible(false); // Đóng modal
      navigation.navigate('Ponds'); // Điều hướng đến tab "Ponds"
    } catch (error) {
      console.error('Error creating pond:', error);
      Alert.alert('Error', 'Failed to create pond.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />

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
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

export default LoginScreen;
