import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth/web-extension";

const firebaseConfig = {
  apiKey: "AIzaSyCG0zGyABlsi6tH9YJrK24Iy1CEJN6NM-s",
  authDomain: "heist-supervisor.firebaseapp.com",
  projectId: "heist-supervisor",
  storageBucket: "heist-supervisor.appspot.com",
  messagingSenderId: "991582455386",
  appId: "1:991582455386:web:766451a21a8ca17cf73a63",
  measurementId: "G-GZ10GLQXX7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export { db, auth, app };
