// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlwxx_M0BnSSXQJz1q5v7Xzt3h4QmVZiI",
  authDomain: "emotoverse.firebaseapp.com",
  projectId: "emotoverse",
  storageBucket: "emotoverse.firebasestorage.app",
  messagingSenderId: "587179197091",
  appId: "1:587179197091:web:7bec1feea80ab408567516",
  measurementId: "G-0E1WWFLXDJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };