// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAYDoGzJUIYtx-vg_Dp2kdVXEh7uyPOpM",
  authDomain: "ecomrolodex-42ad9.firebaseapp.com",
  databaseURL: "https://ecomrolodex-42ad9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ecomrolodex-42ad9",
  storageBucket: "ecomrolodex-42ad9.appspot.com",
  messagingSenderId: "392811098027",
  appId: "1:392811098027:web:e15e0a2de1ebb65f916cee",
  measurementId: "G-BFTMBPLSSK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
