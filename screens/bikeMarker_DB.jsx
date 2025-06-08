import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, navigation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS } from 'react-native-permissions';
import { REACT_APP_DB_IP } from '@env';
import MarkerSvg from '../assets/marker_svg.svg'; // SVG 마커 아이콘
import RefreshSvg from '../assets/refresh.svg'; // 새로고침 아이콘
import _ from 'lodash';

// 로컬 JSON 데이터 (FALLBACK_DATA)
const FALLBACK_DATA = [
  {
    station_id: 'ST-TEST1',
    station_name: '테스트 대여소 1',
    station_latitude: 37.5666102,
    station_longitude: 126.9783881,
    parking_bike_tot_cnt: 5,
  },
  {
    station_id: 'ST-TEST2',
    station_name: '테스트 대여소 2',
    station_latitude: 37.5676102,
    station_longitude: 126.9793881,
    parking_bike_tot_cnt: 10,
  },
  {
    station_id: 'ST-4',
    station_name: '망원역 1번출구 앞',
    station_latitude: 37.55564880,
    station_longitude: 126.91062927,
    parking_bike_tot_cnt: 13,
  },
  {
    station_id: 'ST-5',
    station_name: '망원역 2번출구 앞',
    station_latitude: 37.55495071,
    station_longitude: 126.91083527,
    parking_bike_tot_cnt: 24,
  },
  {
    station_id: 'ST-6',
    station_name: '합정역 1번출구 앞',
    station_latitude: 37.55073929,
    station_longitude: 126.91508484,
    parking_bike_tot_cnt: 0,
  },
  {
    station_id: 'ST-7',
    station_name: '합정역 5번출구 앞',
    station_latitude: 37.55000687,
    station_longitude: 126.91482544,
    parking_bike_tot_cnt: 3,
  },
  {
    station_id: 'ST-8',
    station_name: '합정역 7번출구 앞',
    station_latitude: 37.54864502,
    station_longitude: 126.91282654,
    parking_bike_tot_cnt: 2,
  },
  // 아래는 자동 생성된 50개 대여소
  {
    station_id: 'ST-9',
    station_name: '테스트 대여소 9',
    station_latitude: 37.5606,
    station_longitude: 126.9096,
    parking_bike_tot_cnt: 9,
  },
  {
    station_id: 'ST-10',
    station_name: '테스트 대여소 10',
    station_latitude: 37.5473,
    station_longitude: 126.9182,
    parking_bike_tot_cnt: 29,
  },
  ...Array.from({ length: 91 }, (_, i) => { // 91이 총 100개
    const idx = i + 11;
    return {
      station_id: `ST-${idx}`,
      station_name: `테스트 대여소 ${idx}`,
      // 서울 시내 대략적 범위에서 랜덤 분포
      station_latitude: 37.48 + Math.random() * 0.12,   // 37.48 ~ 37.60
      station_longitude: 126.88 + Math.random() * 0.12, // 126.88 ~ 127.00
      parking_bike_tot_cnt: Math.floor(Math.random() * 31), // 0~30대
    };
  }),
];

// 기본 카메라 (현 위치가 안 잡힐 때)
const DEFAULT_CAMERA = {
  latitude: 37.5666102,
  longitude: 126.9783881,
  zoom: 13,
};

// region 정보를 서버로 전송하는 함수
async function postRegion(region) {
  const lat = region.latitude;
  const lon = region.longitude;
  const delta1 = region.latitudeDelta;
  const delta2 = region.longitudeDelta;

  const url = REACT_APP_DB_IP;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon, delta1, delta2 }),
    });

    const result = await response.json();
    console.log("결과:", result);

    const transformedData = result.map((item) => ({
      station_id: item[0],
      parking_bike_tot_cnt: item[1],
      station_latitude: item[2],
      station_longitude: item[3],
      station_name: item[4],   
    }));
    return transformedData;
  } catch (e) {
    console.error('요청 실패:', e.message || e);
    return FALLBACK_DATA; // 에러 발생 시 Fallback 데이터 반환
    throw e; // 호출한 쪽에서 error 처리
  }
}

