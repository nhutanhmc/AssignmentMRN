import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

const RecordList = ({ records = [], isLoading = false, openModal }) => (
  <View style={styles.recordContainer}>
    <Text style={styles.recordTitle}>Records</Text>
    <Button title="+" onPress={openModal} />
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
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  recordContainer: { marginTop: 20, flex: 1 },
  recordTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  recordItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default RecordList;
