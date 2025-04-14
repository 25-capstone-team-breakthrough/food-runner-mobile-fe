import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const name = "이민주";

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{name}님</Text>
      <View style={styles.achievement}>
        {/* <Image 
          source={require('../assets/InbodyLogo.png')} 
          style={styles.inbodylogo}
        /> */}
        <Text style={styles.subHeaderText}>헬린이</Text>
      </View>
      

      <Image
        source={require('../assets/InbodyLogo.png')} 
        style={styles.inbodylogo}
      />
      <TouchableOpacity>
        <Text style={styles.inBodyDetailText}>자세히보기 &gt;</Text>
      </TouchableOpacity>

      <View style={styles.inBodyContainer}>
        <TouchableOpacity
          style={styles.inBodyBox}
          onPress={() => navigation.navigate('Detail')}
        >
          <Text style={styles.inBodyText}>체중 (kg)</Text>
          <Text style={styles.inBodyValue}>76.1</Text>
          <View style={styles.inBodyStateContainer}>
            <Text style={styles.inBodyState}>표준</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inBodyBox}
          onPress={() => navigation.navigate('Detail', { section: '골격근량' })}
        >
          <Text style={styles.inBodyText}>골격근량 (kg)</Text>
          <Text style={styles.inBodyValue}>35.5</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inBodyBox}
          onPress={() => navigation.navigate('Detail', { section: '체지방률' })}
        >
          <Text style={styles.inBodyText}>체지방률 (%)</Text>
          <Text style={styles.inBodyValue}>18.8</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.dateText}>2025.01.21.화</Text>

      <View style={styles.calorieContainer}>
        <Text>섭취한 칼로리: 1,800 / 2,000 kcal</Text>
        <Text>소모한 칼로리: 1,000 / 2,000 kcal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0e',
    padding: 0,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    marginTop: 40,
  },
  achievement: {

  },
  subHeaderText: {
    fontSize: 18,
    color: '#fff',
  },
  inbodylogo: {},
  inBodyDetailText: {},
  inBodyContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  inBodyBox: {
    backgroundColor: '#E1FF01',
    padding: 10,
    margin: 3,
    borderRadius: 10,
    gap: 7,
    width: 120,
    height: 140,
    alignItems: 'center',
  },
  inBodyText: {
    color: '#000',
  },
  inBodyValue: {
    fontWeight: 'bold',
    color: '#000',
  },
  dateText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
  },
  calorieContainer: {
    marginTop: 20,
    alignItems: 'center',
    color: '#fff',
  },
});

export default HomeScreen;
