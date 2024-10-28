import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ScheduleScreen = ({ route }) => {
  const { koiId, feedingSchedules } = route.params;
  const [feedAt, setFeedAt] = useState([]); // Mảng chứa thời gian
  const [feedTimeInput, setFeedTimeInput] = useState(''); // Ô nhập thời gian
  const [foodAmount, setFoodAmount] = useState('');
  const [foodType, setFoodType] = useState('');
  const [note, setNote] = useState('');
  const [checkFeedID, setCheckFeedID] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [scheduleId, setScheduleId] = useState(null);

  useEffect(() => {
    const fetchLatestSchedule = async () => {
      if (feedingSchedules.length > 0) {
        const token = await AsyncStorage.getItem('token');
        try {
          const response = await axios.get(`https://koifishproject-production.up.railway.app/api/feeding-schedules`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const schedules = response.data.data
            .filter(schedule => schedule.koiId === koiId)
            .sort((a, b) => new Date(b.feedAt[b.feedAt.length - 1]) - new Date(a.feedAt[a.feedAt.length - 1]));

          if (schedules.length > 0) {
            const latestSchedule = schedules[0];
            setFeedAt(latestSchedule.feedAt);
            setFoodAmount(latestSchedule.foodAmount.toString());
            setFoodType(latestSchedule.foodType);
            setNote(latestSchedule.note);
            setCheckFeedID(latestSchedule.checkFeedID);
            setScheduleId(latestSchedule.id);
            setIsUpdate(true);
          }
        } catch (error) {
          console.error('Error fetching schedules:', error);
        }
      }
    };

    fetchLatestSchedule();
  }, [koiId, feedingSchedules]);

  const handleAddFeedTime = () => {
    if (feedAt.length < 3) {
      setFeedAt([...feedAt, feedTimeInput]);
      setFeedTimeInput(''); // Reset ô nhập
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
      checkFeedID,
    };

    

    try {
      if (isUpdate && scheduleId) {
        // Update schedule
        await axios.put(
          `https://koifishproject-production.up.railway.app/api/feeding-schedules/${scheduleId}`,
          scheduleData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Alert.alert('Success', 'Feeding Schedule updated successfully!');
      } else {
        // Create schedule
        await axios.post('https://koifishproject-production.up.railway.app/api/feeding-schedules', scheduleData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Success', 'Feeding Schedule created successfully!');
      }
    } catch (error) {
      console.error(isUpdate ? 'Error updating schedule:' : 'Error creating schedule:', error);
      Alert.alert('Error', isUpdate ? 'Failed to update feeding schedule.' : 'Failed to create feeding schedule.');
    }
  };

  return (
    <View>
      <Text>Feed Times:</Text>
      {feedAt.map((time, index) => (
        <Text key={index}>{time}</Text>
      ))}
      <TextInput
        placeholder="Enter feed time"
        value={feedTimeInput}
        onChangeText={setFeedTimeInput}
      />
      <Button title="Add Feed Time" onPress={handleAddFeedTime} />

      <TextInput
        placeholder="Food Amount"
        value={foodAmount}
        onChangeText={setFoodAmount}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Food Type"
        value={foodType}
        onChangeText={setFoodType}
      />
      <TextInput
        placeholder="Note"
        value={note}
        onChangeText={setNote}
      />
      <Button title={isUpdate ? "Update Schedule" : "Create Schedule"} onPress={handleSubmitSchedule} />
    </View>
  );
};

export default ScheduleScreen;
