import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CourseRecommend from './screens/courseRecommend';
import CourseDetail from './screens/courseDetail';
import BikeDB from './screens/bikeMarker_DB';
import CourseStart from './screens/courseStart';
import StartView from './screens/startView';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="stratView"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerTintColor: '#000',       // 뒤로가기 버튼 색상
          }}
        >
          <Stack.Screen
            name="stratView"
            component={StartView}
            options={{ headerShown: false }} // 헤더 숨김 설정
          />
          <Stack.Screen
            name="bikeMarker_DB"
            component={BikeDB}
            options={{ title: '자전거 대여소' }} // 헤더 타이틀 설정
          />
          <Stack.Screen
            name="courseRecommend"
            component={CourseRecommend}
            options={{ title: '추천 코스' }} // 헤더 타이틀 설정
          />
          <Stack.Screen
            name="courseDetail"
            component={CourseDetail}
            options={{ title: '코스 상세' }} // 헤더 타이틀 설정
          />
          <Stack.Screen
            name="courseStart"
            component={CourseStart}
            options={{ title: '코스 시작' }} // 헤더 타이틀 설정
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>

  );
}
