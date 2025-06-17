// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdwXH3lLdWeZWaATpruqxJL-rh3fnTs4Y",
  authDomain: "cadizinteresa.firebaseapp.com",
  projectId: "cadizinteresa",
  messagingSenderId: "731234512008",
  appId: "1:731234512008:web:ad600b037f2a6c2557c33d",
  measurementId: "G-F6P47M22C3"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const analytics = getAnalytics(app)

export { auth, db, analytics }
