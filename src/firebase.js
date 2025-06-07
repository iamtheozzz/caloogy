// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXNFFnieboS7SaQxQDagvk555aYtrvEMs",
  authDomain: "caloogy-48c15.firebaseapp.com",
  projectId: "caloogy-48c15",
  storageBucket: "caloogy-48c15.firebasestorage.app",
  messagingSenderId: "832171939582",
  appId: "1:832171939582:web:f9c33a660f07ec245d77af",
  measurementId: "G-SB62RBNMMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;