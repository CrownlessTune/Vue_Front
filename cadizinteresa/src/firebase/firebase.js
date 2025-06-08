// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdwXH3lLdWeZWaATpruqxJL-rh3fnTs4Y",
  authDomain: "cadizinteresa.firebaseapp.com",
  projectId: "cadizinteresa",
  storageBucket: "cadizinteresa.firebasestorage.app",
  messagingSenderId: "731234512008",
  appId: "1:731234512008:web:ad600b037f2a6c2557c33d",
  measurementId: "G-F6P47M22C3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);