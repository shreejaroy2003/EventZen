import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBGwd4s5iPGJJPjN2Wpq4YVpef58Acj4Lc",
    authDomain: "eventzen-494be.firebaseapp.com",
    projectId: "eventzen-494be",
    storageBucket: "eventzen-494be.firebasestorage.app",
    messagingSenderId: "42621090812",
    appId: "1:42621090812:web:312590d8341de125891079",
    measurementId: "G-R3ZV0S4PQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");
