import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import {
    clearDeliverInfo,
    getDeliverInfo,
    getDeliverPlaceInfo,
    saveDeliverPlaceInfo,
    saveDeliverStatus,
} from '../../../../helpers/deliver';
import { StudentPresentInterface } from '../../../../interfaces/place';
import UserContext from '../../../../context/UserContext';
import {
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import db from '../../../../firebase/db';

interface PropsInterface {
    isLoading: boolean;
    onToggleLoading: (status: boolean) => void;
    onToggleStatus: () => void;
}

const StopAccepting = (props: PropsInterface) => {
    const { isLoading, onToggleLoading, onToggleStatus } = props;

    const [location, setLocation] = useState('');
    const [info, setInfo] = useState<StudentPresentInterface>({
        eta: '',
        fee: 0,
        max: 0,
        name: '',
        email: '',
        returning: '',
    });
    const { user } = useContext(UserContext);

    useEffect(() => {
        async function getInfo() {
            const { fee, max, eta, returning } = await getDeliverInfo();
            setInfo({
                fee,
                max,
                eta,
                returning,
                email: user?.email || '',
                name: user?.displayName || '',
            });

            setLocation(await getDeliverPlaceInfo());
        }

        getInfo();
    }, []);

    async function handlePostToDB() {
        const placesRef = collection(db, 'places');
        let docID = '';
        let docStudentArray: StudentPresentInterface[] = [];
        const q = query(placesRef, where('name', '==', location));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            docID = doc.id;
            docStudentArray = doc.data().students as StudentPresentInterface[];
        });

        const docRef = doc(db, 'places', docID);
        const updatedArray = docStudentArray.filter(
            (student) => student.email !== info.email,
        );

        await updateDoc(docRef, {
            students: updatedArray,
        });
    }

    async function handleStopAccepting() {
        onToggleLoading(true);

        await clearDeliverInfo();
        await saveDeliverStatus(false);
        await saveDeliverPlaceInfo('');
        await handlePostToDB();

        onToggleLoading(false);
        onToggleStatus();
    }

    const renderButtonText = isLoading ? (
        <ActivityIndicator color="black" />
    ) : (
        <Text className="font-{poppins} text-white font-bold text-center">
            STOP ACCEPTING ORDERS
        </Text>
    );

    return (
        <>
            <View className="mb-3">
                <Text className="font-{poppins} font-bold mb-1">
                    Current Location:
                </Text>
                <Text className="font-{poppins} mb-1">{location}</Text>
            </View>
            <View className="mb-3">
                <Text className="font-{poppins} font-bold mb-1">Fee:</Text>
                <Text className="font-{poppins} mb-1">₱ {info.fee}</Text>
            </View>
            <View className="mb-3">
                <Text className="font-{poppins} font-bold mb-1">
                    Max Order Value:
                </Text>
                <Text className="font-{poppins} mb-1">₱ {info.max}</Text>
            </View>
            <View className="mb-3">
                <Text className="font-{poppins} font-bold mb-1">
                    Returning to:
                </Text>
                <Text className="font-{poppins} mb-1">{info.returning}</Text>
            </View>
            <TouchableOpacity
                className="p-3 border bg-red-500 mt-4 rounded-lg"
                disabled={isLoading}
                onPress={handleStopAccepting}
            >
                {renderButtonText}
            </TouchableOpacity>
        </>
    );
};

export default StopAccepting;
