import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDi4w47VIST9RIQLlCAOmZK7jM-7J7HRx4",
  authDomain: "springfestivallottery.firebaseapp.com",
  projectId: "springfestivallottery",
  storageBucket: "springfestivallottery.firebasestorage.app",
  messagingSenderId: "777658683617",
  appId: "1:777658683617:web:7e15a554a7fe39f0a327a0",
  measurementId: "G-RQJLFM5QYT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
