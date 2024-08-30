import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAoA2BjS5yoSkpWt-CNGVv0AmCsm8Ih70c",
  authDomain: "smart-uni-79625.firebaseapp.com",
  databaseURL: "https://smart-uni-79625-default-rtdb.firebaseio.com",
  projectId: "smart-uni-79625",
  storageBucket: "smart-uni-79625.appspot.com",
  messagingSenderId: "930672197214",
  appId: "1:930672197214:web:22541647d74969fd04becf",
};

// Initialize firebase app.
const app = initializeApp(firebaseConfig);

// Initialize firebase database and get the reference of firebase database object.
const db = getFirestore(app);

const storage = getStorage(app);

export { storage, db };
