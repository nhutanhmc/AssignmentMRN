// CreateScheduleScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CreateScheduleScreen = ({ route, navigation }) => {
  const { koiId } = route.params;
  const [feedAt, setFeedAt] = useState([]);
  const [feedTimeInput, setFeedTimeInput] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [foodType, setFoodType] = useState('');
  const [note, setNote] = useState('');

  const handleAddFeedTime = () => {
    if (feedAt.length < 3) {
      setFeedAt([...feedAt, feedTimeInput]);
      setFeedTimeInput('');
    } else {
      Alert.alert('Error', 'You can only add up to 3 feed times.');
    }
  };

  const handleSubmitSchedule = async () => {
    const token = await AsyncStorage.getItem('token');
    const scheduleData = {
      koiId,
      feedAt,
      foodAmount: parseFloat(foodAmount),
      foodType,
      note,
      checkFeedID: [],
    };

   

    try {
      await axios.post('https://koifishproject-production.up.railway.app/api/feeding-schedules', scheduleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Feeding Schedule created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('ShowSchedule', { koiId }) }
      ]);
    } catch (error) {
      console.error('Error creating schedule:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to create feeding schedule.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Feeding Schedule</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Feed Times</Text>
        {feedAt.map((time, index) => (
          <Text key={index} style={styles.feedTimeText}>Feed Time {index + 1}: {time}</Text>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Enter feed time"
          value={feedTimeInput}
          onChangeText={setFeedTimeInput}
        />
        <Button title="Add Feed Time" onPress={handleAddFeedTime} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Food Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Food Amount"
          value={foodAmount}
          onChangeText={setFoodAmount}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Food Type</Text>
        <TextInput
          style={styles.input}
          placeholder="Food Type"
          value={foodType}
          onChangeText={setFoodType}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Note</Text>
        <TextInput
          style={styles.input}
          placeholder="Note"
          value={note}
          onChangeText={setNote}
        />
      </View>

      <Button title="Create Schedule" onPress={handleSubmitSchedule} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { 
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  feedTimeText: { fontSize: 14, marginBottom: 4, color: 'gray' },
});

export default CreateScheduleScreen;
