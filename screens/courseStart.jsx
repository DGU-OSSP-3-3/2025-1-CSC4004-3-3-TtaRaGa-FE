import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
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
import { getSavedRoute1,getSavedRoute2 } from '../api/routeStore';
import { useRoute } from '@react-navigation/native';

import EndRideDialog from '../screens/components/endRideDialog.jsx';


const MountainMapScreen = () => {
  const mapRef = useRef(null);
  const { formattedTime, start, pause } = useStopwatch();

  const [geoCoords, setGeoCoords] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(15);
  const zoomRef = useRef(15); // 현재 줌 레벨 유지용
  const trackingRef = useRef(true);
  const [isReady, setIsReady] = useState(false); // ✅ 변경
  const [modalVisible, setModalVisible] = useState(false);
    const route = useRoute();
  const { type } = route.params;





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

    if(isReady) start();
    moveToCurrentLocation(); // 컴포넌트 마운트 시 현재 위치로 이동
    let intervalId;

  const startInterval = async () => {
    const permissionGranted = await requestLocationPermission();
    if (!permissionGranted) return;

    intervalId = setInterval(async () => {
      try {
        const loc = await getCurrentLocationAsync();
        setCurrentLocation(loc);

        
        if (trackingRef.current) {
          if (!isReady) {
            mapRef.current?.animateCameraTo({
              latitude: loc.latitude,
              longitude: loc.longitude,
              zoom: zoomRef.current,
              duration: 0,
            });
            setIsReady(true); // ✅ 상태 변경 → 다시 렌더링됨
          }
          else {
            mapRef.current?.animateCameraTo({
              latitude: loc.latitude,
              longitude: loc.longitude,
              zoom: zoomRef.current,
              duration : 0,
            });
          }
        }
      } catch (e) {
        console.warn('❌ 위치 업데이트 실패:', e);
      }
    }, 3000);

  };
  
    startInterval();
  
    const loadRoute = async () => {
      const getRouteFn = type === '1' ? getSavedRoute1 : getSavedRoute2;
      const data = getRouteFn(); // 함수 호출
    
      if (data) {
        try {
          const parsed = typeof data.geoJson === 'string'
            ? JSON.parse(data.geoJson)
            : data.geoJson;
    
          const coordinates =
            parsed?.coordinates || parsed?.features?.[0]?.geometry?.coordinates;
    
          if (Array.isArray(coordinates)) {
            const coords = coordinates.map(([lng, lat]) => ({
              latitude: lat,
              longitude: lng,
            }));
    
            setGeoCoords(coords);
          }
        } catch (e) {
          console.warn('❌ 경로 데이터 파싱 실패:', e);
        }
      } else {
        console.warn('❌ 저장된 경로가 없습니다');
      }
    };
    
  
    loadRoute();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isReady]);
  
  
  return (
    <SafeAreaView edges={['top, bottom']} style={styles.container}>
       {!isReady ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>위치 정보 받아 오는 중...</Text>
        </View>
      ) :(
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
              setModalVisible(true)
            }}
          />
        </View>
        <EndRideDialog
          visible={modalVisible}
          onConfirm={() => {
            pause();
            setModalVisible(false);
          }}
          onCancel={() => setModalVisible(false)}
        />
      </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  
});

export default MountainMapScreen;
