import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import type { LotteryState } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyC3Tfu97CDjg7jUxg3GRsEjQm-jHTo6L3o",
  authDomain: "springfestivallottery.firebaseapp.com",
  projectId: "springfestivallottery",
  storageBucket: "springfestivallottery.firebasestorage.app",
  messagingSenderId: "777658683617",
  appId: "1:777658683617:web:7e15a554a7fe39f0a327a0",
  measurementId: "G-RQJLFM5QYT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Subscribe to real-time updates
export function subscribeToLotteryState(callback: (state: LotteryState) => void) {
  const docRef = doc(db, 'lottery', 'lottery_state');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const state = docSnap.data() as LotteryState;
      callback(state);
    }
  });
}
