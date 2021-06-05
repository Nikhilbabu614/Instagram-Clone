import firebase from "firebase";

const firebaseAPP = firebase.initializeApp({
  apiKey: "AIzaSyCYjB6alhe7tVbZ-I6IZJ0CRND18tbNbvA",
  authDomain: "instagram-clone-e1a86.firebaseapp.com",
  projectId: "instagram-clone-e1a86",
  storageBucket: "instagram-clone-e1a86.appspot.com",
  messagingSenderId: "206374012461",
  appId: "1:206374012461:web:a2872df041e3b128c7daa4",
  measurementId: "G-JXZF921NS4"
});

const db = firebaseAPP.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};