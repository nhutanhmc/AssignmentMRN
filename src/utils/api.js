
// src/utils/api.js
import axios from 'axios';

const API_URL = 'https://6545916cfe036a2fa9546dff.mockapi.io/lab'; 

export const fetchArtTools = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching art tools:', error);
    throw error;
  }
};
