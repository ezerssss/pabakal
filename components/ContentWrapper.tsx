import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { collection, onSnapshot } from 'firebase/firestore';
import db from '../firebase/db';
import UserContext from '../context/UserContext';
import { ChatPreviewInterface } from '../interfaces/chat';

interface PropsInterface {
    children: JSX.Element | JSX.Element[];
}

const ContentWrapper = (props: PropsInterface) => {
    const { children } = props;
    const [hasUnseen, setHasUnseen] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { user } = useContext(UserContext);

    const route = useRoute();

    const inHome = route.name === 'Home';
    const inLogin = route.name === 'Login';

    useEffect(() => {
        if (route.name === 'List') {
            return;
        }

        const chatsRef = collection(db, 'users', user?.uid || 'lost', 'chats');

        const unsubscribe = onSnapshot(chatsRef, (querySnapshot) => {
            const chatArray: ChatPreviewInterface[] = [];
            querySnapshot.forEach((doc) => {
                chatArray.push(doc.data() as ChatPreviewInterface);
            });

            setHasUnseen(!!chatArray.find((chat) => chat.isSeen === false));
        });

        return () => unsubscribe();
    }, [route.name]);

    const renderUnseenBubble = hasUnseen && (
        <View className="w-3 h-3 rounded-full bg-red-500 absolute top-2 right-5 z-20" />
    );

    const renderFooter = !inLogin && (
        <View className="flex-row pt-3 pb-1 justify-center gap-2 bg-white">
            <TouchableOpacity
                className="items-center p-3"
                onPress={() => navigation.navigate('Home')}
            >
                <Image
                    className="h-5 w-5 mb-1"
                    resizeMode="contain"
                    source={require('../assets/images/home.png')}
                />
                <Text className="font-{poppins} text-xs">Home</Text>
                <View
                    className={`h-[2px] w-10 mt-1 ${inHome && 'bg-gray-300'}`}
                />
            </TouchableOpacity>
            <TouchableOpacity
                className="items-center p-3 relative"
                onPress={() => navigation.navigate('Chat', { screen: 'List' })}
            >
                {renderUnseenBubble}
                <Image
                    className="h-5 w-5 mb-1"
                    resizeMode="contain"
                    source={require('../assets/images/chat.png')}
                />
                <Text className="font-{poppins} text-xs">Chats</Text>
                <View
                    className={`h-[2px] w-10 mt-1 ${!inHome && 'bg-gray-300'}`}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <View className="flex-1 p-5 bg-white">
                <>{children}</>
            </View>
            {renderFooter}
        </>
    );
};

export default ContentWrapper;
