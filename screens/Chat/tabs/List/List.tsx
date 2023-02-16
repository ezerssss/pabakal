import { FlatList, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import StudentText from './StudentText';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import db from '../../../../firebase/db';
import UserContext from '../../../../context/UserContext';
import { ChatPreviewInterface } from '../../../../interfaces/chat';

const List = () => {
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [chats, setChats] = useState<ChatPreviewInterface[]>([]);

    async function handleRefresh() {
        const chatsRef = collection(db, 'users', user?.uid || 'lost', 'chats');

        const querySnapshot = await getDocs(chatsRef);
        const chatArray: ChatPreviewInterface[] = [];
        querySnapshot.forEach((doc) => {
            chatArray.push(doc.data() as ChatPreviewInterface);
        });

        setChats(chatArray);
        setIsLoading(false);
    }

    useEffect(() => {
        const chatsRef = collection(db, 'users', user?.uid || 'lost', 'chats');

        const unsubscribe = onSnapshot(chatsRef, (querySnapshot) => {
            const chatArray: ChatPreviewInterface[] = [];
            querySnapshot.forEach((doc) => {
                chatArray.push(doc.data() as ChatPreviewInterface);
            });

            setChats(chatArray);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View className="bg-white flex-1">
            <Text className="font-{poppins} text-2xl text-red-800 font-bold mt-2">
                PABAKAL
            </Text>
            <FlatList
                data={chats}
                ListEmptyComponent={
                    <Text className="font-{poppins} text-red-400 text-center font-bold mt-5">
                        You have no one as of the moment :(
                    </Text>
                }
                refreshing={isLoading}
                renderItem={({ item }) => <StudentText chat={item} />}
                keyExtractor={(item) => item.email}
                onRefresh={handleRefresh}
            />
        </View>
    );
};

export default List;
