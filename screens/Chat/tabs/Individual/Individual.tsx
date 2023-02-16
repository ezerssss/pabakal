import {
    View,
    Text,
    Image,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ChatNavigationProps } from '../../../../types/navigation';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import db from '../../../../firebase/db';
import UserContext from '../../../../context/UserContext';
import { ChatInterface } from '../../../../interfaces/chat';
import OtherChat from './OtherChat';
import YourChat from './YourChat';

const Individual = ({ route }: ChatNavigationProps) => {
    const { student, email } = route.params;
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [chats, setChats] = useState<ChatInterface[]>([]);
    const [otherDocID, setOtherDocID] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function handleGetOtherDocID() {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);
            let otherID = '';
            querySnapshot.forEach((doc) => {
                otherID = doc.id;
            });

            setOtherDocID(otherID);
        }

        handleGetOtherDocID();
    }, []);

    useEffect(() => {
        if (!otherDocID || !user) {
            return;
        }

        const chatsRef = collection(
            db,
            'users',
            user.uid,
            'chats',
            otherDocID,
            'chat',
        );

        const q = query(chatsRef, orderBy('date'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatArray: ChatInterface[] = [];

            querySnapshot.forEach((doc) => {
                chatArray.push(doc.data() as ChatInterface);
            });

            setChats(chatArray);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [otherDocID, user]);

    useEffect(() => {
        async function handleSeen() {
            const chatRef = doc(
                db,
                'users',
                user?.uid || 'lost',
                'chats',
                otherDocID,
            );

            const chatDoc = await getDoc(chatRef);

            if (!chatDoc.exists()) {
                return;
            }

            await updateDoc(chatRef, {
                isSeen: true,
            });
        }

        if (!otherDocID || !user) {
            return;
        }

        handleSeen();
    }, [otherDocID, user]);

    function handleRender(chat: ChatInterface) {
        if (chat.from === user?.email) {
            return <YourChat chat={chat} />;
        }

        return <OtherChat chat={chat} />;
    }

    const renderLoading = isLoading && (
        <ActivityIndicator color="black" size="large" />
    );

    async function handleOwn() {
        if (!message || !otherDocID || !user) {
            return;
        }

        const ownChatDocRef = doc(db, 'users', user.uid, 'chats', otherDocID);
        await setDoc(
            ownChatDocRef,
            {
                isSeen: true,
                lastMessage: message,
            },
            { merge: true },
        );

        const ownChatCollectionRef = collection(
            db,
            'users',
            user.uid,
            'chats',
            otherDocID,
            'chat',
        );

        const chat: ChatInterface = {
            content: message,
            from: user.email || '---',
            date: new Date(),
        };
        await addDoc(ownChatCollectionRef, chat);
    }

    async function handleOther() {
        if (!message || !otherDocID || !user) {
            return;
        }

        const otherChatDocRef = doc(db, 'users', otherDocID, 'chats', user.uid);
        await setDoc(
            otherChatDocRef,
            {
                name: user.displayName || '---',
                email: user.email || '---',
                lastMessage: message,
                isSeen: false,
            },
            { merge: true },
        );

        const otherChatCollectionRef = collection(
            db,
            'users',
            otherDocID,
            'chats',
            user.uid,
            'chat',
        );

        const chat: ChatInterface = {
            content: message,
            from: user.email || '---',
            date: new Date(),
        };
        await addDoc(otherChatCollectionRef, chat);
    }

    async function handleSendMessage() {
        if (!message || !otherDocID || !user) {
            return;
        }

        setMessage('');
        await handleOwn();
        await handleOther();
    }

    return (
        <View className="bg-white flex-1">
            <View className="flex-row gap-2 items-center">
                <Image
                    className="w-9 h-9"
                    resizeMode="contain"
                    source={require('../../../../assets/images/placeholder-account.png')}
                />
                <Text className="font-{poppins} text-lg">{student}</Text>
            </View>
            <View className="h-[1px] w-full bg-gray-400 mt-2 mb-4" />
            {renderLoading}
            <FlatList
                data={chats}
                renderItem={({ item }) => handleRender(item)}
            />
            <View className="flex-row gap-3 items-center">
                <TextInput
                    autoFocus
                    multiline
                    className="px-2 py-3 rounded-lg border border-gray-300 flex-1"
                    placeholder="Enter Message"
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                />
                <TouchableOpacity onPress={handleSendMessage}>
                    <Image
                        className="w-5 h-5"
                        resizeMode="contain"
                        source={require('../../../../assets/images/send.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Individual;
