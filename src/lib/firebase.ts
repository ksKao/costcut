// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAGIzl0awfd6hFOJ1qE6YgXd55PhrpgeYc',
	authDomain: 'costcut-82305.firebaseapp.com',
	projectId: 'costcut-82305',
	storageBucket: 'costcut-82305.appspot.com',
	messagingSenderId: '211141510102',
	appId: '1:211141510102:web:c70d47ab29b3fef0b19a77',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
