// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { fetchArtTools } from '../utils/api';
import ArtToolItem from '../components/ArtToolItem';
import { ButtonGroup } from 'react-native-elements'; // Sử dụng ButtonGroup
import { saveFavoriteTool, getFavoriteTools, removeFavoriteTool } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const HomeScreen = () => {
  const [artTools, setArtTools] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0);  // Đặt mặc định là nút "All"

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Lấy dữ liệu sản phẩm và xây dựng danh sách brand
  const fetchData = async () => {
    const tools = await fetchArtTools();
    setArtTools(tools);
    const brandList = getBrandList(tools);  // Lấy danh sách brand từ sản phẩm
    setBrands(['All', ...brandList]);  // Thêm "All" vào đầu danh sách brand
  };

  const loadFavorites = async () => {
    const favs = await getFavoriteTools();
    setFavorites(favs);
  };

  // Hàm xử lý khi nhấn nút lọc brand
  const handleBrandFilter = (selectedIndex) => {
    setSelectedBrandIndex(selectedIndex);
  };

  // Lấy danh sách các brand từ sản phẩm và đếm số lượng sản phẩm cho mỗi brand
  const getBrandList = (tools) => {
    const brandMap = {};
    tools.forEach((tool) => {
      const brand = tool.brand.trim();  // Loại bỏ khoảng trắng thừa nếu có
      if (brandMap[brand]) {
        brandMap[brand] += 1;
      } else {
        brandMap[brand] = 1;
      }
    });
    return Object.entries(brandMap).map(([brand, count]) => `${brand} (${count})`);
  };

  // Lọc sản phẩm theo brand nếu một brand được chọn
  const filteredTools = selectedBrandIndex === 0
  ? artTools  // Nếu chọn nút "All", hiển thị tất cả sản phẩm
  : artTools.filter(tool => {
      const brandButtonLabel = brands[selectedBrandIndex].split(' (')[0];  // Lấy chính xác tên brand từ ButtonGroup
      return tool.brand.trim() === brandButtonLabel;  // So sánh brand chính xác hơn
    });


  const handleFavorite = async (tool) => {
    if (favorites.some(fav => fav.id === tool.id)) {
      await removeFavoriteTool(tool.id);
    } else {
      await saveFavoriteTool(tool);
    }
    loadFavorites();
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị ButtonGroup cho các brand */}
      <ButtonGroup
        buttons={brands}
        selectedIndex={selectedBrandIndex}
        onPress={handleBrandFilter}
        containerStyle={styles.buttonGroup}
      />
      
      {/* Hiển thị sản phẩm theo brand đã lọc */}
      <FlatList
        data={filteredTools}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <ArtToolItem
              tool={item}
              isFavorite={favorites.some(fav => fav.id === item.id)}
              onPressAdd={() => handleFavorite(item)}
            />
          </View>
        )}
        numColumns={2} // Hiển thị 2 cột trên mỗi dòng
        columnWrapperStyle={styles.row} // Tùy chỉnh khoảng cách giữa các cột
        contentContainerStyle={{ paddingBottom: 20 }} // Khoảng cách dưới cùng
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttonGroup: {
    marginBottom: 20,  // Khoảng cách giữa ButtonGroup và danh sách sản phẩm
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start', // Đảm bảo card nằm ở bên trái khi có ít hơn 2 card
  },
  cardContainer: {
    flex: 1,
    margin: 5, // Khoảng cách giữa các card
    maxWidth: '48%', // Đảm bảo kích thước card chiếm 48% không gian, với 2% còn lại là khoảng cách
  },
});

export default HomeScreen;
