import React, { useRef, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NaverMapView, NaverMapPolylineOverlay } from '@mj-studio/react-native-naver-map';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

// const INITIAL_CAMERA = {
//   latitude: 37.5655000,
//   longitude: 126.9783881,
//   zoom: 14,
// };

const routeCoordinates = [
  { latitude: 37.5762, longitude: 126.9970 },
    { latitude: 37.5795, longitude: 127.0022 },
    { latitude: 37.5827, longitude: 126.9961 },
];
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
const INITIAL_CAMERA = getCameraWithZoomAndOffset(routeCoordinates);

const MountainMapScreen = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['5%', '50%'], []); // 필요한 만큼

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <NaverMapView style={{ flex: 1 }} initialCamera={INITIAL_CAMERA}>
          <NaverMapPolylineOverlay
            coords={routeCoordinates}
            width={10}
            color="#FF0000"
            outlineWidth={2}
            outlineColor="#000000"
          />
        </NaverMapView>

        <BottomSheet
          ref={bottomSheetRef}
          index={1} // 무조건 열림
          snapPoints={snapPoints}
          enablePanDownToClose={false} // 닫기 비활성화
        >
          <BottomSheetView style={styles.sheetContent}>
            <Text style={styles.text}>여기에 항상 떠 있는 코스 정보</Text>
            <View style={{ height: 100, backgroundColor: '#eee', marginTop: 10, width: '100%' }} />
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
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MountainMapScreen;
