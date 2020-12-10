import firebase from 'firebase';
import 'firebase/storage';
import 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  /*
    FILL THIS WITH POPULATED INFORMATION RETRIEVED FROM THE LINK IN THE SYSTEM OVERVIEW DOCUMENT
  */
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const auth = firebase.auth();

export { storage, auth, firebase as default };
