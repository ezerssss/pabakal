import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudentPresentInterface } from '../interfaces/place';

export async function saveDeliverStatus(isDelivering: boolean) {
    await AsyncStorage.setItem('isDelivering', isDelivering.toString());
}

export async function getDeliverStatus(): Promise<boolean> {
    const isDelivering =
        (await AsyncStorage.getItem('isDelivering')) === 'true';

    return isDelivering;
}

export async function saveDeliverInfo(info: StudentPresentInterface) {
    const { eta, fee, max, returning } = info;

    await AsyncStorage.setItem('eta', eta);
    await AsyncStorage.setItem('fee', fee.toString());
    await AsyncStorage.setItem('max', max.toString());
    await AsyncStorage.setItem('returning', returning);
}

export async function clearDeliverInfo() {
    await AsyncStorage.setItem('eta', '');
    await AsyncStorage.setItem('fee', '');
    await AsyncStorage.setItem('max', '');
    await AsyncStorage.setItem('returning', '');
}

export async function getDeliverInfo(): Promise<StudentPresentInterface> {
    const eta = (await AsyncStorage.getItem('eta')) || '';
    const fee = Number(await AsyncStorage.getItem('fee'));
    const max = Number(await AsyncStorage.getItem('max'));
    const returning = (await AsyncStorage.getItem('returning')) || '';

    return { name: '', email: '', eta, fee, max, returning };
}

export async function getDeliverPlaceInfo(): Promise<string> {
    return (await AsyncStorage.getItem('location')) || '';
}

export async function saveDeliverPlaceInfo(location: string) {
    await AsyncStorage.setItem('location', location);
}
