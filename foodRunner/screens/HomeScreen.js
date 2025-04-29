import { LinearGradient } from "expo-linear-gradient";
import moment from 'moment';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavigation from "../components/BottomNavigation";
import CalorieBar from '../components/CalorieBar';


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
      }}>
        <Text style={styles.headerText}>{name}님</Text>
        <View style={styles.whiteBackground}>
          <Image 
            source={require('../assets/profile.png')} 
            style={styles.profile}
          />
        </View>
      </View>

      <View style={styles.achievement}>
        <View style={styles.whiteBackground2}>
          <Image 
            source={require('../assets/profile.png')} 
            style={styles.profile2}
          />
        </View>
          <Text style={styles.subHeaderText}>헬린이</Text>
          <CalorieBar consumed={1800} goal={2000}
            marginTop={0} marginRight={30} marginBottom={0} />
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
        
        <TouchableOpacity onPress={() => navigation.navigate('InBodyDetail')}>
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
          onPress={() => navigation.navigate('InBodyDetail')}
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
          onPress={() => navigation.navigate('InBodyDetail')}
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
          onPress={() => navigation.navigate('InBodyDetail')}
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
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={styles.calorieTitleText}>섭취한 칼로리</Text>
          <CalorieBar consumed={1800} goal={2000}
          width={200} marginTop={20} marginRight={10} marginBottom={0} />
        </View>
        <Text style={styles.calorie}>
          <Text style={styles.calorieMain}>1,800</Text>
          <Text style={styles.calorieSub}> / 2,000 kcal</Text>
        </Text>
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={styles.calorieTitleText}>소모한 칼로리</Text>
          <CalorieBar consumed={1000} goal={2000}
          width={200} marginTop={20} marginRight={10} marginBottom={0} />
        </View>
        <Text style={styles.calorie}>
          <Text style={styles.calorieMain}>1,000</Text>
          <Text style={styles.calorieSub}> / 2,000 kcal</Text>
        </Text>
      </View>
      <BottomNavigation />
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
  whiteBackground: {
    width: 61,
    height: 61,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginRight: 40,
  },
  profile: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginTop: 2,
  },
  whiteBackground2: {
    width: 61,
    height: 61,
    backgroundColor: '#fff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 13,
  },
  profile2: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginTop: 2,
  },
  achievement: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#292929',
    width: 375,
    height: 80,
    borderRadius: 30,
    marginTop: 50,
  },
  subHeaderText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 600,
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
    padding: 25,
    width: 375,
    height:215,
    backgroundColor: "#292929",
    marginTop: 40,
    borderRadius: 30,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  calorieTitleText: {
    fontSize: 15,
    color: "#fff",
    marginTop: 20,
  },
  calorie: {
    color: '#fff',
    fontSize: 25,
    marginTop: 5,
  },
  calorieMain: {
    fontSize: 25,
    fontWeight: '600',
    color: '#fff',
  },
  calorieSub: {
    fontSize: 15,
    color: '#fff',
  },
});

export default HomeScreen;
