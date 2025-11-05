import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtBGV2wPmFfEq-P3DbKytXa1m9wm11a5A",
  authDomain: "input-nilai-mahasiswa-a433e.firebaseapp.com",
  projectId: "input-nilai-mahasiswa-a433e",
  storageBucket: "input-nilai-mahasiswa-a433e.appspot.com",
  messagingSenderId: "743291712241",
  appId: "1:743291712241:web:39a816126786a44cf7af50",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
