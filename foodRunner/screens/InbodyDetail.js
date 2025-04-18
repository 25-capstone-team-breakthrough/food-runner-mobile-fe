import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList
} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ 추가
import BottomNavigation from "../components/BottomNavigation";
import { Image } from 'react-native';


const dateList = ['2025.02.08', '2025.01.08', '2024.12.28', '2024.10.14'];

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
  const [selectedDate, setSelectedDate] = useState('2025.02.08');
  const [modalVisible, setModalVisible] = useState(false);
  const [inbodyPartData, setInbodyPartData] = useState(null);

  const inbodyData = {
    '2025.02.08': { 체수분: 26.5, 단백질: 26.5, 무기질: 26.5, 체중: 59.1, 골격근: 19.5, 체지방: 22.8, BMI: 24.0, 체지방률: 38.6 },
    '2025.01.08': { 체수분: 25.8, 단백질: 25.1, 무기질: 25.4, 체중: 57.3, 골격근: 18.8, 체지방: 23.1, BMI: 23.5, 체지방률: 36.4 },
    '2024.12.28': { 체수분: 25.1, 단백질: 24.7, 무기질: 25.0, 체중: 56.9, 골격근: 18.5, 체지방: 24.0, BMI: 24.1, 체지방률: 37.2 },
    '2024.10.14': { 체수분: 24.3, 단백질: 24.2, 무기질: 24.1, 체중: 56.0, 골격근: 18.1, 체지방: 25.1, BMI: 24.6, 체지방률: 38.0 },
  };

  useEffect(() => {
    // TODO: 백엔드 API 연동으로 교체
    const fakeAPIResponse = {
      muscleParts: {
        leftArm: ['표준'],
        rightArm: ['표준'],
        leftLeg: ['표준'],
        rightLeg: ['표준'],
        trunk: ['표준', '이하'], // ⬅️ 줄바꿈 대신 배열로
      },
      fatParts: {
        leftArm: ['표준'],
        rightArm: ['표준'],
        leftLeg: ['표준'],
        rightLeg: ['표준'],
        trunk: ['표준'],
      }
    };
    
    setInbodyPartData(fakeAPIResponse);
  }, [selectedDate]);



  const data = inbodyData[selectedDate];

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
  
  
  

  return (
    <SafeAreaView style={styles.safeArea}> {/* ✅ 상단만 감싸기 */}
      <View style={styles.page}>
        <ScrollView style={styles.container}>
          <View style={styles.dateRow}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dateButton}>
              <Text style={styles.dateText}>{selectedDate}</Text>
              <Text style={styles.arrow}>⌃</Text>
            </TouchableOpacity>
          </View>

          {/* 모달 날짜 리스트 */}
          <Modal transparent={true} visible={modalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={dateList}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dateOption}
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
                  )}
                />
              </View>
            </View>
          </Modal>

          {/* 분석 영역 */}
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
                    <Text style={styles.valueText}>26.5 (26.4 ~ 32.2)</Text>
                    <Text style={styles.valueText}>26.5 (26.4 ~ 32.2)</Text>
                    <Text style={styles.valueText}>26.5 (26.4 ~ 32.2)</Text>
                </View>
            </View>
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>골격근 지방분석</Text>
        </View>

        

        <View style={styles.analysisBox}>
            <View style={styles.analysisRow}>
                {/* 왼쪽 텍스트 */}
                <View style={styles.labelColumn}>
                    <Text style={styles.labelText4}>체중(kg)</Text>
                    <Text style={styles.labelText5}>골격근량(kg)</Text>
                    <Text style={styles.labelText6}>체지방량(kg)</Text>
                </View>
                {/* 세로 구분선 */}
                <View style={styles.verticalLine} />
                {/* 오른쪽 그래프 */}
                <View style={styles.valueColumn}>
                  {/* 상단 텍스트 구간: 범주 설명 + 기준 값 */}
                <View style={styles.rangeLabelRow}>
                  <Text style={styles.rangeLabel}>표준이하</Text>
                  <Text style={styles.rangeLabel2}>표준</Text>
                  <Text style={styles.rangeLabel}>표준이상</Text>
                </View>
                <GraphBar value={110} min={55} midStart={85} midEnd={115} max={205} />
                <GraphBar value={85} min={70} midStart={90} midEnd={110} max={170} />
                <GraphBar value={170} min={40} midStart={80} midEnd={160} max={520} />
                   
                </View>
            </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>비만 분석</Text>
        </View>

        <View style={styles.analysisBox}>
          <View style={styles.analysisRow}>
            {/* 왼쪽 텍스트 */}
            <View style={styles.labelColumn}>
              <Text style={styles.labelText7}>BMI(kg/m²)</Text>
              <Text style={styles.labelText8}>체지방률(%)</Text>
            </View>

            {/* 세로 구분선 */}
            <View style={styles.verticalLine} />

            {/* 오른쪽 그래프 */}
            <View style={styles.valueColumn}>
              {/* 범주 레이블 한 번만 표시 */}
              <View style={styles.rangeLabelRow}>
                <Text style={styles.rangeLabel}>표준이하</Text>
                <Text style={styles.rangeLabel2}>표준</Text>
                <Text style={styles.rangeLabel}>표준이상</Text>
              </View>

              <GraphBar value={data.BMI} min={10.0} midStart={18.5} midEnd={25.0} max={55.0} />
              <GraphBar value={data.체지방률} min={8.0} midStart={18.0} midEnd={28.0} max={58.0} />
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>부위별 분석</Text>
        </View>

        {inbodyPartData && (
            <View>
              <Text style={styles.sectionTitle}>부위별 근육분석</Text>
              <View style={styles.bodyRow}>
                <PartAnalysisBox labels={inbodyPartData.muscleParts} />
                <PartAnalysisBox labels={inbodyPartData.fatParts} />
              </View>
              
            </View>
          )}
    </ScrollView>

        
    </View>
    <BottomNavigation/>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  page: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    padding: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#C8FF00',
    width: 220,
  },
  dateOption: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  optionText: {
    color: '#888',
    fontSize: 18,
  },
  sectionTitle: {
    color: '#E1FF01',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
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
  
});
