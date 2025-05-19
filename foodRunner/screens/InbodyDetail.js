import React, { useState, useEffect } from 'react';
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
import * as ImagePicker from 'expo-image-picker'; // 이미지 선택용 (예: Expo 사용 시)
import AsyncStorage from '@react-native-async-storage/async-storage'; // 상단 import 필요import * as ImagePicker from 'expo-image-picker';
const { MediaType } = ImagePicker;


const screenWidth = Dimensions.get('window').width;

const CustomLineChart = ({ data, title = '', noBorder = false  }) => {
  const graphWidth = screenWidth - 100;
  const graphHeight = 200;
  const paddingLeft = 15;   // 왼쪽 패딩
  const paddingRight = 40;
  const pointSpacing = (graphWidth - paddingLeft - paddingRight) / (data.length - 1);

  const minY = Math.min(...data.map(d => d.y)) - 2;
  const maxY = Math.max(...data.map(d => d.y)) + 2;
  const yRange = maxY - minY;

  const points = data.map((d, idx) => {
    const x = paddingLeft + idx * pointSpacing;
    const y = graphHeight - 20 - ((d.y - minY) / yRange) * (graphHeight - 40);
    return { x, y, value: d.y };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');


  return (
    <View style={{
      paddingVertical: 10,
      marginBottom: -120
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }}>
        <View style={{ width: 80, alignItems: 'flex-end', paddingRight: 10 }}>
          {title ? (
            <Text style={{ color: 'white', fontSize: 12, fontWeight: "bold"}}>{title}</Text>
          ) : null}
        </View>
        {/* 가운데 세로 구분선 */}
        <View style={{ width: 1, backgroundColor: '#aaa', height: graphHeight - 80, marginRight: 10 }} />

        <Svg width={graphWidth} height={graphHeight + (title === "체지방량(kg)" ? 30 : 0)}>
          {/* 기존 선 + 점 */}
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke="#555555"
            strokeWidth="4"
          />
          {points.map((p, idx) => (
            <React.Fragment key={idx}>
              <Circle cx={p.x} cy={p.y} r="3.5" fill="#DDFB21" />
              <SvgText
                x={p.x}
                y={p.y - 10}
                fontSize="12"
                fill="white"
                textAnchor="middle"

              >
                {p.value.toFixed(1)}
              </SvgText>
            </React.Fragment>
          ))}
          {title === "체지방량(kg)" && points.map((p, idx) => (
            <React.Fragment key={`label-${idx}`}>
              <SvgText
                x={p.x}
                y={graphHeight - 7}
                fontSize="10"
                fill="white"
                textAnchor="middle"
              >
                {data[idx]?.x.split('.')[0]}
              </SvgText>
              <SvgText
                x={p.x}
                y={graphHeight + 5}
                fontSize="10"
                fill="white"
                textAnchor="middle"
              >
                {data[idx]?.x.split('.').slice(1).join('.')}
              </SvgText>
            </React.Fragment>
          ))}
        </Svg>
      </View>
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
    <Text style={[styles.bodyLabel, styles.center]}>
      {(Array.isArray(labels.trunk) ? labels.trunk : [labels.trunk]).map((line, idx) => (
        <Text key={idx}>{line}{'\n'}</Text>
      ))}
    </Text>

  </View>
);

export default function InbodyDetail() {
  const [inbodyList, setInbodyList] = useState([]); // ✅ 전체 리스트
  const [inbodyData, setInbodyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inbodyPartData, setInbodyPartData] = useState(null);
  

  
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

  
  
  const fetchInbodyImages = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get(
      'http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/inbody/image-info',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return res.data;
  };

  const getInbodyByDate = (date) => {
    return inbodyList.find(item => formatDate(item.createdAt) === date);
  };

  const currentInbody = getInbodyByDate(selectedDate);
  const dateOptions = inbodyList.map(item => formatDate(item.createdAt));

  useEffect(() => {
    const fetchInbodyData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('❗ 로그인 후 이용 가능합니다');
        return;
      }
  
      try {
        const response = await axios.get(
          'http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/inbody/inbody-info',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const data = response.data || [];
        console.log('✅ 인바디 데이터:', data);
  
        // 데이터 저장
        setInbodyList(data);
  
        // 최신 날짜 자동 선택
        if (data.length > 0) {
          const latestDate = formatDate(data[0].createdAt);
          setSelectedDate(latestDate);
        }
      } catch (error) {
        console.error('❌ 인바디 조회 실패:', error);
        if (error.response?.status === 401) {
          alert('❗ 인증 실패: 다시 로그인해주세요');
        } else {
          alert('데이터 조회 중 오류 발생');
        }
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
  }, [selectedDate, currentInbody]);


  const generateGraphData = (field) => {
    if (!inbodyList || !Array.isArray(inbodyList)) return [];
  
    return inbodyList.map(item => {
      const date = item.createdAt?.split("T")[0] || "날짜없음";
      return {
        x: date.replace(/-/g, "."),
        y: item[field] || 0,
      };
    }).reverse(); // 최신순 정렬
  };
  const muscleFatStandards = {
    weight:     { min: 40, midStart: 50, midEnd: 70, max: 100 },
    muscleMass: { min: 18, midStart: 20, midEnd: 25, max: 35 },
    fatMass:    { min: 15, midStart: 18, midEnd: 28, max: 45 },
    bmi:        { min: 10, midStart: 18.5, midEnd: 25, max: 40 },
    fatPercent: { min: 5, midStart: 18, midEnd: 28, max: 45 },
  };
  


  const data = currentInbody;


  // 그래프 렌더 전에 체크
  if (!data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.page}>
          <Text style={{ color: '#fff', padding: 20 }}>해당 날짜에 인바디 데이터가 없습니다.</Text>
          <BottomNavigation />
        </View>
      </SafeAreaView>
    );
  }

  const BASE_URL = 'http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080'; // ✅ 추가

  const handleImageUpload = async () => {
    console.log("📌 버튼 클릭됨");
    // ✅ 1. accessToken 확인
    const token = await AsyncStorage.getItem('token');
    console.log("📦 저장된 accessToken:", token);

    if (!token) {
      alert("❗ 로그인 후 사용 가능합니다.");
      return;
    }

    // ✅ 2. 권한 요청
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("✅ 권한 granted?:", permission.granted);

    if (!permission.granted) {
      alert("사진 접근 권한이 필요합니다.");
      return;
    }

    console.log("📸 이미지 선택 창 실행 전");
    // ✅ 3. 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.IMAGE],
      allowsEditing: true,
      quality: 1,
    });
    console.log("✅ 선택된 이미지:", result);
    console.log("✅ 이미지 선택 결과:", result);


    if (result.canceled || !result.assets?.length) {
      alert("이미지를 선택하지 않았습니다.");
      return;
    }

    const imageAsset = result.assets[0];

    // ✅ 4. FormData 구성
    const formData = new FormData();
    formData.append('file', {
      uri: imageAsset.uri,
      type: 'image/jpeg',
      name: 'inbody.jpg',
    });

    // ✅ 5. 서버 업로드 요청
    try {
      const response = await axios.post(
        `${BASE_URL}/inbody/imageUpload`, // ✅ BASE_URL 사용
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('✅ 업로드 성공!');
      console.log('서버 응답:', response.data);
    } catch (error) {
      console.error('❌ 업로드 실패:', error);
      if (error.response?.status === 401) {
        alert('❗ 인증 실패: 로그인 다시 해주세요');
      } else {
        alert('❌ 업로드 중 오류 발생');
      }
    }
  };

  

  const GraphBar = ({ value, min, midStart, midEnd, max }) => {
    const totalRange = max - min;
    const percent = Math.min(Math.max((value - min) / totalRange, 0), 1);
  
    const barPercent = percent * 100;
    const midStartPercent = ((midStart - min) / totalRange) * 100;
    const midEndPercent = ((midEnd - min) / totalRange) * 100;

  
    return (
      <View style={{ marginBottom: 30 }}>
        <View style={styles.rangeNumberRow}>
          <Text style={styles.rangeNumber}>{min}</Text>
          <Text style={[styles.rangeNumber, { left: `${midStartPercent}%`, position: 'absolute' }]}>{midStart}</Text>
          <Text style={[styles.rangeNumber, { left: `${midEndPercent}%`, position: 'absolute' }]}>{midEnd}</Text>
          <Text style={[styles.rangeNumber, { position: 'absolute', right: 0 }]}>{max} (%)</Text>
        </View>
  
        {/* 바 영역 */}
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${barPercent}%` }]}>
            <Text style={styles.barTextInside}>{value}</Text>
          </View>
          {/* 기준선 */}
          <View style={[styles.standardLine, { left: `${midStartPercent}%` }]} />
          <View style={[styles.standardLine, { left: `${midEndPercent}%` }]} />
        </View>
      </View>
    );
  };
  
  
  

  const dataList = [
    {
      title: '체중(kg)',
      data: generateGraphData('weight'),
    },
    {
      title: '골격근량(kg)',
      data: generateGraphData('skeletalMuscleMass'),
    },
    {
      title: '체지방량(kg)',
      data: generateGraphData('bodyFatAmount'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}> {/* ✅ 상단만 감싸기 */}
      <View style={styles.page}>
        <ScrollView style={styles.container}>
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

        {/* 날짜 모달 */}
        <Modal transparent visible={modalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={dateOptions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { setSelectedDate(item); setModalVisible(false); }} style={styles.dateOption}>
                      <Text style={[styles.optionText, item === selectedDate && { color: '#fff', fontWeight: 'bold' }]}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>

          {currentInbody ? (
            <View>
              <Text style={styles.sectionTitle}>✅ 인바디 결과</Text>
              <Text style={styles.infoText}>체중: {currentInbody.weight}kg</Text>
              <Text style={styles.infoText}>골격근량: {currentInbody.skeletalMuscleMass}kg</Text>
              <Text style={styles.infoText}>체지방량: {currentInbody.bodyFatAmount}kg</Text>
              <Text style={styles.infoText}>BMI: {currentInbody.bmi}</Text>
              <Text style={styles.infoText}>체지방률: {currentInbody.bodyFatPercentage}%</Text>
              <Text style={styles.infoText}>단백질: {currentInbody.protein}kg</Text>
              <Text style={styles.infoText}>무기질: {currentInbody.minerals}kg</Text>
              <Text style={styles.infoText}>체수분: {currentInbody.bodyWater}L</Text>
              <Text style={styles.infoText}>근육분석: {currentInbody.segmentalLeanAnalysis}</Text>
              <Text style={styles.infoText}>지방분석: {currentInbody.segmentalFatAnalysis}</Text>
            </View>
          ) : (
            <Text style={{ color: 'gray', textAlign: 'center', marginTop: 40 }}>선택된 날짜에 데이터가 없습니다</Text>
          )}

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleImageUpload}
            style={{
              backgroundColor: '#DDFB21',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>인바디 이미지 업로드</Text>
          </TouchableOpacity>

      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>체성분분석</Text>
        <Text style={styles.inbodyText}>InBody</Text>
      </View>
      <View style={styles.analysisBox}>
        <View style={styles.analysisRow}>
          {/* 왼쪽 항목 */}
          <View style={styles.labelColumn}>
            <Text style={styles.labelText1}>체수분(L)</Text>
            <Text style={styles.labelText2}>단백질(kg)</Text>
            <Text style={styles.labelText3}>무기질(kg)</Text>
          </View>

          {/* 세로 구분선 */}
          <View style={styles.verticalLine} />

          {/* 오른쪽 수치 */}
          <View style={styles.valueColumn}>
            <Text style={styles.valueText}>{currentInbody.bodyWater} (26.4 ~ 32.2)</Text>
            <Text style={styles.valueText}>{currentInbody.protein} (6.0 ~ 8.0)</Text>
            <Text style={styles.valueText}>{currentInbody.minerals} (2.5 ~ 3.5)</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>골격근 지방분석</Text>
      </View>
      <View style={styles.analysisBox}>
        {[
          { key: 'weight', label: '체중(kg)', value: currentInbody.weight },
          { key: 'muscleMass', label: '골격근량(kg)', value: currentInbody.skeletalMuscleMass },
          { key: 'fatMass', label: '체지방량(kg)', value: currentInbody.bodyFatAmount },
        ].map(({ key, label, value }) => {
          const { min, midStart, midEnd, max } = muscleFatStandards[key];
          return (
            <View key={key} style={styles.graphRow}>
              <Text style={styles.graphLabel}>{label}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.rangeLabelRow}>
                  <Text style={styles.rangeLabel}>표준이하</Text>
                  <Text style={styles.rangeLabel2}>표준</Text>
                  <Text style={styles.rangeLabel}>표준이상</Text>
                </View>
                <GraphBar value={value} min={min} midStart={midStart} midEnd={midEnd} max={max} />
              </View>
            </View>
          );
        })}
      </View>

      // 비만 분석
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>비만 분석</Text>
      </View>
      <View style={styles.analysisBox}>
        {[
          { key: 'bmi', label: 'BMI(kg/m²)', value: currentInbody.bmi },
          { key: 'fatPercent', label: '체지방률(%)', value: currentInbody.bodyFatPercentage },
        ].map(({ key, label, value }) => {
          const { min, midStart, midEnd, max } = muscleFatStandards[key];
          return (
            <View key={key} style={styles.graphRow}>
              <Text style={styles.graphLabel}>{label}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.rangeLabelRow}>
                  <Text style={styles.rangeLabel}>표준이하</Text>
                  <Text style={styles.rangeLabel2}>표준</Text>
                  <Text style={styles.rangeLabel}>표준이상</Text>
                </View>
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
        
        <View style={{ backgroundColor: '#000', marginTop: 20 }}>
            <Text style={styles.sectionTitle}>신체변화</Text>
            <CustomLineChart title="체중(kg)" data={generateGraphData('weight')} />
            <CustomLineChart title="골격근량(kg)" data={generateGraphData('skeletalMuscleMass')} />
            <CustomLineChart title="체지방량(kg)" data={generateGraphData('bodyFatAmount')} noBorder />
          </View>




          <View style={{ height: 200 }} />
    </ScrollView>
    </View>
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
    padding: 20
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
    fontSize: 18,
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
    alignItems: 'stretch',
  },
  labelColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  verticalLine: {
    borderLeftWidth: 1,
    borderColor: '#aaa',
    marginHorizontal: 10,
    alignSelf: 'stretch',
  },
  valueColumn: {
    flex: 3,
    justifyContent: 'space-between',
  },
  labelText1: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 14,
    marginTop: 4
  },
  labelText2: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 14,
    marginTop: 4
  },
  labelText3: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 14,
    marginTop: 4
  },
  labelText4: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 14,
    marginTop: 40
  },
  labelText5: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    marginTop: 4
  },
  labelText6: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 30,
    marginTop: 4
  },
  labelText7: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 14,
    marginTop: 40, // 그래프 높이 맞춰 조절
  },
  labelText8: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 14,
    marginTop: 4,
  },
  valueText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    marginLeft: 10,
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
    textAlign: 'center',
  },
  rangeLabel2: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    marginRight: 77,
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
  
  barBackground: {
    backgroundColor: '#D9D9D9',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    backgroundColor: '#DDFB21',
    height: '70%',
    marginTop: '1%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 4,
    borderTopRightRadius: 7,      // ✅ 둥글게
    borderBottomRightRadius: 7,  
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
    width: '120%',
    height: '120%',
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
    left: '61%',
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
    height: 14, 
    borderRadius: 7, 
    overflow: 'hidden', 
    position: 'relative' 
  },
  barFill: { 
    backgroundColor: '#DDFB21', 
    height: '70%', 
    marginTop: '1%', 
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
    marginBottom: 16,
  },
  graphLabel: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'right',
    height: 70, // ✅ 각 그래프에 맞게 라벨 높이 고정
    lineHeight: 70,
  },
  
  

  rangeLabelCenter: {
    color: '#fff',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  
});
