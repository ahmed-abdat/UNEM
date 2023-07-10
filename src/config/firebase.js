// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDYMQFDfPSyEnUslkTeENZSR1YpcKDfVvk",
  authDomain: "unem-c7666.firebaseapp.com",
  projectId: "unem-c7666",
  storageBucket: "unem-c7666.appspot.com",
  messagingSenderId: "905793086285",
  appId: "1:905793086285:web:2f6430bb50b9e805aacd04",
  measurementId: "G-S5Q5JJ2QF9",
  databaseURL: "https://unem-c7666-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);


