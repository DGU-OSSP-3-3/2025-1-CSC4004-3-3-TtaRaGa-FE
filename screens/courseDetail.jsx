import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NaverMapView, NaverMapPolylineOverlay } from '@mj-studio/react-native-naver-map';

const INITIAL_CAMERA = {
  latitude: 37.5666102,
  longitude: 126.9783881,
  zoom: 12,
};

const routeCoordinates = [
  { latitude: 37.5666102, longitude: 126.9783881 },
  { latitude: 37.5703772, longitude: 126.9830465 },
  { latitude: 37.5759286, longitude: 126.9768496 },
];

const MountainMapScreen = () => {
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
      </View>
    </SafeAreaView>
  );
};

export default MountainMapScreen;
