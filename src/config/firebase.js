// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmodwu1IfsEZyQxoiPyXvu4vfqSOZ7Ohw",
  authDomain: "study-swift-be3d8.firebaseapp.com",
  projectId: "study-swift-be3d8",
  storageBucket: "study-swift-be3d8.appspot.com",
  messagingSenderId: "956704011057",
  appId: "1:956704011057:web:e339d733b44fcc81373610",
  measurementId: "G-6B5ME372HJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);
