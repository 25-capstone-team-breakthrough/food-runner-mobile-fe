import { Image, View } from 'react-native';

const Loading = () => {
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
        source={require('../assets/loading.gif')}
        style={{ width: 70, height: 70 }}
      />
    </View>
  );
};

export default Loading;