import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HomeNavigationProps } from '../../../../types/navigation';
import Accepting from './Accepting';
import StopAccepting from './StopAccepting';
import { getDeliverStatus } from '../../../../helpers/deliver';

const Deliver = ({ navigation }: HomeNavigationProps) => {
    const [isDelivering, setIsDelivering] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    function handleToggleIsLoading(status: boolean) {
        setIsLoading(status);
    }

    function handleToOrder() {
        navigation.navigate('Order');
    }

    useEffect(() => {
        async function getStorage() {
            setIsDelivering(await getDeliverStatus());
        }

        getStorage();
    }, []);

    function handleToggleStatus() {
        setIsDelivering(!isDelivering);
    }

    const renderAccepting = !isDelivering && (
        <Accepting
            isLoading={isLoading}
            onToggleLoading={handleToggleIsLoading}
            onToggleStatus={handleToggleStatus}
        />
    );
    const renderNotAccepting = isDelivering && (
        <StopAccepting
            isLoading={isLoading}
            onToggleLoading={handleToggleIsLoading}
            onToggleStatus={handleToggleStatus}
        />
    );

    return (
        <View className="bg-white flex-1">
            <View className="flex flex-row border border-gray-300 rounded-3xl mb-5">
                <TouchableOpacity
                    className="flex-1 p-2 items-center rounded-2xl my-[2px] mx-1"
                    disabled={isLoading}
                    onPress={handleToOrder}
                >
                    <Text className="font-{poppins}">ORDERING</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 p-2 items-center bg-red-500 rounded-2xl my-[2px] mx-1">
                    <Text className="font-{poppins} text-white">
                        DELIVERING
                    </Text>
                </TouchableOpacity>
            </View>
            {renderAccepting}
            {renderNotAccepting}
        </View>
    );
};

export default Deliver;
