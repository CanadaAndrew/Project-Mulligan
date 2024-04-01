//I copy and pasted Cameron's code from DT-5 so that I could test
//The two files should be nearly identical, so hopefully there won't be too many issues merging


//It was necessary to name this as a JS file due to TS having an error reading captchas
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBgg-fehkPBZ7D3ZsGNo2rqJ4rgk26to20",
    authDomain: "project-mullet-34cc4.firebaseapp.com",
    projectId: "project-mullet-34cc4",
    storageBucket: "project-mullet-34cc4.appspot.com",
    messagingSenderId: "1058338614883",
    appId: "1:1058338614883:web:02e0d88cff9f1f44b35256",
    measurementId: "G-ZSHM08TW82"
};

// Initialize Firebase with the config we copy/pasted from our account
const firebase = initializeApp(firebaseConfig);
//this firebase variable is important. Use it to initialize all the Firebase services, such as Authentication
//by calling the let auth = getAuth(firebase); and passing it this firebase variable.
//the different services are listed on the Firebase website if we have a need for them.
export default firebase;