import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HomeNavigationProps } from '../../../../types/navigation';
import Place from './Place/Place';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import db from '../../../../firebase/db';
import { PlaceInterface } from '../../../../interfaces/place';

const Order = ({ navigation }: HomeNavigationProps) => {
    function handleToDeliver() {
        navigation.navigate('Deliver');
    }

    const [isLoading, setIsLoading] = useState(true);
    const [places, setPlaces] = useState<PlaceInterface[]>([]);

    async function handleGetPlaces() {
        try {
            const placesRef = collection(db, 'places');
            const querySnapshot = await getDocs(placesRef);

            const placesArray: PlaceInterface[] = [];

            querySnapshot.forEach((doc) => {
                const place = doc.data() as PlaceInterface;
                placesArray.push(place);
            });

            setPlaces(placesArray);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const placesRef = collection(db, 'places');

        const unsubscribe = onSnapshot(placesRef, (querySnapshot) => {
            const placesArray: PlaceInterface[] = [];

            querySnapshot.forEach((doc) => {
                const place = doc.data() as PlaceInterface;
                placesArray.push(place);
            });

            setPlaces(placesArray);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    function handleRefresh() {
        setIsLoading(true);
        handleGetPlaces();
    }

    return (
        <View className="bg-white flex-1">
            <View className="flex-row border border-gray-300 rounded-3xl mb-5">
                <TouchableOpacity className="flex-1 p-2 items-center bg-red-500 rounded-2xl my-[2px] mx-1">
                    <Text className="text-white font-{poppins}">ORDERING</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 p-2 items-center rounded-2xl my-[2px] mx-1"
                    onPress={handleToDeliver}
                >
                    <Text className="font-{poppins}">DELIVERING</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                refreshing={isLoading}
                data={places}
                renderItem={({ item }) => <Place place={item} />}
                keyExtractor={(place) => place.name}
                onRefresh={handleRefresh}
            />
        </View>
    );
};

export default Order;
