import axios from 'axios';

const API_URL = 'https://koifishproject-production.up.railway.app/api/users/login';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Error logging in:', error);
    throw error; // Ném lỗi ra ngoài để xử lý ở nơi gọi hàm
  }
};
