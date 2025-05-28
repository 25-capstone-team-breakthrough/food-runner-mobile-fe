import { LinearGradient } from "expo-linear-gradient";
import moment from 'moment';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavigation from "../components/BottomNavigation";
import CircularProgress from 'react-native-circular-progress-indicator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import 'moment/locale/ko';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';




const HomeScreen = ({ navigation }) => {
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [name, setName] = useState('');
  const [inbody, setInbody] = useState(null);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState(0);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [recommendedCalories, setRecommendedCalories] = useState(2000); // 기본값

  const BASE_URL = 'http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080';

const uploadImage = async (localUri) => {
  const token = await AsyncStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    type: "image/jpeg",
    name: "upload.jpg",
  });

  try {
    const response = await fetch(`${BASE_URL}/inbody/imageUpload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) throw new Error("업로드 실패");
    alert("✅ 이미지 업로드 완료!");
    // ✅ 업로드 완료 후 InBodyDetail 이동
    navigation.navigate('InBodyDetail');
  } catch (err) {
    console.error("❌ 이미지 업로드 실패:", err);
    alert("❌ 이미지 업로드 실패");
  }
};

const handlePickImage = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.status !== 'granted') {
    alert("📷 사진 접근 권한이 필요합니다.");
    return;
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    if (result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      await uploadImage(uri);
    }
  } catch (err) {
    console.error("❌ 갤러리 실행 중 오류:", err);
    alert("갤러리 실행 오류");
  }
};

  useEffect(() => {
    const fetchUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) setName(storedName);
    };

    const fetchCalories = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/exercise/calories', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        const today = moment().startOf('day');

        const total = data
          .filter(log => moment(log.createdAt).isSame(today, 'day'))
          .reduce((sum, log) => sum + (log.caloriesBurned || 0), 0);

        setBurnedCalories(total);
      } catch (err) {
        console.error('소모 칼로리 가져오기 실패:', err);
      }
    };

    const fetchInbody = async () => {
      

      const token = await AsyncStorage.getItem('token');
      if (!token) return;
    
      try {
        const res = await fetch('http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/inbody/inbody-info', {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        const result = await res.json();

        console.log("인바디 데이터:", result);

        if (result.length > 0) {
          const latest = result[0]; // 최신순 정렬이면 첫 번째가 최신
          console.log('muscleMass:', latest.skeletalMuscleMass);

          setInbody({
            weight: latest.weight,
            skeletalMuscleMass: latest.skeletalMuscleMass,
            bodyFatPercentage: latest.bodyFatPercentage
          });
        }
      } catch (err) {
        console.error('인바디 불러오기 실패:', err);
      }
    };
    const fetchUserProfile = async () => {
      const storedGender = await AsyncStorage.getItem('gender');
      const storedAge = await AsyncStorage.getItem('age');
      if (storedGender) setGender(storedGender);
      if (storedAge) setAge(Number(storedAge));
    };
    
    

    fetchUserName();
    fetchCalories();
    fetchInbody();
    fetchUserProfile();  
  }, []);

  useEffect(() => {
    const fetchCaloriesFromStorage = async () => {
      try {
        const consumed = await AsyncStorage.getItem('todayCalories');
        const recommended = await AsyncStorage.getItem('todayRecommendedCalories');
  
        if (consumed && recommended) {
          setConsumedCalories(Number(consumed));
          setRecommendedCalories(Number(recommended));
        }
      } catch (err) {
        console.error("칼로리 가져오기 실패:", err);
      }
    };
  
    fetchCaloriesFromStorage();
  }, []);
  

  
  const dateToDisplay = moment().locale('ko').format("MM월 DD일 dddd");

  const getStatus = (value, type) => {
    if (!gender || !age) return '';
    const standards = {
      weight: gender === 'male' ? [60, 85] : [45, 70],
      smm: gender === 'male' ? [30, 40] : [20, 30],
      bfp: gender === 'male' ? [10, 20] : [18, 28]
    };
  
    const [min, max] = standards[type];
    if (value < min) return '표준 이하';
    if (value > max) return '표준 이상';
    return '표준';
  };
  

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 프로필 */}
      <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{name}님</Text>
        <View style={styles.whiteBackground}>
          <Image source={require('../assets/profile.png')} style={styles.profile} />
        </View>
      </View>
      {/* 오늘 날짜 */}
      <Text style={styles.dateText}>{dateToDisplay}</Text>
      {/* 섭취한 칼로리 카드 */}
      <TouchableOpacity onPress={() => navigation.navigate('NutritionMain')} style={styles.Card}>
        <Icon name="chevron-right" size={26} color="#E1FF01" style={styles.arrowTopRight} />
        <View style={styles.graphRow}>
          <View style={styles.graphWrapper}>
          <CircularProgress
            value={consumedCalories}
            radius={60}
            maxValue={recommendedCalories}
            activeStrokeWidth={50}
            inActiveStrokeWidth={50}
            progressValueColor={'transparent'}
            activeStrokeColor={'#E1FF01'}
            inActiveStrokeColor={'#2a2a2a'}
            showProgressValue={false}
          />
          </View>
          <View style={styles.textBox}>
            <Text style={styles.label}>섭취한 칼로리</Text>
            <Text style={styles.value}>
              <Text style={styles.bold}>{consumedCalories}</Text>
              <Text style={styles.unit}> / {recommendedCalories}kcal</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* 소모한 열량 카드 */}
      <TouchableOpacity onPress={() => navigation.navigate('ExerciseHome')} style={styles.Card}>
        <Icon name="chevron-right" size={26} color="#F91250" style={styles.arrowTopRight} />
        <View style={styles.burnRow}>
          <View style={styles.burnTextBox}>
            <Text style={styles.burnLabel}>소모한 열량</Text>
            <Text style={styles.burnValue}>{burnedCalories}kcal</Text>
          </View>
          <View style={styles.burnGraphWrapper}>
            <CircularProgress
              value={burnedCalories}
              radius={60}
              maxValue={1000}
              activeStrokeWidth={50}
              inActiveStrokeWidth={50}
              progressValueColor={'transparent'}
              activeStrokeColor={'#F91250'}
              inActiveStrokeColor={'#2a2a2a'}
              showProgressValue={false}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* InBody 상단 */}
      <View style={styles.inBodyHeader}>
        <Image source={require('../assets/InbodyLogo.png')} style={styles.inbodylogo} />
        <TouchableOpacity onPress={() => navigation.navigate('InBodyDetail')} style={{ marginLeft: 130 }}>
          <Text style={styles.inBodyDetailText}>자세히보기 &gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inBodyContainer}>
        {inbody ? (
          [
            { label: "체중 (kg)", value: inbody.weight, status: getStatus(inbody.weight, 'weight') },
            { label: "골격근량 (kg)", value: inbody.skeletalMuscleMass, status: getStatus(inbody.skeletalMuscleMass, 'smm') },
            { label: "체지방률 (%)", value: inbody.bodyFatPercentage, status: getStatus(inbody.bodyFatPercentage, 'bfp') }
          ].map((item, i) => (
            <LinearGradient
              key={i}
              colors={["#E1FF01", "#A7BD01"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.inBodyBox}
            >
              <TouchableOpacity style={styles.inBodyBox} onPress={() => navigation.navigate('InBodyDetail')}>
                <Text style={styles.inBodyText}>{item.label}</Text>
                <Text style={styles.inBodyValue}>{item.value.toFixed(1)}</Text>
                <View style={styles.inBodyStateContainer}>
                  <Text style={styles.inBodyState}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          ))
        ) : (
          <LinearGradient
            colors={["#E1FF01", "#A7BD01"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.inBodyEmptyBox}
          >
            <View style={styles.emptyContent}>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.emptyText}>인바디 정보가 없습니다{'\n'}인바디 사진을 추가해주세요</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('InBodyDetail', { openUploadModal: true })}
                  style={styles.uploadButton}
                >
                  <Text style={styles.uploadButtonText}>사진 업로드하기</Text>
                </TouchableOpacity>

              </View>
              <Image
                source={require('../assets/inbody-question.png')}
                style={styles.emptyImage}
              />
            </View>
          </LinearGradient>
        )}
      </View>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 25,
    fontWeight: '700',
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
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 50,
    marginBottom: 30,
  },
  circleBox: {
    alignItems: 'center',
  },
  inBodyHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -30,
    marginBottom: -40,
    paddingHorizontal: 20,
  },
  inbodylogo: {
    width: 220,
    height: 110,
    resizeMode: 'contain',
    marginLeft: -65
  },
  inBodyDetailText: {
    color: "#E1FF01",
    fontWeight: '900',
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
    fontWeight: '400',
    color: "#555",
  },
  inBodyValue: {
    fontWeight: '600',
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
    color: "#DDFB21",
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  arrowTopRight: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  
  cardContainer: {
    width: '90%',
    alignItems: 'center',
    marginTop: 30,
  },
  card: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
  },
  cardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  graphRow: {
    flexDirection: 'row',
    justifyContent: 'center',   // ✅ 가로 중앙
    alignItems: 'center',       // ✅ 세로 중앙
    height: '100%',             // ✅ 세로 정렬 위해 높이 지정
  },
  graphWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,            // ✅ 텍스트와 간격 조정
  },
  textBox: {
    alignItems: 'center',
  },
  
  label: {
    color: '#E1FF01',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  value: {
    color: '#E1FF01',
    fontSize: 22,
    fontWeight: 'bold',
  },
  
  bold: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  
  unit: {
    fontSize: 16,
    fontWeight: '400',
  },
  Card: {
    backgroundColor: '#222222',
    borderRadius: 20,
    padding: 20,
    marginVertical: 5,
    width: '95%',
    height: 180,
  },
  burnRow: {
    flexDirection: 'row',
    justifyContent: 'center',   // ✅ 가로 중앙
    alignItems: 'center',       // ✅ 세로 중앙
    height: '100%',             // ✅ 세로 중앙 정렬을 위해 높이 지정
  },
  
  burnTextBox: {
    alignItems: 'center',
    marginRight: 20,        // 텍스트 내부 가운데 정렬
  },
  burnGraphWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  burnLabel: {
    color: '#F91250',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  
  burnValue: {
    color: '#F91250',
    fontSize: 30,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9D9D9D',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  inBodyEmptyBox: {
    width: '95%',
    height: 140,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  emptyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    lineHeight: 26,
    paddingTop: 2,
    marginLeft: 10,
  },
  uploadButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 70,
    marginTop: 10,
    marginLeft: 7,
    alignItems: 'center',
    alignSelf: 'flex-start',
    
  },
  uploadButtonText: {
    color: '#DDFB21',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyImage: {
    width: 85,
    height: 85,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  
  
  
  
  
});

export default HomeScreen;
