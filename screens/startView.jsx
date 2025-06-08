import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StartViewScreen = () => {
  const navigation = useNavigation();

  const handleStart = () => {
    navigation.navigate('bikeMarker_DB');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.grayText}>
          <Text style={styles.greenText}>따</Text>릉이
        </Text>
        <Text style={styles.grayText}>
          <Text style={styles.greenText}>라</Text>이딩
        </Text>
        <Text style={styles.grayText}>
          <Text style={styles.greenText}>가</Text>이드
        </Text>
      </View>
  
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
  
};

export default StartViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 60,
  },
  grayText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#bbb',
    lineHeight: 50,
  },
  greenOverlay: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  greenText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2ecc71',
    lineHeight: 50,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
