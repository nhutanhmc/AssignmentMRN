import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../utils/api';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Input, Button } from 'react-native-elements';

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
      await AsyncStorage.setItem('orderDetailIds', JSON.stringify([])); // Tạo mảng orderDetailIds trống

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
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        leftIcon={{ type: 'material', name: 'email' }}
        containerStyle={styles.inputContainer}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        leftIcon={{ type: 'material', name: 'lock' }}
        containerStyle={styles.inputContainer}
      />
      <Button
        title="Login"
        onPress={handleLogin}
        buttonStyle={styles.loginButton}
      />

      {/* Modal for creating pond */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Input placeholder="Pond Name" value={pondName} onChangeText={setPondName} />
          <Input placeholder="Volume" value={volume} onChangeText={setVolume} keyboardType="numeric" />
          <Input placeholder="Depth" value={depth} onChangeText={setDepth} keyboardType="numeric" />
          <Input placeholder="Drain Count" value={drainCount} onChangeText={setDrainCount} keyboardType="numeric" />
          <Input placeholder="Skimmer Count" value={skimmerCount} onChangeText={setSkimmerCount} keyboardType="numeric" />
          <Input placeholder="Pump Capacity" value={pumpCapacity} onChangeText={setPumpCapacity} keyboardType="numeric" />
          <Input placeholder="Image URL" value={imgUrl} onChangeText={setImgUrl} />
          <Button title="Create Pond" onPress={handleCreatePond} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  inputContainer: { marginBottom: 15 },
  loginButton: { backgroundColor: '#007bff', borderRadius: 5 },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
});

export default LoginScreen;
