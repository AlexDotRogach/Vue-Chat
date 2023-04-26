import { getFirestore } from "firebase/firestore";
import firebase from "../firebase.js";

const firestore = getFirestore(firebase.firebase);

export default firestore;
