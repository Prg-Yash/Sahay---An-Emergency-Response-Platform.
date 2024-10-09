// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRI4MERitVmnoc5_KRcQdlfw_tFiw3t5Q",
  authDomain: "sahay-68382.firebaseapp.com",
  projectId: "sahay-68382",
  storageBucket: "sahay-68382.appspot.com",
  messagingSenderId: "227364149097",
  appId: "1:227364149097:web:b62acf2fa75305688bcff8",
  measurementId: "G-WZLTWFCMYK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
