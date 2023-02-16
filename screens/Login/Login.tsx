import React, { useEffect, useState } from 'react';
import ContentWrapper from '../../components/ContentWrapper';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import {
    GoogleAuthProvider,
    OAuthCredential,
    signInWithCredential,
} from 'firebase/auth';
import auth from '../../firebase/auth';
import { RootNavigationProps } from '../../types/navigation';
import AuthWrapper from '../../components/AuthWrapper';

const Login = ({ navigation }: RootNavigationProps) => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId:
            '715366148357-15dcm6fn82fr63pp7c85fk9rnjdo05mc.apps.googleusercontent.com',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function handleSignIn(credential: OAuthCredential) {
            await signInWithCredential(auth, credential);
            navigation.navigate('Home');
        }

        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            handleSignIn(credential);
        }
    }, [response]);

    function handleLogin() {
        setIsLoading(true);
        promptAsync();
    }

    const renderButton = isLoading ? (
        <ActivityIndicator color="black" size="large" />
    ) : (
        <TouchableOpacity
            className="p-2 border rounded-lg"
            disabled={!request}
            onPress={handleLogin}
        >
            <Text className="font-{poppins}">Sign in with Google</Text>
        </TouchableOpacity>
    );

    return (
        <AuthWrapper>
            <ContentWrapper>
                <View className="flex-1 items-center justify-center gap-2">
                    <Text className="font-{poppins} font-bold text-red-900 text-5xl">
                        PABAKAL
                    </Text>
                    {renderButton}
                </View>
            </ContentWrapper>
        </AuthWrapper>
    );
};

export default Login;
