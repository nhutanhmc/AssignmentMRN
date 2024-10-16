// src/screens/FavoritesScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { getFavoriteTools, clearFavoriteTools, removeFavoriteTool } from '../utils/storage';
import ArtToolItem from '../components/ArtToolItem';
import { Button, Text, Card, Icon } from 'react-native-elements'; // Import các thành phần từ React Native Elements
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);

  // Load lại danh sách yêu thích mỗi khi trang Favorites được focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await getFavoriteTools();
    setFavorites(favs);
  };

  const handleRemoveFavorite = async (toolId) => {
    await removeFavoriteTool(toolId);
    loadFavorites();  // Tải lại danh sách sau khi xóa
  };

  const handleClearFavorites = async () => {
    await clearFavoriteTools();
    loadFavorites();  // Tải lại danh sách sau khi xóa tất cả
  };

  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <>
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card containerStyle={styles.card}>
                <ArtToolItem tool={item} isFavorite={true} />
                <Button
                  title="Remove from favorites"
                  onPress={() => handleRemoveFavorite(item.id)}
                  buttonStyle={styles.removeButton}
                  icon={<Icon name="delete" color="#fff" />} // Thêm icon vào nút
                />
              </Card>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}  // Để tránh các sản phẩm bị che ở cuối màn hình
          />
          <Button
            title="CLEAR ALL FAVORITES"
            onPress={handleClearFavorites}
            buttonStyle={styles.clearAllButton}
            icon={<Icon name="delete-sweep" color="#fff" />} // Thêm icon vào nút
          />
        </>
      ) : (
        <Text style={styles.noFavoritesText}>No favorites added yet!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  card: {
    borderRadius: 10,
    elevation: 2,
    marginBottom: 15,
  },
  removeButton: {
    backgroundColor: '#FF6347',
    marginTop: 10,
    borderRadius: 5,
  },
  clearAllButton: {
    backgroundColor: '#FF4500',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  noFavoritesText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    marginTop: 50,
  },
});

export default FavoritesScreen;
