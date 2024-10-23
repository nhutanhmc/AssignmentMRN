import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const DetailScreen = ({ route }) => {
  const { pond } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pond.pondName}</Text>
      <Image source={{ uri: pond.imgUrl }} style={styles.image} />
      <Text>Volume: {pond.volume}</Text>
      <Text>Depth: {pond.depth}</Text>
      <Text>Drain Count: {pond.drainCount}</Text>
      <Text>Skimmer Count: {pond.skimmerCount}</Text>
      <Text>Pump Capacity: {pond.pumpCapacity}</Text>
      {/* Thêm thông tin chi tiết khác nếu cần */}
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
});

export default DetailScreen;
