// src/screens/DetailScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Image, Card } from 'react-native-elements';

const DetailScreen = ({ route }) => {
  const { tool } = route.params;

  return (
    <Card containerStyle={styles.card}>
      <Card.Title>{tool.artName}</Card.Title>
      <Card.Divider />
      <Image
        source={{ uri: tool.image }}
        style={styles.image}
        PlaceholderContent={<Text>Loading...</Text>}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.price}>Price: ${tool.price}</Text>
        <Text>{tool.description}</Text>
        {tool.limitedTimeDeal > 0 && (
          <Text style={styles.deal}>
            Limited Time Deal: {tool.limitedTimeDeal * 100}% off
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  image: {
    height: 200,
    width: '100%',
  },
  infoContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deal: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default DetailScreen;
