import firebaseConfig from "./config.js";
import { initializeApp } from "firebase/app";

const firebase = initializeApp(firebaseConfig);

export default {
  firebase,
};
