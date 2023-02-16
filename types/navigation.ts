import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamsList = {
    Login: undefined;
    Home: undefined;
    Chat: undefined;
};

export type RootNavigationProps = NativeStackScreenProps<RootStackParamsList>;

export type HomeStackParamsList = {
    Order: undefined;
    Deliver: undefined;
};

export type HomeNavigationProps = NativeStackScreenProps<HomeStackParamsList>;

export type ChatStackParamsList = {
    List: undefined;
    Individual: { student: string; email: string };
};

export type ChatNavigationProps = NativeStackScreenProps<
    ChatStackParamsList,
    'Individual'
>;
