import {initializeApp} from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyDuyeAXZ_lF4QRGiB4AvjBF0sEec4KqgKw',
    authDomain: 'toniq-1c4d2.firebaseapp.com',
    projectId: 'toniq-1c4d2',
    storageBucket: 'toniq-1c4d2.appspot.com',
    messagingSenderId: '617697320906',
    appId: '1:617697320906:web:3c036c38c54f0c67767933',
    measurementId: 'G-QZX128LSHJ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
