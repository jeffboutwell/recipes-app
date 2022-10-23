import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjkN8VGiogpjAQ2uNxtXpxVUocwcgJ8ag",
  authDomain: "recipes-app-a8829.firebaseapp.com",
  projectId: "recipes-app-a8829",
  storageBucket: "recipes-app-a8829.appspot.com",
  messagingSenderId: "53838843168",
  appId: "1:53838843168:web:769fefdbee330fb76b1b45"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()