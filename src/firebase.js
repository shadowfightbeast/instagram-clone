import firebase from  "firebase";

const firebaseApp =firebase.initializeApp({
    apiKey: "AIzaSyBx78_dwtBKkBqCq19W7FbAwTTq_u4ZocQ",
    authDomain: "instagram-clone-react-7f84a.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-7f84a-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-react-7f84a",
    storageBucket: "instagram-clone-react-7f84a.appspot.com",
    messagingSenderId: "740691761060",
    appId: "1:740691761060:web:e88c858623329283519331",
    measurementId: "G-9Z57E8JD3S"


  });

const db = firebaseApp.firestore();
const auth  = firebase.auth() ;
const storage =firebase.storage();

export {db,auth,storage}

//   export default firebaseConfig;