import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyAXNO91O0Sy0VzxRzwYFzhQoeKcGlfr2TI",
    authDomain: "calendar-booking-93bc5.firebaseapp.com",
    databaseURL: "https://calendar-booking-93bc5.firebaseio.com",
    projectId: "calendar-booking-93bc5",
    storageBucket: "calendar-booking-93bc5.appspot.com",
    messagingSenderId: "516107102575",
    appId: "1:516107102575:web:8f4a55fa4f3c345a94e09a",
    measurementId: "G-JE951H1WVN"
  };
const Firebase = firebase.initializeApp(firebaseConfig);
export default Firebase;