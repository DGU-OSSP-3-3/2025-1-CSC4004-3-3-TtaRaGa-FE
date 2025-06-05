import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { REACT_APP_SEOUL_BIKE_API_KEY } from '@env';

const INITIAL_CAMERA = {
  latitude: 37.5666102,
  longitude: 126.9783881,
  zoom: 12,
};

function BikeAPI() {
  const [bikeData, setBikeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const slice = 10;

  useEffect(() => {
    const fetchBikeData = async () => {
      try {
        const apiKey = REACT_APP_SEOUL_BIKE_API_KEY; // 환경변수에서 API 키를 가져옵니다.
        console.log('API Key:', apiKey); // API 키를 콘솔에 출력합니다.
        if (!apiKey) {
          throw new Error('API key is missing.');
        }
        const url = `http://openapi.seoul.go.kr:8088/${apiKey}/json/bikeList/1/${slice}`;
        console.log('Request URL:', url);

        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status >= 200 && response.status <= 300) {
          console.log('API Response:', JSON.stringify(response.data, null, 2));
          if (!response.data.rentBikeStatus || !response.data.rentBikeStatus.row) {
            throw new Error('Unexpected API response structure');
          }
          const stations = response.data.rentBikeStatus.row.slice(0, slice);
          console.log('Processed Stations:', stations.length, JSON.stringify(stations, null, 2));
          setBikeData(stations);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error('Fetch error:', {
          message: err.message,
          response: err.response ? JSON.stringify(err.response.data, null, 2) : null,
          stack: err.stack,
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBikeData();
  }, []);

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
      </View>
    );
  }

  console.log('API FINISHED:', JSON.stringify(bikeData, null, 2));
  
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <NaverMapView
          style={{ flex: 1 }}
          initialCamera={INITIAL_CAMERA}
        >
          {bikeData && bikeData.length > 0 ? (
            bikeData.map((station, index) => {
              const latitude = Number(station.stationLatitude);
              const longitude = Number(station.stationLongitude);
              if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
                console.warn(
                  `Invalid coordinates for station ${station.stationName || index}: latitude=${station.stationLatitude}, longitude=${station.stationLongitude}`
                );
                return null; // 유효하지 않은 좌표는 마커 생성 안 함
              }
              console.log(`Rendering marker ${index}: ${station.stationName}, lat=${latitude}, lng=${longitude}`);
              return (
                <NaverMapMarkerOverlay
                  key={index}
                  latitude={latitude}
                  longitude={longitude}
                  //coordinate={{ latitude, longitude }}
                  caption={{
                    text: String(station.stationName || 'Unknown Station'),
                    textSize: 14,
                    color: '#000000',
                  }}
                  width={30}
                  height={40}
                  anchor={{ x: 0.5, y: 1 }}
                  onTap={() => {
                    console.log(`Marker tapped: ${station.stationName}`);
                  }}
                />
              );
            })
          ) : (
            console.log('No markers rendered: bikeData=', !!bikeData)
          )}
        </NaverMapView>
        {bikeData && bikeData.length > 0 ? (
          <ScrollView style={styles.cardContainer}>
            {console.log('Starting ScrollView render with', bikeData.length, 'stations')}
            {bikeData.map((station, index) => {
              console.log(`Rendering card ${index}: ${station.stationName || 'Unknown'}`);
              return (
                <View key={index} style={styles.card}>
                  <Text style={styles.stationName}>{String(station.stationName || 'Unknown Station')}</Text>
                  <Text style={styles.text}>Available Bikes: {String(station.rackTotCnt || 'N/A')}</Text>
                  <Text style={styles.text}>Parking Bikes: {String(station.parkingBikeTotCnt || 'N/A')}</Text>
                  <Text style={styles.text}>Station ID: {String(station.stationId || 'N/A')}</Text>
                  <Text style={styles.text}>위도: {String(station.stationLatitude || 'N/A')}</Text>
                  <Text style={styles.text}>경도: {String(station.stationLongitude || 'N/A')}</Text>
                </View>
              );
            })}
            {console.log('Finished ScrollView render')}
          </ScrollView>
        ) : (
          <View style={styles.centered}>
            <Text style={styles.text}>No station data available</Text>
            {console.log('No ScrollView: bikeData=', !!bikeData)}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    maxHeight: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
  },
});

export default BikeAPI;