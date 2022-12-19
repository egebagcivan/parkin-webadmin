import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB8wHxx1CRyR_S-2zK6Ggu9Id4Q3FGNAeQ",
  authDomain: "otoparkbul-yu.firebaseapp.com",
  projectId: "otoparkbul-yu",
  storageBucket: "otoparkbul-yu.appspot.com",
  messagingSenderId: "180183630226",
  appId: "1:180183630226:web:c359a3364f4c03d9b9c14b",
  measurementId: "G-PCEJXXFT94"
};

const app = initializeApp(firebaseConfig);
const fireDb = getFirestore(app);
const storage = getStorage(app);

export { fireDb, app, storage };
