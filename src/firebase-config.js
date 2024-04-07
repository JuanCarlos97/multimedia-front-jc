import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDR2-Wy7EKpHq6P06-tuuXqLmaAcFTBc3E",
    authDomain: "pruebatecnica-7946d.firebaseapp.com",
    projectId: "pruebatecnica-7946d",
    storageBucket: "pruebatecnica-7946d.appspot.com",
    messagingSenderId: "495383506139",
    appId: "1:495383506139:web:8dee13f144ccf8e69db0fe"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);