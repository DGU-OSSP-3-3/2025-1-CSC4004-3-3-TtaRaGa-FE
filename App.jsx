import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';



const courses = [
  {
    id: 1,
    title: '하천따라 1시간 힐링 라이딩 코스',
    desc: '하천따라 라이딩하는 코스입니다. 어쩌고 힐링이 필요 한 날에 어쩌고',
    image: { uri: 'https://example.com/image1.jpg' },
  },
  {
    id: 2,
    title: '하천따라 1시간 힐링 라이딩 코스',
    desc: '하천따라 라이딩하는 코스입니다. 어쩌고 힐링이 필요 한 날에 어쩌고',
    image: { uri: 'https://example.com/image2.jpg' },
  },
];

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const filters = ['30분', '1시간', '2시간'];

  return (
    <View style={styles.container}>
      {/* 상단바 */}
      <View style={styles.header}>
        <Text style={styles.back}>{'←'}</Text>
        <Text style={styles.title}>추천 코스</Text>
      </View>

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


      {/* 리스트 */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {courses.map(course => (
          <View key={course.id} style={styles.card}>
            <Image source={course.image} style={styles.image} />
            <View style={styles.textBox}>
              <Text style={styles.cardTitle}>{course.title}</Text>
              <Text style={styles.cardDesc}>{course.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16},
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

  scroll: { paddingBottom: 30 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  image: { width: '100%', height: 160 },
  textBox: { padding: 12 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#444' },
});