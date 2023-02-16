import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ChatStackParamsList } from '../../../../types/navigation';
import { ChatPreviewInterface } from '../../../../interfaces/chat';

interface PropsInterface {
    chat: ChatPreviewInterface;
}

const StudentText = (props: PropsInterface) => {
    const { chat } = props;

    const navigation =
        useNavigation<NativeStackNavigationProp<ChatStackParamsList>>();

    return (
        <>
            <TouchableOpacity
                className="flex-row gap-2 items-center p-4 my-2"
                onPress={() =>
                    navigation.navigate('Individual', {
                        student: chat.name,
                        email: chat.email,
                    })
                }
            >
                <Image
                    className="h-12 w-12"
                    resizeMode="contain"
                    source={require('../../../../assets/images/placeholder-account.png')}
                />
                <View className="flex-1">
                    <Text
                        className="font-{poppins} font-semibold text-lg"
                        numberOfLines={1}
                    >
                        {chat.name}
                    </Text>
                    <Text
                        className={`font-{poppins} text-xs ${
                            chat.isSeen && 'text-gray-400'
                        } ${!chat.isSeen && 'font-bold'}`}
                        numberOfLines={1}
                    >
                        {chat.lastMessage || '----'}
                    </Text>
                </View>
            </TouchableOpacity>
            <View className="h-[1px] w-full mx-auto bg-gray-400" />
        </>
    );
};

export default StudentText;