function BikeDB({ navigation }) {
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [camera, setCamera] = useState(DEFAULT_CAMERA);
  const [viewportBounds, setViewportBounds] = useState(null);
  const [isRegionReady, setIsRegionReady] = useState(false);
  const [lastRegion, setLastRegion] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const mapRef = useRef(null);
  const isInitialized = useRef(false);

  // 위치 권한 요청 및 현재 위치 가져오기, 직접 apk 설치후 확인 사안
  useEffect(() => {
    async function initializeLocation() {
      try {
        const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION; // 권한 가져오기
        const result = await request(permission); // 권환 가져올 때까지 await
        if (result === 'granted') {
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log('Current position:', { latitude, longitude });
              setCamera({ latitude, longitude, zoom: 13 });
              setLoading(false);
            },
            (err) => {
              console.error('Geolocation error:', err);
              setCamera(DEFAULT_CAMERA); 
              setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
          );
        } else {
          console.warn('Location permission denied');
          setCamera(DEFAULT_CAMERA);
          setLoading(false);
        }
      } catch (err) {
        console.error('Permission error:', err);
        setCamera(DEFAULT_CAMERA);
        setLoading(false);
      }
    }

    initializeLocation();
    handleRefresh(); 
  }, []);

  // 카메라 사이즈 가져올 수 있는 함수
  const handleCameraChanged = (params) => {
    const region = params.region;
    if (!region) {
      console.log('region 정보 없음');
      return;
    }
    setLastRegion(region);
    const minLat = region.latitude;
    const minLng = region.longitude;
    const maxLat = region.latitude + region.latitudeDelta;
    const maxLng = region.longitude + region.longitudeDelta;

    // 작은 변화는 스킵 (성능 최적화)
    if (
      viewportBounds &&
      Math.abs(minLat - viewportBounds.minLat) < 0.001 &&
      Math.abs(maxLat - viewportBounds.maxLat) < 0.001 &&
      Math.abs(minLng - viewportBounds.minLng) < 0.001 &&
      Math.abs(maxLng - viewportBounds.maxLng) < 0.001
    ) return;

    setViewportBounds({ minLat, maxLat, minLng, maxLng });
    setIsRegionReady(true);
  };

  // 새로고침 핸들러
  const handleRefresh = async () => {
    let result = [];
    if (lastRegion) {
      result = await postRegion(lastRegion);
    } else {
      console.log('정보 없음');
      setStations(FALLBACK_DATA);
      return;
    }

    console.log('result', result);

    if (Array.isArray(result)) {
      setStations(result);
    } else {
      setStations(FALLBACK_DATA);
    }
  };

  // 지도 초기화 완료
  const handleMapReady = () => {
    console.log('Map initialized');
    isInitialized.current = true;
  };

  // 표시된 마커 수 계산
  const visibleStationsCount = useMemo(() => {
    if (!Array.isArray(stations)) return 0;
    return stations.length;
  }, [stations]);

  // 마커 리스트 동적 생성
  const markers = useMemo(() => {
  if (!Array.isArray(stations) || stations.length === 0) return [];
  return stations.map((station) => {
    const { station_latitude, station_longitude, station_name, parking_bike_tot_cnt, station_id } = station;
    if (isNaN(station_latitude) || isNaN(station_longitude)) return null;
  
    const isSelected = selectedStation?.station_id === station_id;
    return (
      <NaverMapMarkerOverlay
        key = {station_id}
        latitude = {station_latitude}
        longitude = {station_longitude}
        caption={{
          text: isSelected ? `${parking_bike_tot_cnt}` : '',
          textSize: 24,
          color: '#328E6E',
          offset: isSelected ? -47 : -35
        }}
        zIndex={isSelected ? 1000 : 0} // 선택된 마커를 위로 올림
        alpha={1}
        width={isSelected ? 60 : 38}
        height={isSelected ? 60 : 38}
        anchor={{ x: 0.5, y: 0.6 }}
        //isHideCollidedMarkers={true} // 충돌 마커 숨김
        // image={{ 
        //   symbol: 'green',
        //   httpUri: 'https://pplx-res.cloudinary.com/image/upload/v1748720466/gpt4o_images/eprm9nb6temrrznqpusr.png', // 자전거 아이콘
        //  }}
        onTap={() => {
          setSelectedStation(station);
          // 카메라 이동 
          if (mapRef.current) {
            mapRef.current.animateCameraTo({
              latitude: station_latitude,
              longitude: station_longitude,
            });
          }
        }}
      >
        <MarkerSvg width="100%" height="100%" fill="#009900" />  
      </NaverMapMarkerOverlay>
    );
  }).filter((marker) => marker !== null);
}, [stations, selectedStation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.text, styles.errorText]}>Error: {error}</Text>
        <Text style={styles.text}>Using FALLBACK_DATA: {FALLBACK_DATA.length} stations</Text>
      </View>
    );
  }

  const clusterMarkers = stations.map(station => ({
    identifier: String(station.station_id), 
    latitude: station.station_latitude,
    longitude: station.station_longitude,
  }));

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <NaverMapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialCamera={camera} // 초기 카메라 위치
          onCameraChanged={handleCameraChanged} // 카메라 변경시 이벤트 함수
          onMapReady={handleMapReady} // 준비 확인 함수
          minZoom={11} // 축소 레벨 적당함(12), 서울 전 구역(11)
          maxZoom={16} // 확대 레벨 적당함(15), 마트 이름 보임(16)
          isRotateGesturesEnabled={false} // 회전 기능 비활성화
          // clusters={[{
          //   animate: false, // 클러스터 애니메이션 활성화
          //   minZoom: 11, // 클러스터링할 축소 줌 레벨
          //   maxZoom: 16, // 클러스터링할 확대 줌 레벨
          //   markers: clusterMarkers,
          // }]}
          // 서울시 지역 범위 설정
          extent={{latitude: 37.413294, longitude: 126.734086, latitudeDelta: 0.31, longitudeDelta: 0.55}}
        >{markers}
        </NaverMapView>
        <Modal
          transparent
          visible={!!selectedStation}
          animationType="fade"
          onRequestClose={() => setSelectedStation(null)}
        >
          <TouchableWithoutFeedback onPress={() => setSelectedStation(null)}>
            <View style={styles.modalBackground} >
              <TouchableWithoutFeedback>
                <View style={styles.dialog}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.stationName}>{selectedStation?.station_name}</Text>
                    <Text style={styles.countText}>{selectedStation?.parking_bike_tot_cnt}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      if (selectedStation) {
                        navigation.navigate('courseRecommend', {
                          lat: selectedStation.station_latitude,
                          lng: selectedStation.station_longitude,
                          stationName: selectedStation.station_name,
                        });
                        setSelectedStation(null); // 모달 닫기
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>출발지 설정</Text>
                  </TouchableOpacity>

                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <View style={styles.info}>
          <Text style={styles.text}>Visible stations: {visibleStationsCount}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <RefreshSvg width="24px" height="24px" />  
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
  },
  info: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
    borderRadius: 4,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 50,
    right: 15,
    backgroundColor: 'rgb(255, 255, 255)',
    paddingVertical: 10.5,
    paddingHorizontal: 10.5,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 16, 
    padding: 15,
    alignItems: 'stretch',
    alignSelf: 'center',
    width: '90%',
    minHeight: 120,
    borderColor: '#A4D3A2',
    borderWidth: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  stationName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    flexShrink: 1,
    textAlign: 'left',
  },
  countText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#009900',
    marginBottom: 8,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BikeDB;