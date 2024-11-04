// src/components/KoiInfo.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Image, Divider } from 'react-native-elements';

const KoiInfo = ({ koi = { name: 'Unknown', age: 0, sex: 'Unknown', category: 'Unknown', purchasePrice: 0, status: 'Unknown', origin: 'Unknown', breed: 'Unknown', length: 0, imgUrl: '' } }) => (
  <Card containerStyle={styles.card}>
    <Image 
      source={{ uri: koi.imgUrl }} 
      style={styles.image} 
      PlaceholderContent={<Text>Loading...</Text>}
    />
    <Card.Title style={styles.title}>{koi.name}</Card.Title>
    <Divider style={styles.divider} />
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>Age: <Text style={styles.infoValue}>{koi.age}</Text></Text>
      <Text style={styles.infoText}>Sex: <Text style={styles.infoValue}>{koi.sex}</Text></Text>
      <Text style={styles.infoText}>Category: <Text style={styles.infoValue}>{koi.category}</Text></Text>
      <Text style={styles.infoText}>Purchase Price: <Text style={styles.infoValue}>${koi.purchasePrice}</Text></Text>
      <Text style={styles.infoText}>Status: <Text style={styles.infoValue}>{koi.status}</Text></Text>
      <Text style={styles.infoText}>Origin: <Text style={styles.infoValue}>{koi.origin}</Text></Text>
      <Text style={styles.infoText}>Breed: <Text style={styles.infoValue}>{koi.breed}</Text></Text>
      <Text style={styles.infoText}>Length: <Text style={styles.infoValue}>{koi.length} cm</Text></Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    color: '#333',
  },
  image: {
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
  infoContainer: {
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoValue: {
    fontWeight: 'normal',
    color: '#555',
  },
});

export default KoiInfo;
