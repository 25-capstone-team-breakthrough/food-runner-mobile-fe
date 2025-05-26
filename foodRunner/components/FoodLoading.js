import { Image, Text, View } from 'react-native';

const FoodLoading = () => {
  return (
    <View style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    }}>
      <Image
        source={require('../assets/FoodLoading.gif')}
        style={{ width: 150, height: 150 }}
      />
      <Text style={{ color: '#fff', marginTop: 10 }}>사진을 분석 중입니다...</Text>
    </View>
  );
};

export default FoodLoading;