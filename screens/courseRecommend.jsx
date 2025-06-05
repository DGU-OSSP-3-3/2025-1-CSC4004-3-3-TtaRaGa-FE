import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';



const courses = [
  {
    id: 1,
    title: '하천따라 1시간 힐링 라이딩 코스',
    desc: '하천따라 라이딩하는 코스입니다. 어쩌고 힐링이 필요 한 날에 어쩌고',
    image: { uri: 'https://www.seouldanurim.net/comm/getImage?srvcId=MEDIA&parentSn=43723&fileTy=MEDIA&fileNo=1&thumbTy=S' },
  },
  {
    id: 2,
    title: '하천따라 1시간 힐링 라이딩 코스',
    desc: '하천따라 라이딩하는 코스입니다. 어쩌고 힐링이 필요 한 날에 어쩌고',
    image: { uri: 'https://www.seouldanurim.net/comm/getImage?srvcId=MEDIA&parentSn=43725&fileTy=MEDIA&fileNo=1&thumbTy=S' },
  },
  // {
  //   id: 3,
  //   title: '하천따라 1시간 힐링 라이딩 코스',
  //   desc: '하천따라 라이딩하는 코스입니다. 어쩌고 힐링이 필요 한 날에 어쩌고',
  //   image: { uri: 'https://www.seouldanurim.net/comm/getImage?srvcId=MEDIA&parentSn=43726&fileTy=MEDIA&fileNo=1&thumbTy=S' },
  // },
];

const CourseRecommend = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const filters = ['30분', '1시간', '2시간'];

  return (
    <View style={styles.container}>
      {/* 상단바
      <View style={styles.header}>
        <Text style={styles.back}>{'←'}</Text>
        <Text style={styles.title}>추천 코스</Text>
      </View> */}

      {/* 필터 */}
      <View style={styles.filterRow}>
        {filters.map((label, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.filterBtn,
              selectedIndex === idx && styles.filterBtnSelected,
            ]}
            onPress={() => setSelectedIndex(idx)}
          >
            <Text
              style={[
                styles.filterText,
                selectedIndex === idx && styles.filterTextSelected,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      <View style={styles.scroll}>
        {/* 최적 라이딩 코스 */}
        <Text style={styles.sectionTitle}>✨ 최적 라이딩 코스</Text>
        <View style={styles.card}>
          <Image
            source={{
              uri: 'https://www.seouldanurim.net/comm/getImage?srvcId=MEDIA&parentSn=43723&fileTy=MEDIA&fileNo=1&thumbTy=S',
            }}
            style={styles.image}
          />
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>1시간 힐링 라이딩 코스</Text>
            <Text style={styles.cardDesc}>하천 따라 여유롭게 달릴 수 있는 힐링용 루트입니다.</Text>
          </View>
        </View>

        {/* 서울 동행 코스 */}
        <Text style={styles.sectionTitle}>🏃 서울 동행 코스</Text>
        <View style={styles.card}>
          <Image
            source={{
              uri: 'https://www.seouldanurim.net/comm/getImage?srvcId=MEDIA&parentSn=43725&fileTy=MEDIA&fileNo=1&thumbTy=S',
            }}
            style={styles.image}
          />
          <View style={styles.textBox}>
            <Text style={styles.cardTitle}>서울 속 동행 산책 코스</Text>
            <Text style={styles.cardDesc}>서울 시내를 천천히 즐길 수 있는 시민 친화적 루트입니다.</Text>
          </View>
        </View>
      </View>
      {/* 하단 고정 새로고침 버튼 */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => {
          console.log('새로고침 클릭');
        }}
      >
        <Text style={styles.refreshText}>새로고침</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default CourseRecommend;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff'},
  header: { flexDirection: 'row', alignItems: 'center', height: 50, justifyContent: 'center'},
  back: { position:'absolute',left:8, fontSize: 24, marginRight: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },

  filterRow: { flexDirection: 'row', marginBottom: 16, marginTop: 8, alignItems: 'center', justifyContent: 'center',gap:20},
  filterBtn: {
    width:93,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F7F5F5',
  },
  filterText: { fontSize: 18, fontWeight: 'medium' },

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
    bottom: 50, // 화면 하단에서 간격
    alignSelf: 'center',
    backgroundColor: '#328E6E',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    zIndex: 10, // 다른 요소 위에 보이게
    elevation: 5, // 안드로이드 그림자
  },
  
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  
});