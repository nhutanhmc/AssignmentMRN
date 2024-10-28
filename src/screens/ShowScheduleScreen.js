import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ShowScheduleScreen = ({ route }) => {
  const [feedingSchedule, setFeedingSchedule] = useState(null);
  const [checkFeeds, setCheckFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const koiId = route.params?.koiId;

  const [feedAt, setFeedAt] = useState([]);
  const [foodAmount, setFoodAmount] = useState('');
  const [foodType, setFoodType] = useState('');
  const [note, setNote] = useState('');

  const fetchFeedingSchedule = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/feeding-schedules', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const schedules = response.data.data.filter(schedule => schedule.koiId === koiId);
      if (schedules.length > 0) {
        const latestSchedule = schedules[schedules.length - 1];
        setFeedingSchedule(latestSchedule);
        setFeedAt(latestSchedule.feedAt || []);
        setFoodAmount(latestSchedule.foodAmount.toString());
        setFoodType(latestSchedule.foodType);
        setNote(latestSchedule.note);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!feedingSchedule) return;
    const token = await AsyncStorage.getItem('token');
    const currentTime = new Date().toISOString();

    const checkFeedData = {
      feedingScheduleId: feedingSchedule.id,
      status: true,
      timeCheck: currentTime,
    };

   
    

    try {
      await axios.post('https://koifishproject-production.up.railway.app/api/check-feeds', checkFeedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Checked successfully!');
      fetchCheckFeeds();
    } catch (error) {
      console.error('Error checking feed:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to check feed.');
    }
  };

  const fetchCheckFeeds = async () => {
    if (!feedingSchedule) return;
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/check-feeds', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const relatedCheckFeeds = response.data.data
        .filter((check) => check.feedingScheduleId === feedingSchedule.id)
        .sort((a, b) => new Date(b.timeCheck) - new Date(a.timeCheck)); // Sắp xếp theo thời gian mới nhất trước

      setCheckFeeds(relatedCheckFeeds);
    } catch (error) {
      console.error('Error fetching check feeds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSchedule = async () => {
    const token = await AsyncStorage.getItem('token');
    const updatedScheduleData = {
      ...feedingSchedule,
      feedAt,
      foodAmount: parseFloat(foodAmount),
      foodType,
      note,
    };

    

    try {
      await axios.put(`https://koifishproject-production.up.railway.app/api/feeding-schedules/${feedingSchedule.id}`, updatedScheduleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Schedule updated successfully!');
      fetchFeedingSchedule();
      setUpdateModalVisible(false);
    } catch (error) {
      console.error('Error updating schedule:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update schedule.');
    }
  };

  const addFeedTimeField = () => {
    setFeedAt([...feedAt, '']);
  };

  useEffect(() => {
    fetchFeedingSchedule();
  }, [koiId]);

  useEffect(() => {
    if (feedingSchedule) {
      fetchCheckFeeds();
    }
  }, [feedingSchedule]);

  if (!feedingSchedule) {
    return <Text>Loading schedule...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Details</Text>
      <Text>Feeding Time: {feedingSchedule.feedAt.join(', ')}</Text>
      <Text>Food Amount: {feedingSchedule.foodAmount}</Text>
      <Text>Food Type: {feedingSchedule.foodType}</Text>
      <Text>Note: {feedingSchedule.note}</Text>

      <Button title="Update Schedule" onPress={() => setUpdateModalVisible(true)} />
      <Button title="Check" onPress={handleCheck} />

      <Text style={styles.subtitle}>Check Feed History</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : checkFeeds.length === 0 ? (
        <Text>No check feed history available.</Text>
      ) : (
        <FlatList
          data={checkFeeds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.checkFeedItem}>
              <Text>Status: {item.status ? 'Completed' : 'Pending'}</Text>
              <Text>Time Checked: {new Date(item.timeCheck).toLocaleString()}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Modal for updating schedule */}
      <Modal visible={isUpdateModalVisible} animationType="slide" onRequestClose={() => setUpdateModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text>Update Feed At</Text>
          {feedAt.map((time, index) => (
            <View key={index} style={styles.feedTimeInput}>
              <Text>Feed At {index + 1}</Text>
              <TextInput
                style={styles.input}
                placeholder={`Feed At ${index + 1}`}
                value={feedAt[index]}
                onChangeText={(value) => {
                  const updatedFeedAt = [...feedAt];
                  updatedFeedAt[index] = value;
                  setFeedAt(updatedFeedAt);
                }}
              />
            </View>
          ))}
          <Button title="Add Feed Time" onPress={addFeedTimeField} />
          <TextInput
            style={styles.input}
            placeholder="Food Amount"
            value={foodAmount}
            onChangeText={setFoodAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Food Type"
            value={foodType}
            onChangeText={setFoodType}
          />
          <TextInput
            style={styles.input}
            placeholder="Note"
            value={note}
            onChangeText={setNote}
          />
          <Button title="Save" onPress={handleUpdateSchedule} />
          <Button title="Cancel" onPress={() => setUpdateModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  checkFeedItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  feedTimeInput: { marginBottom: 10 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 },
});

export default ShowScheduleScreen;
