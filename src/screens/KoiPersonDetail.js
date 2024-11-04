// src/screens/KoiPersonDetail.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const KoiPersonDetail = ({ route }) => {
  const { koi } = route.params; // Thông tin cá koi đã được chọn
  const [owner, setOwner] = useState(null);
  const [isForSale, setIsForSale] = useState(true);

  const fetchOwner = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await axios.get('https://koifishproject-production.up.railway.app/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = response.data.data;

      // Sử dụng try-catch để xử lý lỗi khi tìm user sở hữu koi
      try {
        const ownerUser = users.find(user =>
          user.ponds.some(pond =>
            pond && pond.koi && pond.koi.includes(koi.id) // Kiểm tra pond và pond.koi trước khi truy cập
          )
        );

        if (ownerUser) {
          setOwner(ownerUser);
        } else {
          setIsForSale(false);
        }
      } catch (error) {
        console.error('Error finding owner:', error);
        setIsForSale(false); // Nếu có lỗi, đánh dấu là "Not for sale"
      }
    } catch (error) {
      console.error('Error fetching owner:', error);
      setIsForSale(false);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.koiName}>{koi.name}</Text>
      <Image source={{ uri: koi.imgUrl }} style={styles.image} />

      <Text>Age: {koi.age}</Text>
      <Text>Sex: {koi.sex}</Text>
      <Text>Category: {koi.category}</Text>
      <Text>Breed: {koi.breed}</Text>
      <Text>Origin: {koi.origin}</Text>
      <Text>Length: {koi.length} cm</Text>
      <Text>Price: ${koi.purchasePrice}</Text>
      <Text>Status: {koi.status}</Text>
      <Text>In Pond Since: {koi.inPondSince}</Text>

      {isForSale ? (
        owner && (
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerTitle}>Owner Information</Text>
            <Text>Name: {owner.fullName}</Text>
            <Text>Email: {owner.email}</Text>
            <Text>Phone: {owner.phoneNumber}</Text>
            <Text>Status: {owner.status}</Text>
          </View>
        )
      ) : (
        <Text style={styles.notForSale}>Not for sale</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  koiName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  ownerInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    width: '100%',
  },
  ownerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notForSale: {
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
});

export default KoiPersonDetail;
