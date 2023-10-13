// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2KFIc-dguxqYb_tt-CUVmMC5_TI0GkSI",
  authDomain: "accommodationfindersystem.firebaseapp.com",
  projectId: "accommodationfindersystem",
  storageBucket: "accommodationfindersystem.appspot.com",
  messagingSenderId: "59900464147",
  appId: "1:59900464147:web:b8c7eb4c619d7d362e83e6",
  measurementId: "G-WY6NWCE5W3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
