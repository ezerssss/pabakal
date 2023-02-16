import { Text } from 'react-native';
import React from 'react';
import ContentWrapper from '../../components/ContentWrapper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamsList } from '../../types/navigation';
import Order from './tabs/Order/Order';
import Deliver from './tabs/Deliver/Deliver';
import AuthWrapper from '../../components/AuthWrapper';

const Tab = createNativeStackNavigator<HomeStackParamsList>();

const Home = () => {
    return (
        <AuthWrapper>
            <ContentWrapper>
                <Text className="font-{poppins} text-2xl text-red-800 font-bold mt-2 mb-5">
                    PABAKAL
                </Text>
                <Tab.Navigator>
                    <Tab.Screen
                        name="Order"
                        component={Order}
                        options={{
                            headerShown: false,
                            animation: 'none',
                        }}
                    />
                    <Tab.Screen
                        name="Deliver"
                        component={Deliver}
                        options={{
                            headerShown: false,
                            animation: 'none',
                        }}
                    />
                </Tab.Navigator>
            </ContentWrapper>
        </AuthWrapper>
    );
};

export default Home;
