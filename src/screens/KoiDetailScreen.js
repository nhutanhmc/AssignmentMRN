import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import KoiInfo from '../components/KoiInfo';
import RecordList from '../components/RecordList';
import RecordModal from '../components/RecordModal';
import UpdateKoiModal from '../components/UpdateKoiModal';

const KoiDetailScreen = ({ route, navigation }) => {
  const { koi = {} } = route.params;
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

  const fetchRecords = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/koi-records', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const koiRecords = response.data.data
        .filter(record => record.koiId === koi.id)
        .sort((a, b) => new Date(b.recordOn) - new Date(a.recordOn));
      setRecords(koiRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [koi.id]);

  const handleScheduleNavigation = () => {
    if (koi.feedingSchedules && koi.feedingSchedules.length === 0) {
      navigation.navigate('CreateSchedule', { koiId: koi.id });
    } else {
      navigation.navigate('ShowSchedule', { koiId: koi.id });
    }
  };

  if (!koi) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={() => (
        <View>
          <KoiInfo koi={koi} />
          <Button title="Update Koi" onPress={() => setUpdateModalVisible(true)} />
          <RecordList records={records} isLoading={isLoading} openModal={() => setModalVisible(true)} />
        </View>
      )}
      ListFooterComponent={() => (
        <View>
          <Button title="Schedule" onPress={handleScheduleNavigation} />
          <RecordModal
            isVisible={isModalVisible}
            closeModal={() => setModalVisible(false)}
            koiId={koi.id}
            onRecordCreated={fetchRecords}
          />
          <UpdateKoiModal
            isVisible={isUpdateModalVisible}
            closeModal={() => setUpdateModalVisible(false)}
            koi={koi}
            navigation={navigation}
          />
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
});

export default KoiDetailScreen;
