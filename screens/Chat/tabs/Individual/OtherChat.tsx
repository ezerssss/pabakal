import { View, Text } from 'react-native';
import React from 'react';
import { ChatInterface } from '../../../../interfaces/chat';

interface PropsInterface {
    chat: ChatInterface;
}

const OtherChat = (props: PropsInterface) => {
    const { chat } = props;

    return (
        <View className="max-w-[75%] self-start bg-gray-200 p-3 mb-1 rounded-3xl">
            <Text className="font-{poppins}">{chat.content}</Text>
        </View>
    );
};

export default OtherChat;
