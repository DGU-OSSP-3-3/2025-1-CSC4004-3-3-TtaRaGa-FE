import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const CourseStartBottomCard = ({ elapsedTime, distance, estTime, calories, onEndRide }) => {
  return (
    <View style={styles.card}>
      {/* 경과 시간 */}
      <View style={styles.elapsedRow}>
        <Image
          source={require('../../assets/bicycle.jpg')} // ← 여기에 본인의 이미지 경로
          style={styles.timerIcon}
        />
        <View>
          <Text style={styles.sectionTitle}>경과 시간</Text>
          <Text style={styles.timerText}>{elapsedTime}</Text>
        </View>
        
      </View>
      {/* 정보 요약 - 그리드 형식 */}
      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>총 거리</Text>
          <Text style={styles.gridValue}>{distance}km</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>예상 소요 시간</Text>
          <Text style={styles.gridValue}>{estTime}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>예상 칼로리</Text>
          <Text style={styles.gridValue}>{calories}kcal</Text>
        </View>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.disabledButton} disabled>
          <Text style={styles.disabledText}>주변 대여소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.endButton} onPress={onEndRide}>
          <Text style={styles.endText}>라이딩 종료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 2,
    borderColor: '#A4D3A2',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  elapsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 가운데 정렬
    marginBottom: 16,
    gap: 24,
  },
  timerIcon: {
    width: 80,
    height: 55,
  },
  
  sectionTitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    marginStart: 16,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginStart: 16,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  disabledButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledText: {
    color: '#888',
    fontWeight: '500',
  },
  endButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  endText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CourseStartBottomCard;
