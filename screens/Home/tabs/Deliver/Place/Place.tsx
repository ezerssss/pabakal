import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { PlaceInterface } from '../../../../../interfaces/place';

interface PropsInterface {
    place: PlaceInterface;
    onClick: (place: PlaceInterface) => void;
}

const Place = (props: PropsInterface) => {
    const { place, onClick } = props;

    return (
        <TouchableOpacity
            className="flex-row justify-center items-center gap-3 font-medium my-1 w-72 mx-auto"
            onPress={() => onClick(place)}
        >
            <Image
                className="h-24 w-24"
                resizeMode="contain"
                source={require('../../../../../assets/images/placeholder-restaurant.png')}
            />
            <View>
                <Text className="font-{poppins} text-lg">{place.name}</Text>
                <Text className="font-{poppins} text-sm text-gray-400">
                    {place.address}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default Place;
