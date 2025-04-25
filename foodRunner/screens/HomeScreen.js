import { LinearGradient } from "expo-linear-gradient";
import moment from 'moment';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {

  const name = "이민주";
  const dateToDisplay = moment().format("YYYY.MM.DD")

  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: -40,
      }}>
        <Text style={styles.headerText}>{name}님</Text>
        <Image></Image>
      </View>
      <View style={styles.achievement}>
        {/* <Image 
          source={require('../assets/InbodyLogo.png')} 
          style={styles.inbodylogo}
        /> */}
      <View style={styles.achievementContainer}> 
        <Image></Image>
        <Text style={styles.subHeaderText}>헬린이</Text>
        {/* 바 그래프 */}
      </View>
      </View>
      
      <View style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: -40,
      }}>
        <Image
          source={require('../assets/InbodyLogo.png')} 
          style={styles.inbodylogo}
        />
        
        <TouchableOpacity onPress={() => navigation.navigate('Detail')}>
          <Text style={styles.inBodyDetailText}>자세히보기 &gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inBodyContainer}>
      <LinearGradient
            colors={["#E1FF01", "#A7BD01"]}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
            style={styles.inBodyBox}
      >
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
      </LinearGradient>
      
      <LinearGradient
            colors={["#E1FF01", "#A7BD01"]}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
            style={styles.inBodyBox}
      >
        <TouchableOpacity
          style={styles.inBodyBox}
          onPress={() => navigation.navigate('Detail')}
        >
          <Text style={styles.inBodyText}>골격근량 (kg)</Text>
          <Text style={styles.inBodyValue}>35.5</Text>
          <View style={styles.inBodyStateContainer}>
            <Text style={styles.inBodyState}>표준 이상</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
            colors={["#E1FF01", "#A7BD01"]}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
            style={styles.inBodyBox}
      >
        <TouchableOpacity
          style={styles.inBodyBox}
          onPress={() => navigation.navigate('Detail')}
        >
          <Text style={styles.inBodyText}>체지방률 (%)</Text>
          <Text style={styles.inBodyValue}>18.8</Text>
          <View style={styles.inBodyStateContainer}>
            <Text style={styles.inBodyState}>표준</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
      </View>

      <View style={styles.calorieContainer}>
        <Text style={styles.dateText}>{dateToDisplay}</Text>
        <Text style={styles.calorieTitleText}>섭취한 칼로리</Text>
        {/* 바 그래프 */}
        <Text style={styles.calorie}>1,800 / 2,000 kcal</Text>
        <Text style={styles.calorieTitleText}>소모한 칼로리</Text>
        {/* 바 그래프 */}
        <Text style={styles.calorie}>1,000 / 2,000 kcal</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 0,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 25,
    fontWeight: 700,
    color: '#fff',
    marginTop: 40,
    marginLeft: 50,
  },
  achievement: {

  },
  subHeaderText: {
    fontSize: 18,
    color: '#fff',
  },
  inbodylogo: {
    width: 220,
    height: 110,
    marginLeft: -40,
    resizeMode: 'contain',
  },
  inBodyDetailText: {
    color: "#E1FF01",
    fontWeight: 900,
    marginRight: 25,
    marginTop: 7,
  },
  inBodyContainer: {
    flexDirection: 'row',
    // marginTop: 5,
  },
  inBodyBox: {
    backgroundColor: 'transparent',
    padding: 5,
    margin: 3,
    borderRadius: 15,
    gap: 7,
    width: 120,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inBodyText: {
    fontSize: 13,
    fontWeight: 400,
    color: "#555",
  },
  inBodyValue: {
    fontWeight: 600,
    fontSize: 36,
    color: '#000',
    
  },
  inBodyStateContainer: {
    width: 100,
    height: 25,
    backgroundColor: "#000",
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: 5,
  },
  inBodyState: {
    zIndex: 1,
    color: "#E1FF01",
    fontSize: 15,
    fontWeight: 800,
    textAlign: 'center',
  },
  calorieContainer: {
    width: 765,
    height:485,
    color: "#fff",
    marginTop: 20,
    borderRadius: 30,
  },
  dateText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
  },
  calorieTitleText: {
    fontSize: 15,
    color: "#fff",
  },
  calorie: {},
});

export default HomeScreen;
