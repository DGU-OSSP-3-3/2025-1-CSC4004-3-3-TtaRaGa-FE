import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PermissionsAndroid, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NaverMapView,
  NaverMapPathOverlay,
  NaverMapMarkerOverlay
} from '@mj-studio/react-native-naver-map';
import { testCourse } from '../api/testCourse';
import useStopwatch from '../screens/components/stopWatch.jsx';
import Geolocation from '@react-native-community/geolocation';
import CourseStartBottomCard from '../screens/components/courseStartBottomCard';

const MountainMapScreen = () => {
  const mapRef = useRef(null);
  const { formattedTime, start, pause } = useStopwatch();

  const [geoCoords, setGeoCoords] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(15);
  const zoomRef = useRef(15); // 현재 줌 레벨 유지용
  const trackingRef = useRef(false);


  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한 요청',
          message: '현재 위치를 사용하기 위해 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocationAsync = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const moveToCurrentLocation = async () => {
    try {
      const location = await getCurrentLocationAsync();
      setCurrentLocation(location);
      console.log('moveto함수 실행');

      mapRef.current?.animateCameraTo({
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: zoomRef.current,
      });
      trackingRef.current = true; // 위치 이동 시 트래킹 활성화
    } catch (e) {
      console.warn('❌ 현재 위치 이동 실패:', e);
    }
  };

  useEffect(() => {
    start();
  
    let intervalId;

  const startInterval = async () => {
    const permissionGranted = await requestLocationPermission();
    if (!permissionGranted) return;

    intervalId = setInterval(async () => {
      try {
        const loc = await getCurrentLocationAsync();
        setCurrentLocation(loc);

        if (trackingRef.current) {
          mapRef.current?.animateCameraTo({
            latitude: loc.latitude,
            longitude: loc.longitude,
            zoom: zoomRef.current,
          });
        }
      } catch (e) {
        console.warn('❌ 위치 업데이트 실패:', e);
      }
    }, 3000);
  };
  
    startInterval();
  
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
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.mapContainer}>
        <NaverMapView
          ref={mapRef}
          style={{ flex: 1 }}
          mapType="Basic"
          isShowLocationButton={false}
          islogoVisible={false}
          onCameraChanged={(e) => {
            console.log('🔍 카메라 변경 이벤트:', e);
            const reasonCode = e.reason;
          
            if (reasonCode === 'Gesture') {
              trackingRef.current = false;
            }
          }}
          onCameraIdle={(e) => {
            const zoom = e?.zoom;
            if (typeof zoom === 'number') {
              setCurrentZoom(zoom);
              zoomRef.current = zoom;
            }
          }}
        >
          {geoCoords.length >= 2 && (
            <NaverMapPathOverlay
              coords={geoCoords}
              width={8}
              color="#68AE6E"
              outlineWidth={2}
              outlineColor="#ffffff"
              zIndex={1000}
              patternImage={require('../assets/dot.png')}
              patternInterval={40}
            />
          )}
          {currentLocation && (
            <NaverMapMarkerOverlay
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              caption="현위치"
              captionAlign="Top"
            />
          )}
        </NaverMapView>

        {/* 📍 위치 이동 버튼 */}
        <TouchableOpacity style={styles.locationBtn} onPress={moveToCurrentLocation}>
          <Text style={{ fontSize: 20 }}>📍</Text>
        </TouchableOpacity>

        {/* 하단 정보 카드 */}
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
