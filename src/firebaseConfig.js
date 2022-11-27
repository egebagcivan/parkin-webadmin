import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_iRVTuf9uO0Uk6lCXLEvk52dB3e4b78c",
  authDomain: "yasarproject-25c41.firebaseapp.com",
  projectId: "yasarproject-25c41",
  storageBucket: "yasarproject-25c41.appspot.com",
  messagingSenderId: "196086063021",
  appId: "1:196086063021:web:f72a0852d1f5a5fb81cb24",
  measurementId: "G-3L8D7NHYMF"
};

const app = initializeApp(firebaseConfig);
const fireDb = getFirestore(app);

export { fireDb, app };
