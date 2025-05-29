import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ 추가
import BottomNavigation from "../components/BottomNavigation";
import { Image } from 'react-native';
import { Dimensions } from 'react-native';
import Svg, { Polyline, Circle, Text as SvgText } from 'react-native-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 상단 import 필요import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import InbodyUpload from '../components/InbodyUpload'; // ✅ 업로드 컴포넌트



const screenWidth = Dimensions.get('window').width;


const CardChart = ({ title, data = [], unit = 'kg', showXAxis = false }) => {
  const chartPadding = 40;
  const titleWidth = 80;
  const chartWidth = screenWidth - chartPadding;
  const svgWidth = chartWidth - titleWidth;
  const chartHeight = 100;
  const paddingTop = 26;
  const paddingLeft = 15;
  const paddingRight = 20;
  const paddingBottom = 24;
  const pointRadius = 4;
  const fontSize = 11;

  const cleanedData = data
  .map(d => ({
    ...d,
    value: typeof d.value === 'number' && !isNaN(d.value)
      ? d.value
      : Number(d.value) || 0  // 숫자 변환 실패시 0
  }))
  .filter(d => !isNaN(d.value));

  const values = cleanedData.map(d => typeof d.value === 'number' ? d.value : 0);


  if (!data.length || data.some(d => typeof d.value !== 'number' || isNaN(d.value))) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: titleWidth, paddingLeft: 8 }}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{title}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text style={{ color: '#888' }}>데이터 없음</Text>
        </View>
      </View>
    );
  }
  
  const max = Math.max(...values);
  const min = Math.min(...values);
  const valueRange = max - min || 1;

  const xSpacing =
  data.length > 1
    ? (svgWidth - paddingLeft - paddingRight) / (data.length - 1)
    : 0;

  const getX = i => paddingLeft + i * xSpacing;
  const getY = val =>
    paddingTop + (1 - (val - min) / valueRange) * (chartHeight - paddingTop - paddingBottom);
  const route = useRoute(); // 👈 route 객체 가져오기

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
      <View style={{ width: titleWidth, paddingLeft: 8 }}>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{title}</Text>
      </View>

      <Svg width={svgWidth} height={chartHeight + 24}>
        {cleanedData.length > 1 && (
          <Polyline
            points={cleanedData.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ')}
            stroke="#555555"
            strokeWidth={4}
            fill="none"
          />
        )}
        {cleanedData.map((d, i) => {
          const x = getX(i);
          const y = getY(d.value);
          const [yyyy, mm, dd] = d.date.split('.');
          return (
            <React.Fragment key={i}>
              <Circle cx={x} cy={y} r={pointRadius} fill="#DDFB21" />
              <SvgText
                x={x}
                y={y - 8}
                fontSize={fontSize}
                fill="#fff"
                textAnchor="middle"
              >
                {d.value.toFixed(1)}
              </SvgText>
              {showXAxis && (
                <>
                  <SvgText
                    x={x}
                    y={chartHeight + 10}
                    fontSize={10}
                    fill="#fff"
                    fontWeight={'bold'}
                    textAnchor="middle"
                  >
                    {yyyy}
                  </SvgText>
                  <SvgText
                    x={x}
                    y={chartHeight + 22}
                    fontSize={10}
                    fill="#fff"
                    fontWeight={'bold'}
                    textAnchor="middle"
                  >
                    {`${mm}.${dd}`}
                  </SvgText>
                </>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};




const PartAnalysisBox = ({ labels }) => (
  <View style={styles.bodyBox}>
    {/* 세로선 */}
    <View style={styles.verticalLineOverlay} />
    {/* 가로선 */}
    <View style={styles.horizontalLineOverlay} />
    <Image source={require('../assets/body_front.png')} style={styles.bodyImage} />
    <Text style={[styles.bodyLabel, styles.topLeft]}>{labels.leftArm}</Text>
    <Text style={[styles.bodyLabel, styles.topRight]}>{labels.rightArm}</Text>
    <Text style={[styles.bodyLabel, styles.bottomLeft]}>{labels.leftLeg}</Text>
    <Text style={[styles.bodyLabel, styles.bottomRight]}>{labels.rightLeg}</Text>
    <Text style={[styles.bodyLabel, styles.center, { color: '#000' }]}>
      {labels.trunk.length > 2
        ? `${labels.trunk.slice(0, 2)}\n${labels.trunk.slice(2)}`
        : labels.trunk}
    </Text>


  </View>
);

export default function InbodyDetail() {
  const [inbodyList, setInbodyList] = useState([]); // ✅ 전체 리스트
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inbodyPartData, setInbodyPartData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [customSheetVisible, setCustomSheetVisible] = useState(false);
  const [plusButtonLayout, setPlusButtonLayout] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      alert("📷 사진 접근 권한이 필요합니다.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      // mediaTypes: ImagePicker.MediaTypeOptions.Images, // Deprecated지만 사용 가능
    });
  
    console.log("📦 선택 결과:", result);
  
    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      console.log("선택된 이미지 URI:", uri);
      uploadImage(uri);
    } else {
      alert("이미지가 선택되지 않았습니다.");
    }
  };
  
  // const openGallery = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
  //   if (!result.canceled && result.assets?.length > 0) {
  //     const uri = result.assets[0].uri;
  //     uploadImage(uri); // ✅ 업로드 함수 호출
  //   }
  // };
  const navigation = useNavigation();
  const route = useRoute(); // ✅ 여기에 위치

  useEffect(() => {
    if (route.params?.openUploadModal) {
      setTimeout(() => {
        setCustomSheetVisible(true); // ✅ 자동으로 업로드 모달 열기
      }, 300);
    }
  }, [route.params]);

  const calculateStandards = (userInfo) => {
    if (!userInfo || !userInfo.height || !userInfo.gender) {
      return {}; // 기본값 또는 예외 처리
    }
    
    const gender =
    userInfo.gender === '남' || userInfo.gender === 'male' ? 'male' : 'female';
    const { height, age, weight } = userInfo;
    const heightM = height / 100;
  
    // 1. 표준 체중 (BMI 기준 22 적용)
    const standardWeight = 22 * (heightM ** 2);
    const weightRange = {
      min: standardWeight * 0.8,         // 표준 이하
      midStart: standardWeight * 0.9,    // 표준 시작
      midEnd: standardWeight * 1.1,      // 표준 끝
      max: standardWeight * 1.4          // 표준 이상
    };
  
    // 2. 골격근량 (근육량은 성별/키 기반 추정)
    let standardMuscle;
    if (gender === 'male') {
      standardMuscle = height * 0.2;  // 기존보다 낮춘 기준
    } else {
      standardMuscle = height * 0.17;
    }
    
    const muscleMass = {
      standard: standardMuscle,
      min: standardMuscle * 0.8,
      midStart: standardMuscle * 0.9,
      midEnd: standardMuscle * 1.1,
      max: standardMuscle * 1.4
    };
  
    // 3. 체지방량 (성별 평균 체지방률을 키와 성별로 설정 후 역산)
    let fatPercentStandard;
    if (gender === 'male') {
      fatPercentStandard = 15;
      if (age >= 40) fatPercentStandard += 3;
    } else {
      fatPercentStandard = 23;
      if (age >= 40) fatPercentStandard += 4;
    }
    const fatWeightStandard = fatPercentStandard / 100 * standardWeight;
    const fatMass = {
      min: fatWeightStandard * 0.7,
      midStart: fatWeightStandard * 0.9,
      midEnd: fatWeightStandard * 1.1,
      max: fatWeightStandard * 1.6
    };
  
    // 4. BMI (고정값)
    const bmi = {
      min: 10,
      midStart: 18.5,
      midEnd: 23,
      max: 35
    };
  
    // 5. 체지방률 (%)
    const fatPercent = gender === 'male'
      ? { min: 5, midStart: 10, midEnd: 20, max: 35 }
      : { min: 10, midStart: 18, midEnd: 28, max: 45 };

    // 6. 체성분 수치 기준 추가
    const bodyWaterStandard = gender === 'male' ? weight * 0.6 : weight * 0.5;
    const bodyWater = {
      min: bodyWaterStandard * 0.9,
      max: bodyWaterStandard * 1.1,
    };
    const protein = {
      min: weight * 0.08,
      max: weight * 0.12,
    };
    const minerals = {
      min: 2.5,  // 보통 고정
      max: 3.5,
    };

  
    return {
      weight: weightRange,
      muscleMass,
      fatMass,
      bmi,
      fatPercent,
      bodyWater,
      protein,
      minerals,
    };
  };

  

  
  // 날짜 정제 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  const fetchInbodyData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get('http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/inbody/inbody-info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data || [];
      setInbodyList(data);
      if (data.length > 0) {
        const latest = formatDate(data[0].createdAt);
        setSelectedDate(latest);
      }
    } catch (err) {
      console.error('❌ 인바디 조회 실패:', err);
    }
  };

  const getInbodyByDate = (date) => {
    return inbodyList.find(item => formatDate(item.createdAt) === date);
  };

  const currentInbody = getInbodyByDate(selectedDate) || {
    weight: 0, skeletalMuscleMass: 0, bodyFatAmount: 0, bmi: 0,
    bodyFatPercentage: 0, protein: 0, minerals: 0, bodyWater: 0,
    segmentalLeanAnalysis: '표준,표준,표준,표준,표준',
    segmentalFatAnalysis: '표준,표준,표준,표준,표준',
  };
  
  
  
  const dateOptions = inbodyList.map(item => formatDate(item.createdAt));

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await axios.get('http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/BMI/info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(res.data); // { age, gender, height, weight }
        console.log('🧍 userInfo:', res.data); // 👈 요기 넣으세요
      } catch (err) {
        console.error('❌ 사용자 BMI 정보 조회 실패:', err);
      }
    };
  
    fetchUserInfo();
  }, []);
  

  useEffect(() => {
    const fetchInbodyData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
  
      try {
        const response = await axios.get(
          'http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/inbody/inbody-info',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
  
        const data = response.data || [];
        console.log('✅ 인바디 데이터:', data);
  
        // 빈 배열이면 더미 데이터 삽입
        if (data.length === 0) {
          const dummy = {
            createdAt: new Date().toISOString(),
            weight: 0,
            skeletalMuscleMass: 0,
            bodyFatAmount: 0,
            bmi: 0,
            bodyFatPercentage: 0,
            protein: 0,
            minerals: 0,
            bodyWater: 0,
            segmentalLeanAnalysis: '표준,표준,표준,표준,표준',
            segmentalFatAnalysis: '표준,표준,표준,표준,표준',
          };
          data.push(dummy);
        }
  
        setInbodyList(data);
  
        // 최초 날짜 선택
        const latest = formatDate(data[0].createdAt);
        setSelectedDate(latest);
  
      } catch (error) {
        console.error('❌ 인바디 조회 실패:', error);
      }
    };
  
    fetchInbodyData();
  }, []);
  
  

  useEffect(() => {
    if (!currentInbody) return;
  
    const parseAnalysis = (str) => {
      const parts = str.split(',');
      return {
        leftArm: parts[0],
        rightArm: parts[1],
        trunk: parts[2],
        leftLeg: parts[3],
        rightLeg: parts[4],
      };
    };
  
    const updatedPartData = {
      muscleParts: parseAnalysis(currentInbody.segmentalLeanAnalysis),
      fatParts: parseAnalysis(currentInbody.segmentalFatAnalysis),
    };
  
    setInbodyPartData(updatedPartData);
  }, [selectedDate]); // ✅ currentInbody 제거
  
  const tripleData = inbodyList.map(item => ({
    date: formatDate(item.createdAt),
    weight: item.weight,
    muscle: item.skeletalMuscleMass,
    fat: item.bodyFatAmount,
  })).reverse();

  const weightData = inbodyList.map(item => ({
    date: formatDate(item.createdAt),
    value: item.weight ?? 0
  })).reverse();

  const muscleData = inbodyList.map(item => ({
    date: formatDate(item.createdAt), 
    value: item.skeletalMuscleMass ?? 0
  })).reverse();
  
  const fatData = inbodyList.map(item => ({
    date: formatDate(item.createdAt),
    value: item.bodyFatAmount ?? 0
  })).reverse();
  

  const generateGraphData = (field) => {
    if (!inbodyList || !Array.isArray(inbodyList) || inbodyList.length === 0) {
      return [{ x: '데이터없음', y: 0 }];
    }
  
    return inbodyList.map(item => {
      const date = item.createdAt?.split("T")[0] || "날짜없음";
      return {
        x: date.replace(/-/g, "."),
        y: item[field] || 0,
      };
    }).reverse(); // 최신순 정렬
  };
  const muscleFatStandards = useMemo(() => {
    const standards = calculateStandards(userInfo);
    return standards;
  }, [userInfo]);
  
  
  
  

  const BASE_URL = 'http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080'; // ✅ 추가

  const uploadImage = async (localUri) => {
    setIsUploading(true); // ✅ 시작 시 true
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
  
      formData.append("file", {
        uri: localUri,
        type: "image/jpeg",
        name: "upload.jpg",
      });
  
      const response = await fetch(`${BASE_URL}/inbody/imageUpload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) throw new Error("업로드 실패");
  
      alert("이미지 업로드 완료!");
      await fetchInbodyData(); // 필요시
      setCustomSheetVisible(false);
    } catch (err) {
      console.error("❌ 업로드 오류", err);
      alert("업로드 실패");
    } finally {
      setIsUploading(false); // ✅ 종료 시 false
    }
  };
  
  
  
  const handlePickImage = async () => {
    console.log("🟡 handlePickImage 실행됨");
  
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("📛 권한 상태:", permissionResult.status);
  
    if (permissionResult.status !== 'granted') {
      alert("사진 접근 권한이 필요합니다.");
      return;
    }
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
        // mediaTypes: ImagePicker.MediaTypeOptions.Images, // 또는 제거 가능
      });
  
      console.log("📦 선택 결과:", result);
  
      if (result.canceled) {
        console.log("🚫 이미지 선택 취소됨");
        return;
      }
  
      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log("선택된 이미지 URI:", uri);
        await uploadImage(uri);
      } else {
        alert("이미지가 선택되지 않았습니다.");
      }
    } catch (err) {
      console.error("launchImageLibraryAsync 에러:", err);
      alert("갤러리 실행 중 오류가 발생했습니다.");
    }
  };

  const deleteInbody = async (inbodyId) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.delete(
        `http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/inbody/inbody-info/${inbodyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('인바디 정보가 삭제되었습니다.');
      fetchInbodyData(); // 삭제 후 리스트 갱신
    } catch (err) {
      console.error('❌ 인바디 삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };
  
  
  
  
  
  
  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("카메라 권한이 필요합니다.");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets?.length) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const GraphBar = ({ value, min, midStart, midEnd, max }) => {
    const totalRange = max - min;
    const clamp = (v) => Math.max(0, Math.min(100, v));
  
    const barPercent = clamp(((value - min) / totalRange) * 100);
    const midStartPercent = ((midStart - min) / totalRange) * 100;
    const midEndPercent = ((midEnd - min) / totalRange) * 100;
    const midCenterPercent = (midStartPercent + midEndPercent) / 2;
  
    return (
      <View style={{ marginBottom: 30 }}>
        {/* 라벨 영역 */}
        <View style={styles.rangeLabelRow}>
          <Text style={styles.rangeLabel}>표준이하</Text>
          <View style={{ position: 'absolute', left: `${midCenterPercent}%`, transform: [{ translateX: -20 }] }}>
            <Text style={styles.rangeLabel2}>표준</Text>
          </View>
          <Text style={styles.rangeLabel3}>표준이상</Text>
        </View>
  
        {/* 바 영역 */}
        <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${Math.max(barPercent, 2)}%`, alignItems: 'flex-end' }]}>
          <Text style={styles.barTextInside}>{value.toFixed(1)}</Text>
        </View>
          <View style={[styles.standardLine, { left: `${midStartPercent}%` }]} />
          <View style={[styles.standardLine, { left: `${midEndPercent}%` }]} />
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}> {/* ✅ 상단만 감싸기 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.dateButton}>
            <Text style={styles.dateText}>{selectedDate}</Text>
              <View style={styles.iconWrapper}>
                <MaterialIcons 
                  name={modalVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={28} 
                  color="#DDFB21"  // 노란색
                />
              </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            setPlusButtonLayout(layout);
          }}
          onPress={() => setCustomSheetVisible(true)}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>

      </View>
      <View style={styles.page}>
        <ScrollView style={styles.container}>
        
        {customSheetVisible && plusButtonLayout && (
          <Modal transparent animationType="fade" visible>
            <TouchableOpacity
              activeOpacity={1}
              onPressOut={() => setCustomSheetVisible(false)}
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: plusButtonLayout.y + plusButtonLayout.height + 70,
                  right: 20,
                  backgroundColor: '#222',
                  borderRadius: 16,
                  paddingVertical: 0,
                  width: 150,
                  elevation: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    borderBottomWidth: 1,
                    borderColor: '#444',
                  }}
                  onPress={openGallery}
                >
                  <Text style={{ color: '#fff', fontSize: 16 }}>사진 선택</Text>
                  <MaterialIcons name="photo-library" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                  }}
                  onPress={() => {
                    setCustomSheetVisible(false);
                    handleTakePhoto(); // ✅ 여기로 교체
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 16 }}>사진 찍기</Text>
                  <MaterialIcons name="photo-camera" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
        
        <Modal transparent visible={modalVisible} animationType="fade">
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalOverlay}
            onPressOut={() => setModalVisible(false)} // 👈 바깥 클릭 시 닫기
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={() => {}} // 👈 내부 터치 이벤트 무시 (닫히지 않도록)
            >
              <FlatList
                data={dateOptions}
                keyExtractor={(item, index) => `${item}_${index}`}
                renderItem={({ item }) => {
                  const target = inbodyList.find(i => formatDate(i.createdAt) === item);
                  return (
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 12,
                    }}>
                      <View style={{ flex: 1, paddingLeft: 57 }}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedDate(item);
                            setModalVisible(false);
                          }}
                        >
                          <Text style={[
                            styles.optionText,
                            item === selectedDate && { color: '#fff', fontWeight: 'bold' }
                          ]}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={() => deleteInbody(target?.inbodyId)}
                        style={{ paddingHorizontal: 8 }}
                      >
                        <MaterialIcons name="close" size={22} color="#FF4444" />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>

      </View>
      <View style={[styles.sectionHeader, { marginTop: -60, marginBottom: 4 }]}>
        <Text style={[styles.sectionTitle, { marginBottom: -50 }]}>골격근 지방분석</Text>        <Image
          source={require('../assets/InbodyLogo.png')}
          style={{ width: 400, height: 150, resizeMode: 'contain', marginLeft: -40, marginBottom: -60 }}
        />
      </View>

      <View style={styles.analysisBox}>
        {[
          { key: 'weight', label: '체중(kg)', value: currentInbody.weight },
          { key: 'muscleMass', label: '골격근량(kg)', value: currentInbody.skeletalMuscleMass },
          { key: 'fatMass', label: '체지방량(kg)', value: currentInbody.bodyFatAmount },
        ].map(({ key, label, value }) => {
          const ranges = muscleFatStandards?.[key];
          if (!ranges) return null;

          const { min, midStart, midEnd, max, standard } = ranges;

          return (
            <View key={key} style={styles.graphRow}>
              <Text style={styles.graphLabel}>{label}</Text>
              <View style={{ flex: 1 }}>
                <GraphBar value={value} min={min} midStart={midStart} midEnd={midEnd} max={max} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>비만 분석</Text>
      </View>
      <View style={styles.analysisBox}>
        {[
          { key: 'bmi', label: 'BMI(kg/m²)', value: currentInbody.bmi },
          { key: 'fatPercent', label: '체지방률(%)', value: currentInbody.bodyFatPercentage },
        ].map(({ key, label, value }) => {
          const ranges = muscleFatStandards?.[key];
          if (!ranges) return null;

          const { min, midStart, midEnd, max } = ranges;

          return (
            <View key={key} style={styles.graphRow}>
              <Text style={styles.graphLabel}>{label}</Text>
              <View style={{ flex: 1 }}>
                <GraphBar value={value} min={min} midStart={midStart} midEnd={midEnd} max={max} />
              </View>
            </View>
          );
        })}
      </View>

        {inbodyPartData && (
          <View style={styles.bodyRow}>
            {/* 왼쪽 - 근육분석 */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.bodySectionTitle}>부위별 근육분석</Text>
              <View style={{ width: '100%', aspectRatio: 0.65 }}>
                <PartAnalysisBox labels={inbodyPartData.muscleParts} />
              </View>
            </View>

            {/* 오른쪽 - 체지방분석 */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.bodySectionTitle}>부위별 체지방분석</Text>
              <View style={{ width: '100%', aspectRatio: 0.65 }}>
                <PartAnalysisBox labels={inbodyPartData.fatParts} />
              </View>
            </View>
          </View>
        )}
        <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>체성분분석</Text>
      </View>
      <View style={styles.analysisBox}>
        <View style={styles.analysisRow}>
          {/* 왼쪽 항목 */}
          <View style={styles.labelColumn}>
            <Text style={styles.labelText}>체수분(L)</Text>
            <Text style={styles.labelText}>단백질(kg)</Text>
            <Text style={styles.labelText}>무기질(kg)</Text>
          </View>

          {/* 세로 구분선 */}
          <View style={styles.verticalLine} />

          {/* 오른쪽 수치 */}
          <View style={styles.valueColumn}>
            <Text style={styles.valueText}>
              {currentInbody.bodyWater} ({muscleFatStandards.bodyWater?.min.toFixed(1)} ~ {muscleFatStandards.bodyWater?.max.toFixed(1)})
            </Text>
            <Text style={styles.valueText}>
              {currentInbody.protein} ({muscleFatStandards.protein?.min.toFixed(1)} ~ {muscleFatStandards.protein?.max.toFixed(1)})
            </Text>
            <Text style={styles.valueText}>
              {currentInbody.minerals} ({muscleFatStandards.minerals?.min.toFixed(1)} ~ {muscleFatStandards.minerals?.max.toFixed(1)})
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 20, backgroundColor: '#000', paddingHorizontal: 8 }}>
      <Text style={[styles.sectionTitle, { marginBottom: 30 }]}>신체변화</Text>
        <View>
        <CardChart title="체중 (kg)" unit="kg" data={weightData} />
        <CardChart title="골격근량 (kg)" unit="kg" data={muscleData} />
        <CardChart title="체지방량 (kg)" unit="kg" data={fatData} showXAxis={true} />
        </View>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
    </View>
    {isUploading && <InbodyUpload/>}
    <BottomNavigation/>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  bodySectionTitle: {
    color: '#E1FF01', // 형광 노란색
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 8, // 텍스트랑 박스 간격
    textAlign: 'center',
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  page: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    paddingHorizontal: 20, // 좌우 패딩만 유지
  },
  dateRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 8,
  },
  arrow: {
    color: '#fff',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#C8FF00',
    width: 280,
    marginTop: 130,
  },
  dateOption: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  optionText: {
    color: '#888',
    fontSize: 20,
  },
  sectionTitle: {
    color: '#E1FF01',
    fontSize: 22,
    marginTop: 10,
    fontWeight: 'bold',
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 18,
    backgroundColor: '#333333',  // 어두운 회색 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 2,
  },
  graphBox: {
    marginBottom: 20,
  },
  graphText: {
    color: '#fff',
    marginBottom: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  bodyRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 10 
  },
  inbodyText: {
    color: '#C8FF00',
    fontSize: 30,
    fontWeight: 'bold',
  },
  
  analysisBox: {
    backgroundColor: '#222',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  labelColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  verticalLine: {
    borderLeftWidth: 1,
    borderColor: '#aaa',
    marginHorizontal: 1,
    alignSelf: 'stretch',
  },
  
  valueColumn: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  labelText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  valueText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  barWrapper: {
    marginBottom: 20,
  },
  rangeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rangeLabel: {
    color: '#aaa',
    fontSize: 12,
    flex: 1,
    textAlign: 'left',
  },
  rangeLabel3: {
    color: '#aaa',
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  rangeLabel2: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  
  rangeNumberRow: {
    position: 'relative',
    height: 16,
    marginBottom: 4,
  },
  rangeNumber: {
    color: '#fff',
    fontSize: 11,
  },
  bodyBox: { 
    flex: 1, 
    aspectRatio: 0.65, 
    backgroundColor: '#222', 
    borderRadius: 20, 
    padding: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden' 
  },
  
  
  bodyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    opacity: 0.85,
  },
  
  bodyLabel: {
    position: 'absolute',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  topLeft: { 
    top: 20, 
    left: 30 
  },
  topRight: { 
    top: 20, 
    right: 30 
  },
  bottomLeft: { 
    bottom: 30, 
    left: 30 
  },
  bottomRight: { 
    bottom: 30, 
    right: 30 
  },
  center: {
    top: '45%',
    left: '50%',
    transform: [{ translateX: -20 }],
  },
  rangeNumberRow: { 
    position: 'relative', 
    height: 16, 
    marginBottom: 4 
  },
  rangeNumber: { 
    color: '#fff', 
    fontSize: 11 
  },
  barBackground: { 
    backgroundColor: '#D9D9D9', 
    height: 20, 
    borderRadius: 15, 
    overflow: 'hidden', 
    position: 'relative', 
    width: '100%',  
  },
  barFill: { 
    backgroundColor: '#DDFB21', 
    height: '100%', 
    marginTop: '0%', 
    justifyContent: 'center', 
    alignItems: 'flex-end', 
    paddingRight: 4, 
    borderTopRightRadius: 7, 
    borderBottomRightRadius: 7 
  },
  barTextInside: { 
    color: '#000', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  standardLine: { 
    position: 'absolute', 
    width: 1, 
    height: '100%', 
    backgroundColor: '#AAAAAA' 
  }, 
  verticalLineOverlay: {
    position: 'absolute',
    width: 1,
    height: '110%',
    backgroundColor: '#ccc',
    left: '56%',
    transform: [{ translateX: -0.5 }],
  },
  
  horizontalLineOverlay: {
    position: 'absolute',
    height: 1,
    width: '110%',
    backgroundColor: '#ccc',
    top: '50%',
    transform: [{ translateY: -0.5 }],
  },
  graphRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  graphLabel: {
    width: 100,
    color: '#fff',
    fontSize: 18,
    marginRight: 12,
  },
  
  

  rangeLabelCenter: {
    color: '#fff',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  chartCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  
  
});
