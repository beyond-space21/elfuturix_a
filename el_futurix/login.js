import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAekwrpB56A5Kib4H9YSwGMzeQap9ZMJAA",
    authDomain: "elfuturix-10101.firebaseapp.com",
    projectId: "elfuturix-10101",
    storageBucket: "elfuturix-10101.appspot.com",
    messagingSenderId: "1001074017564",
    appId: "1:1001074017564:web:3b9faa1c6bfc624622e6d9",
    measurementId: "G-6Q55QC0CPF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
try {
  document.getElementById("log_in_btn").onclick=login;
  document.getElementById("log_out_btn").onclick=logout; 
} catch (error){}


function login() {
    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in:", user);
      document.getElementsByClassName("pic")[0].src = user.photoURL
      document.getElementById("log_in_btn").style.display = "none"
      document.getElementById("log_out_btn").style.display = "block"
      document.getElementById("profile_btn").style.display = "block"
    }).catch((error) => {
      console.error("Error during sign-in:", error);
    });
}

function get_details() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          resolve({
            name: user.displayName,
            photo: user.photoURL, // Fixed photo to be photoURL
            uid: user.uid
          });
        } else {
          // No user is signed in
          resolve(false);
        }
      }, (error) => {
        // If there’s an error in auth state change
        reject(error);
      });
    });
  }

  function logout() {
    signOut(auth)
        .then(() => {
            console.log("User signed out");
            document.getElementsByClassName("pic")[0].src = "el_futurix/img/profile_blank.png"; // Clear profile picture
        })
        .catch((error) => {
            console.error("Error during sign-out:", error);
        });
}

export { login, get_details, logout};