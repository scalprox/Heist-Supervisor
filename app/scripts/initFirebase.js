// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCG0zGyABlsi6tH9YJrK24Iy1CEJN6NM-s",
  authDomain: "heist-supervisor.firebaseapp.com",
  projectId: "heist-supervisor",
  storageBucket: "heist-supervisor.appspot.com",
  messagingSenderId: "991582455386",
  appId: "1:991582455386:web:766451a21a8ca17cf73a63",
  measurementId: "G-GZ10GLQXX7",
};
createUserWithEmailAndPassword;
signInWithEmailAndPassword;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export { db, auth, app };
