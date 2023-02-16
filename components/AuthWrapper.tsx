import { View, Text, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import UserContext from '../context/UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamsList } from '../types/navigation';
import auth from '../firebase/auth';
import { Routes } from '../enums/routes';
import { UserInterface } from '../interfaces/user';
import { doc, setDoc } from 'firebase/firestore';
import db from '../firebase/db';

interface PropsInterface {
    children: JSX.Element | JSX.Element[];
}

const AuthWrapper = (props: PropsInterface) => {
    const { children } = props;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { setUser } = useContext(UserContext);

    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

    const route = useRoute();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            const noUser = !user;

            if (noUser) {
                if (route.name === Routes.LOGIN) setIsLoading(false);
                else navigation.navigate(Routes.LOGIN);
                return;
            }

            if (route.name === Routes.LOGIN) {
                const userDocument: UserInterface = {
                    displayName: user.displayName || '-',
                    email: user.email || '-',
                };

                const docRef = doc(db, 'users', user.uid);

                await setDoc(docRef, userDocument, {
                    merge: true,
                });

                if (setUser) {
                    setUser(user);
                }
                setIsLoading(false);
                navigation.navigate(Routes.HOME);

                return;
            }

            if (setUser) {
                setUser(user);
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const render = isLoading ? (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="font-{poppins} font-bold text-red-900 text-5xl">
                PABAKAL
            </Text>
            <ActivityIndicator color="black" size="large" />
        </View>
    ) : (
        children
    );

    return <>{render}</>;
};

export default AuthWrapper;
