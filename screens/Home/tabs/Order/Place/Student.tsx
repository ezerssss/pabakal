import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StudentPresentInterface } from '../../../../../interfaces/place';

interface PropsInterface {
    student: StudentPresentInterface;
}

const Student = (props: PropsInterface) => {
    const { student } = props;
    const { name, fee, max, returning, eta, email } = student;

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    return (
        <TouchableOpacity
            className="my-8 flex-row justify-center items-center gap-3 w-72 mx-auto"
            onPress={() =>
                navigation.navigate('Chat', {
                    screen: 'Individual',
                    params: { student: name, email },
                })
            }
        >
            <Image
                className="h-14 w-14"
                resizeMode="contain"
                source={require('../../../../../assets/images/placeholder-account.png')}
            />
            <View>
                <Text className="font-{poppins}">{name}</Text>
                <View className="flex-row gap-1">
                    <Text className="font-{poppins} text-gray-400 text-xs">
                        Fee:
                    </Text>
                    <Text className="font-{poppins} text-green-600 text-xs">
                        ₱ {fee}
                    </Text>
                </View>
                <View className="flex-row gap-1">
                    <Text className="font-{poppins} text-gray-400 text-xs">
                        Max:
                    </Text>
                    <Text className="font-{poppins} text-red-600 text-xs">
                        ₱ {max}
                    </Text>
                </View>
                <View className="flex-row gap-1">
                    <Text className="font-{poppins} text-gray-400 text-xs">
                        Returning to:
                    </Text>
                    <Text className="font-{poppins} font-bold text-xs">
                        {returning}
                    </Text>
                </View>
                <View className="flex-row gap-1">
                    <Text className="font-{poppins} text-gray-400 text-xs">
                        ETA:
                    </Text>
                    <Text className="font-{poppins} text-xs">{eta}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default Student;
