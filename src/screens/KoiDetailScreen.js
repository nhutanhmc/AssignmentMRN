import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, FlatList, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Nhập từ thư viện mới

const KoiDetailScreen = ({ route, navigation }) => {
  const { koi } = route.params;
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false); // Modal for update
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [recordOn, setRecordOn] = useState(new Date().toISOString()); // Mặc định thời gian hiện tại
  const [physique, setPhysique] = useState('NORMAL'); // Mặc định là NORMAL

  // Fields for updating koi
  const [name, setName] = useState(koi.name);
  const [age, setAge] = useState(koi.age.toString());
  const [sex, setSex] = useState(koi.sex);
  const [category, setCategory] = useState(koi.category);
  const [inPondSince, setInPondSince] = useState(koi.inPondSince);
  const [purchasePrice, setPurchasePrice] = useState(koi.purchasePrice.toString());
  const [status, setStatus] = useState(koi.status);
  const [imgUrl, setImgUrl] = useState(koi.imgUrl);
  const [origin, setOrigin] = useState(koi.origin);
  const [breed, setBreed] = useState(koi.breed);
  const [updateLength, setUpdateLength] = useState(koi.length.toString());

  useEffect(() => {
    const fetchRecords = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`https://koifishproject-production.up.railway.app/api/koi-records`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const koiRecords = response.data.data
          .filter(record => record.koiId === koi.id)
          .sort((a, b) => new Date(b.recordOn) - new Date(a.recordOn)); // Sắp xếp theo thời gian gần nhất

        setRecords(koiRecords);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [koi.id]);

  const handleCreateRecord = async () => {
    const token = await AsyncStorage.getItem('token');

    const recordData = {
      koiId: koi.id,
      weight: parseFloat(weight),
      length: parseFloat(length),
      recordOn: new Date().toISOString(), // Lấy thời gian hiện tại
      physique,
      developmentStageId: "46cf3f40-b342-482f-8006-1c775525d034", // Giá trị mặc định
    };

    console.log('Koi Data:', recordData); // In ra dữ liệu

    try {
      await axios.post('https://koifishproject-production.up.railway.app/api/koi-records', recordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Refresh danh sách record sau khi tạo thành công
      const response = await axios.get(`https://koifishproject-production.up.railway.app/api/koi-records`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const koiRecords = response.data.data
        .filter(record => record.koiId === koi.id)
        .sort((a, b) => new Date(b.recordOn) - new Date(a.recordOn)); // Sắp xếp theo thời gian gần nhất
      setRecords(koiRecords);
      
      // Hiển thị thông báo thành công
      Alert.alert('Success', 'Record created successfully!', [
        { text: 'OK', onPress: () => setModalVisible(false) }
      ]);
    } catch (error) {
      console.error('Error creating record:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to create record.');
    }
  };

  // Function to handle koi update
  const handleUpdateKoi = async () => {
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
      length: parseInt(updateLength),
      koiRecords: koi.koiRecords, // Keep koiRecords unchanged
      feedingSchedules: koi.feedingSchedules, // Keep feedingSchedules unchanged
    };

    try {
      await axios.put(`https://koifishproject-production.up.railway.app/api/kois/${koi.id}`, updatedKoiData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Success', 'Koi updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setUpdateModalVisible(false); // Đóng modal
            navigation.navigate('Home');  // Điều hướng về Home
          }
        }
      ]);
    } catch (error) {
      console.error('Error updating koi:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update koi.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{koi.name}</Text>
      <Image source={{ uri: koi.imgUrl }} style={styles.image} />
      <Text>Age: {koi.age}</Text>
      <Text>Sex: {koi.sex}</Text>
      <Text>Category: {koi.category}</Text>
      <Text>In Pond Since: {koi.inPondSince}</Text>
      <Text>Purchase Price: ${koi.purchasePrice}</Text>
      <Text>Status: {koi.status}</Text>
      <Text>Origin: {koi.origin}</Text>
      <Text>Breed: {koi.breed}</Text>
      <Text>Length: {koi.length}</Text>

      <Button title="Update Koi" onPress={() => setUpdateModalVisible(true)} />

      <View style={styles.recordContainer}>
        <Text style={styles.recordTitle}>Records</Text>
        <Button title="+" onPress={() => setModalVisible(true)} />
        {isLoading ? (
          <Text>Loading...</Text>
        ) : records.length === 0 ? (
          <Text>No records available.</Text>
        ) : (
          <FlatList
            data={records}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.recordItem}>
                <Text>Record On: {new Date(item.recordOn).toLocaleDateString()}</Text>
                <Text>Weight: {item.weight} kg</Text>
                <Text>Length: {item.length} cm</Text>
                <Text>Physique: {item.physique}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 100 }} // Thêm khoảng trống dưới cùng
          />
        )}
      </View>

      {/* Modal for creating record */}
      <Modal visible={isModalVisible} animationType="slide">
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
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Modal for updating Koi */}
      <Modal visible={isUpdateModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <Picker selectedValue={sex} onValueChange={setSex}>
            <Picker.Item label="MALE" value="MALE" />
            <Picker.Item label="FEMALE" value="FEMALE" />
            <Picker.Item label="NOT_SPECIFIED" value="NOT_SPECIFIED" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="In Pond Since"
            value={inPondSince}
            onChangeText={setInPondSince}
          />
          <TextInput
            style={styles.input}
            placeholder="Purchase Price"
            value={purchasePrice}
            onChangeText={setPurchasePrice}
            keyboardType="numeric"
          />
          <Picker selectedValue={status} onValueChange={setStatus}>
            <Picker.Item label="ACTIVE" value="ACTIVE" />
            <Picker.Item label="DECEASED" value="DECEASED" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={imgUrl}
            onChangeText={setImgUrl}
          />
          <TextInput
            style={styles.input}
            placeholder="Origin"
            value={origin}
            onChangeText={setOrigin}
          />
          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={breed}
            onChangeText={setBreed}
          />
          <TextInput
            style={styles.input}
            placeholder="Length"
            value={updateLength}
            onChangeText={setUpdateLength}
            keyboardType="numeric"
          />
          <Button title="Save" onPress={handleUpdateKoi} />
          <Button title="Cancel" onPress={() => setUpdateModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  recordContainer: {
    marginTop: 20,
    flex: 1, // Đảm bảo rằng record container chiếm toàn bộ chiều cao
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recordItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContent: {
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

export default KoiDetailScreen;
