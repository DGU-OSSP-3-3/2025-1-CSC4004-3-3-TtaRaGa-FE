import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { postFilterTime } from '../api/postFilterTime';
import { setSavedRoute } from '../api/routeStore';

const courses = [
  {
    id: 1,
    title: '하천따라 1시간 힐링 라이딩 코스',
    desc: '하천따라 라이딩하는 코스입니다. 어쩌고 힐링이 필요 한 날에 어쩌고',
    image: {
      uri: 'https://www.seouldanurim.net/comm/getImage?srvcId=MEDIA&parentSn=43723&fileTy=MEDIA&fileNo=1&thumbTy=S',
    },
  },
  {
    id: 2,
    title: '서울 속 동행 산책 코스',
    desc: '서울 시내를 천천히 즐길 수 있는 시민 친화적 루트입니다.',
    image: {
      uri: 'https://www.seouldanurim.net/comm/getImage?srvcId=MEDIA&parentSn=43725&fileTy=MEDIA&fileNo=1&thumbTy=S',
    },
  },
];

const CourseRecommend = ({ navigation }) => {
  const route = useRoute();
  const { lat, lng, stationName } = route.params || {};

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [routeData, setRouteData] = useState(null);

  const filters = ['30분', '1시간', '2시간'];
  const timeMap = {
    '30분': 30,
    '1시간': 60,
    '2시간': 120,
  };

  const handleFilterSelect = async (idx) => {
    setSelectedIndex(idx);
    const label = filters[idx];
    const targetTime = timeMap[label];

    if (!lat || !lng) {
      console.warn('위치 정보 없음');
      return;
    }

    try {
      const data = await postFilterTime(lat, lng, targetTime);
      console.log('경로 데이터:', data);
      setSavedRoute(data);
    } catch (err) {
      console.error('전송 실패:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {filters.map((label, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.filterBtn, selectedIndex === idx && styles.filterBtnSelected]}
            onPress={() => handleFilterSelect(idx)}
          >
            <Text style={[styles.filterText, selectedIndex === idx && styles.filterTextSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.scroll}>
        <Text style={styles.sectionTitle}>✨ 최적 라이딩 코스</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('courseDetail')}
        >
          <Image source={courses[0].image} style={styles.image} />
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>{courses[0].title}</Text>
            <Text style={styles.cardDesc}>{courses[0].desc}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>🏃 서울 동행 코스</Text>
        <View style={styles.card}>
          <Image source={courses[1].image} style={styles.image} />
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>{courses[1].title}</Text>
            <Text style={styles.cardDesc}>{courses[1].desc}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => console.log('새로고침 클릭')}
      >
        <Text style={styles.refreshText}>새로고침</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CourseRecommend;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  filterBtn: {
    width: 93,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F7F5F5',
  },
  filterText: { fontSize: 18 },
  filterBtnSelected: {
    borderColor: '#68AE6E',
    backgroundColor: '#F9FFFC',
    borderWidth: 2,
  },
  filterTextSelected: {
    color: '#328E6E',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F7F5F5',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    marginLeft: 4,
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  image: { width: '100%', height: 160 },
  textBox: { padding: 20 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#444' },
  refreshButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    zIndex: 10,
    elevation: 5,
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
