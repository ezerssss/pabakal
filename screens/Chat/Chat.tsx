import React from 'react';
import ContentWrapper from '../../components/ContentWrapper';
import AuthWrapper from '../../components/AuthWrapper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatStackParamsList } from '../../types/navigation';
import List from './tabs/List/List';
import Individual from './tabs/Individual/Individual';

const Tab = createNativeStackNavigator<ChatStackParamsList>();

const Chat = () => {
    return (
        <AuthWrapper>
            <ContentWrapper>
                <Tab.Navigator>
                    <Tab.Screen
                        name="List"
                        component={List}
                        options={{
                            headerShown: false,
                            animation: 'none',
                        }}
                    />
                    <Tab.Screen
                        name="Individual"
                        component={Individual}
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

export default Chat;
