import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import Student from './Student';
import { PlaceInterface } from '../../../../../interfaces/place';
import NoPresentStudents from './NoPresentStudents';

interface PropsInterface {
    place: PlaceInterface;
}

const Place = (props: PropsInterface) => {
    const { place } = props;

    const [isOpen, setIsOpen] = useState(false);

    const renderStudents = isOpen && (
        <FlatList
            data={place.students}
            renderItem={({ item }) => <Student student={item} />}
            keyExtractor={(student) => student.email}
            ListEmptyComponent={NoPresentStudents}
        />
    );

    function handleOpenPlace() {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <TouchableOpacity
                className="flex-row justify-center items-center gap-3 font-medium mt-1 mb-3 w-72 mx-auto"
                onPress={handleOpenPlace}
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
                    <View className="flex-row gap-1 items-center">
                        <Text className="font-{poppins} text-sm text-gray-400">
                            Students Present:
                        </Text>
                        <Text className="font-{poppins} text-sm font-bold">
                            {place.students.length}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            {renderStudents}
            <View className="h-[1px] w-64 mx-auto bg-gray-300" />
        </>
    );
};

export default Place;
