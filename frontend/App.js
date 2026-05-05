import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import SentenceScreen from './src/screens/SentenceScreen';
import EmotionScreen from './src/screens/EmotionScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: () => {
              const icons = { 홈: '🏠', 단어장: '🔤', 감정: '💛', 설정: '⚙️' };
              return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>;
            },
            tabBarActiveTintColor: '#6B5CE7',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopColor: '#eee',
              borderTopWidth: 1,
            },
          })}
        >
          <Tab.Screen name="홈" component={HomeScreen} />
          <Tab.Screen name="단어장" component={SentenceScreen} />
          <Tab.Screen name="감정" component={EmotionScreen} />
          <Tab.Screen name="설정" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
