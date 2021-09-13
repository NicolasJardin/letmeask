import * as firebase from 'firebase/app'


import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref, getDatabase, push, set, get, onValue} from 'firebase/database'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

firebase.initializeApp(firebaseConfig)

const auth = {
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
    onAuthStateChanged
}

const database = {
    onValue,
    get,
    set,
    push,
    getDatabase,
    ref
}

export { firebase, auth, database }

