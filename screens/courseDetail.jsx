import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NaverMapView } from '@mj-studio/react-native-naver-map';

const INITIAL_CAMERA = {
  latitude: 37.5666102,
  longitude: 126.9783881,
  zoom: 12,
};

const MountainMapScreen = () => {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <NaverMapView
          style={{ flex: 1 }}
          initialCamera={INITIAL_CAMERA} // 또는 center={...}
        />
      </View>
    </SafeAreaView>
  );
};

export default MountainMapScreen;
