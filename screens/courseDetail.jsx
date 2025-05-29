import React, { useEffect,useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NaverMapView, NaverMapPolylineOverlay } from '@mj-studio/react-native-naver-map';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { fetchGeoJson,fetchBestRoute } from '../api/geojson';


function getCameraWithZoomAndOffset(coords) {
  if (!coords || coords.length < 2) return null;

  const lats = coords.map(c => c.latitude);
  const lngs = coords.map(c => c.longitude);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // 위도/경도 거리 범위 (대략적 거리 추정)
  const latDiffKm = (maxLat - minLat) * 111;
  const lngDiffKm = (maxLng - minLng) * 88; // 서울 기준
  const diagonalKm = Math.sqrt(latDiffKm ** 2 + lngDiffKm ** 2);

  // 줌 추정 (대략적인 범위 기반)
  let zoom;
  let offsetPerZoom;

  if (diagonalKm < 0.5) zoom = 15, offsetPerZoom = 0.0050;
  else if (diagonalKm < 1.5) zoom = 14, offsetPerZoom = 0.0030;
  else if (diagonalKm < 3) zoom = 13, offsetPerZoom = 0.0040;
  else if (diagonalKm < 6) zoom = 12, offsetPerZoom = 0.0050;
  // else if (diagonalKm < 10) zoom = 12;
  else zoom = 11, offsetPerZoom = 0.0090;

  // 줌에 비례해 위도 중심 보정 (줌 16 → 0, 줌 11 → 더 많이 내림)
  let latOffset = offsetPerZoom * (16 - zoom);

  return {
    latitude: centerLat - latOffset,
    longitude: centerLng,
    zoom,
  };
}
// 사용 예시

const MountainMapScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['5%', '50%'], []); // 필요한 만큼
  const [geoCoords, setGeoCoords] = useState([]);

  const handleClick = async () => {
    try {
      const result = await fetchBestRoute(37.5665, 126.978, 10);
      console.log('✅ Best route:', result);
  
      // GeoJSON 문자열 파싱
      const parsed = JSON.parse(result.geoJson);
  
      // 안에 properties.the_geom.coordinates가 실제 좌표 배열임
      const coords = parsed.properties.the_geom.coordinates.map(
        ([lng, lat]) => ({ latitude: lat, longitude: lng })
      );
  
      setGeoCoords(coords);
    } catch (err) {
      console.error('❌ Error fetching route:', err);
    }
  };



  useEffect(() => {
    fetchBestRoute(37.5665,126.978,10)
    .then(data => {
      // GeoJSON 문자열 파싱
      const parsed = JSON.parse(data.geoJson);
  
      // 안에 properties.the_geom.coordinates가 실제 좌표 배열임
      const coords = parsed.properties.the_geom.coordinates.map(
        ([lng, lat]) => ({ latitude: lat, longitude: lng })
      );
  
      setGeoCoords(coords);
  })
  .catch(err => {
    console.error('GeoJSON fetch error:', err);
  });
  }, []);
  const INITIAL_CAMERA = getCameraWithZoomAndOffset(geoCoords);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      
      <View style={{ flex: 1 }} >
        <NaverMapView style={{ flex: 1 }} initialCamera={INITIAL_CAMERA}>
{/* 
        <NaverMapPolylineOverlay
          coords={[
            { latitude: 37.5665, longitude: 126.978 },
            { latitude: 37.5823, longitude: 126.9673 }
          ]}
          
          width={10}
          color="#FF0000"
          outlineWidth={2}
          outlineColor="#000000"
        /> */}
        {geoCoords.length >= 2 && (
          <NaverMapPolylineOverlay
          coords={geoCoords}
          width={10}
          color="#FF0000"
          outlineWidth={2}
          outlineColor="#000000"
        />
        )}
        </NaverMapView>
       
        <BottomSheet
          ref={bottomSheetRef}
          index={1} // 무조건 열림
          snapPoints={snapPoints}
          enablePanDownToClose={false} // 닫기 비활성화
        >
          <BottomSheetView style={styles.sheetContent}>
            <Text style={styles.text}>반포한강공원</Text>
            <View style={{ height: 2, backgroundColor: '#F7F5F5', marginTop: 27, width: '100%' }} />
            <View style={{ marginTop: 20, width: '100%' }}><Button title="경로 가져오기" onPress={handleClick} /></View>
          </BottomSheetView>
        </BottomSheet>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MountainMapScreen;
