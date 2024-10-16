import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Icon, Text, Image, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const ArtToolItem = ({ tool, onPressAdd, isFavorite }) => {
  const navigation = useNavigation();

  return (
    <Card containerStyle={styles.card}>
      {/* Header: Tên sản phẩm và icon trái tim */}
      <View style={styles.headerContainer}>
        <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
          {tool.artName}
        </Text>
        {/* Icon trái tim nằm bên phải của tên sản phẩm */}
        <Icon
          name={isFavorite ? 'heart' : 'heart-outline'}
          type="ionicon"
          color={isFavorite ? '#FF6347' : '#C0C0C0'} // Đổi màu khi sản phẩm đã được yêu thích
          onPress={() => onPressAdd(tool)}
          containerStyle={styles.heartIcon}
        />
      </View>

      <Card.Divider />
      {/* Hình ảnh của sản phẩm */}
      <Image
        source={{ uri: tool.image }}
        style={styles.image}
        PlaceholderContent={<Text>Loading...</Text>}
      />

      {/* Thông tin sản phẩm */}
      <View style={styles.infoContainer}>
        <Text style={styles.price}>Price: ${tool.price}</Text>
        {tool.limitedTimeDeal > 0 && (
          <Text style={styles.deal}>
            Deal: {tool.limitedTimeDeal * 100}% off
          </Text>
        )}
      </View>

      {/* Nút "Detail" */}
      <View style={styles.buttonContainer}>
        <Button
          title="Detail"
          onPress={() => navigation.navigate('Detail', { tool })}
          buttonStyle={styles.detailButton}
          icon={{
            name: 'information-circle-outline',
            type: 'ionicon',
            color: '#fff',
          }}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 2,
    flex: 1, // Đảm bảo các thẻ chiếm đều chiều cao
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1, // Để tên sản phẩm chiếm không gian còn lại
  },
  heartIcon: {
    marginLeft: 10,
  },
  image: {
    height: 120,
    width: '100%',
  },
  infoContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deal: {
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  detailButton: {
    backgroundColor: '#007BFF', // Màu xanh cho nút "Detail"
    borderRadius: 5,
  },
});

export default ArtToolItem;
