var firebaseConfig = {
    apiKey: "AIzaSyD-FzCFNKKUlRyuqDitOKl7exXbu8YhGfE",
    authDomain: "mygoalsquad.firebaseapp.com",
    databaseURL: "https://mygoalsquad.firebaseio.com",
    projectId: "mygoalsquad",
    storageBucket: "mygoalsquad.appspot.com",
    messagingSenderId: "577390043871",
    appId: "1:577390043871:web:1c4e34f73663b13c3ebf6a",
    measurementId: "G-38YM9W2JM0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();