import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login/Login';
import { RootStackParamsList } from './types/navigation';
import { useFonts } from 'expo-font';
import { StatusBar, View } from 'react-native';
import { useCallback, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { User } from 'firebase/auth';
import UserContext from './context/UserContext';
import Home from './screens/Home/Home';
import Chat from './screens/Chat/Chat';

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator<RootStackParamsList>();

export default function App() {
    const [user, setUser] = useState<User | null>(null);

    const [fontsLoaded] = useFonts({
        poppins: require('./assets/fonts/Poppins.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <View className="flex-1" onLayout={onLayoutRootView}>
                <StatusBar />
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name="Home"
                            component={Home}
                            options={{ animation: 'none' }}
                        />
                        <Stack.Screen
                            name="Login"
                            component={Login}
                            options={{ animation: 'none' }}
                        />
                        <Stack.Screen
                            name="Chat"
                            component={Chat}
                            options={{ animation: 'none' }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        </UserContext.Provider>
    );
}
