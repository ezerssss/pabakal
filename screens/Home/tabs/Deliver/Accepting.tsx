import {
    TextInput,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Place from './Place/Place';
import {
    PlaceInterface,
    StudentPresentInterface,
} from '../../../../interfaces/place';
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
import {
    saveDeliverInfo,
    saveDeliverPlaceInfo,
    saveDeliverStatus,
} from '../../../../helpers/deliver';

interface PropsInterface {
    isLoading: boolean;
    onToggleLoading: (status: boolean) => void;
    onToggleStatus: () => void;
}

const Accepting = (props: PropsInterface) => {
    const { isLoading, onToggleLoading, onToggleStatus } = props;
    const { user } = useContext(UserContext);

    const [places, setPlaces] = useState<PlaceInterface[]>([]);

    useEffect(() => {
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
            }
        }

        handleGetPlaces();
    }, []);

    const [location, setLocation] = useState('');
    const [info, setInfo] = useState<Record<string, any>>({
        eta: '',
        fee: 0,
        max: 0,
        name: '',
        email: '',
        returning: '',
    });

    function handleEditInfoString(key: string, data: string) {
        setInfo({ ...info, [key]: data });
    }

    function handleEditInfoNumber(key: string, data: string) {
        const convertedNumber = Number(data.replace(/\,/g, ''));

        setInfo({ ...info, [key]: convertedNumber });
    }

    async function handlePostToDB() {
        const placesRef = collection(db, 'places');
        let docID = '';
        let docStudentArray: any = [];
        const q = query(placesRef, where('name', '==', location));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            docID = doc.id;
            docStudentArray = doc.data().students;
        });

        const docRef = doc(db, 'places', docID);
        await updateDoc(docRef, {
            students: [...docStudentArray, info],
        });
    }

    async function handleStartAccepting() {
        for (let key in info) {
            if (!info[key]) {
                return;
            }
        }
        if (!location) {
            return;
        }

        onToggleLoading(true);
        await saveDeliverInfo(info as StudentPresentInterface);
        await saveDeliverStatus(true);
        await saveDeliverPlaceInfo(location);
        await handlePostToDB();

        onToggleLoading(false);
        onToggleStatus();
    }

    useEffect(() => {
        setInfo({
            ...info,
            name: user?.displayName || '',
            email: user?.email || '',
        });
    }, [user]);

    function handleLocation(place: PlaceInterface) {
        setLocation(place.name);
    }

    const renderButtonText = isLoading ? (
        <ActivityIndicator color="black" />
    ) : (
        <Text className="font-{poppins} text-white font-bold text-center">
            START ACCEPTING ORDERS
        </Text>
    );

    return (
        <>
            <Text className="font-{poppins} font-bold mb-1">
                Current Location: {location || '---'}
            </Text>
            <Text className="font-{poppins} font-bold mb-1">Fee:</Text>
            <TextInput
                className="p-2 w-full border rounded-lg mb-2"
                placeholder="₱ 0.00"
                keyboardType="decimal-pad"
                onChangeText={(text) => handleEditInfoNumber('fee', text)}
            />
            <Text className="font-{poppins} font-bold mb-1">
                Max Order Value:
            </Text>
            <TextInput
                className="p-2 w-full border rounded-lg mb-2"
                placeholder="₱ 0.00"
                keyboardType="decimal-pad"
                onChangeText={(text) => handleEditInfoNumber('max', text)}
            />
            <Text className="font-{poppins} font-bold mb-1">Returning to:</Text>
            <TextInput
                className="p-2 w-full border rounded-lg mb-2"
                placeholder="Enter Place"
                onChangeText={(text) => handleEditInfoString('returning', text)}
            />
            <Text className="font-{poppins} font-bold mb-1">
                Estimated Time of Arrival:
            </Text>
            <TextInput
                className="p-2 w-full border rounded-lg mb-3"
                placeholder="12:12 AM|PM"
                onChangeText={(text) => handleEditInfoString('eta', text)}
            />
            <TouchableOpacity
                className="p-3 border bg-green-500 mb-3 rounded-lg"
                disabled={isLoading}
                onPress={handleStartAccepting}
            >
                {renderButtonText}
            </TouchableOpacity>
            <Text className="font-{poppins} font-bold mb-3">
                Choose a location: (scroll)
            </Text>
            <FlatList
                data={places}
                renderItem={({ item }) => (
                    <Place place={item} onClick={handleLocation} />
                )}
                keyExtractor={(place) => place.name}
            />
        </>
    );
};

export default Accepting;
