import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PermissionsAndroid, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NaverMapView, NaverMapPolylineOverlay, NaverMapPathOverlay, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { testCourse } from '../api/testCourse';
import useStopwatch from '../screens/components/stopWatch.jsx';
import Geolocation from '@react-native-community/geolocation';
import CourseStartBottomCard from '../screens/components/courseStartBottomCard';

const MountainMapScreen = () => {
  const mapRef = useRef(null);
  const { formattedTime, start, pause } = useStopwatch();
  const [geoCoords, setGeoCoords] = useState([]);
  const [trackingMode, setTrackingMode] = useState(0); // 0: None

  // 위치 권한 요청
  const moveToCurrentLocation = async () => {
    // Android의 경우 위치 권한 요청
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한 요청',
          message: '현재 위치를 사용하기 위해 위치 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('위치 권한이 거부되었습니다.');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        if (mapRef.current) {
          mapRef.current.animateCameraTo({
            latitude,
            longitude,
            zoom: 15,
          });
        }
      },
      error => {
        console.error('위치 정보를 가져오는 데 실패했습니다:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  useEffect(() => {
    start();
    const loadRoute = async () => {
      try {
        const result = testCourse;
        const coords = result.coordinates.map(([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        }));
        setGeoCoords(coords);
      } catch (err) {
        console.error('❌ 경로 로딩 오류:', err);
      }
    };

    loadRoute();
  },[]);   

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.mapContainer}>
        <NaverMapView
          ref={mapRef}
          style={{ flex: 1 }}
          mapType="Basic"
          isShowLocationButton={false}
          islogoVisible={false}
        >
          {geoCoords.length >= 2 && (
            <NaverMapPathOverlay
              coords={geoCoords}
              width={8}
              color="#68AE6E"               // 청량한 파란색
              outlineWidth={2}
              outlineColor="#ffffff"        // 흰 테두리
              zIndex={1000}
              patternImage={require('../assets/dot.png')}
              patternInterval={40}
            />
          )}
        </NaverMapView>

        {/* 📍 커스텀 현위치 버튼 */}
        <TouchableOpacity style={styles.locationBtn} onPress={moveToCurrentLocation}>
          <Text style={{ fontSize: 20 }}>📍</Text>
        </TouchableOpacity>

        {/* ⬇️ 하단 카드 */}
        <View style={styles.cardWrapper}>
          <CourseStartBottomCard
            elapsedTime={formattedTime}
            distance={2.4}
            estTime={'54m'}
            calories={85}
            onEndRide={() => {
              pause();
              console.log('🚴 라이딩 종료');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1 },
  cardWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  locationBtn: {
    position: 'absolute',
    left: 16,
    top: '45%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default MountainMapScreen;
