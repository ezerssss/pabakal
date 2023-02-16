import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: 'pabakal-1ac3b.firebaseapp.com',
    projectId: 'pabakal-1ac3b',
    storageBucket: 'pabakal-1ac3b.appspot.com',
    messagingSenderId: '715366148357',
    appId: '1:715366148357:web:dd213dbde08f05a51cef6c',
};

const app = initializeApp(firebaseConfig);

export default app;
