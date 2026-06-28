import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC00lQT3yCkeEYG2cWwj9XriRQtyKiIHn0",
    authDomain: "carboncoach-iq.firebaseapp.com",
    projectId: "carboncoach-iq",
    storageBucket: "carboncoach-iq.firebasestorage.app",
    messagingSenderId: "454127288672",
    appId: "1:454127288672:web:f90d29d1f9089c601e9e05",
    measurementId: "G-J0HEZWE2CC",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();