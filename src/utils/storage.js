// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favoriteArtTools';

export const saveFavoriteTool = async (tool) => {
  try {
    const favorites = await getFavoriteTools();
    const updatedFavorites = [...favorites, tool];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error saving favorite:', error);
  }
};

export const getFavoriteTools = async () => {
  try {
    const result = await AsyncStorage.getItem(FAVORITES_KEY);
    return result ? JSON.parse(result) : [];
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    return [];
  }
};

export const removeFavoriteTool = async (toolId) => {
  try {
    let favorites = await getFavoriteTools();
    favorites = favorites.filter(tool => tool.id !== toolId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

export const clearFavoriteTools = async () => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};
