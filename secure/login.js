import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCnwtLdU4myw7AdkoKNnUk0_vdQLGLMryg",
    authDomain: "planetoid.nuhro.xyz",
    projectId: "planetoid-f88bb",
    storageBucket: "planetoid-f88bb.appspot.com",
    messagingSenderId: "564500665138",
    appId: "1:564500665138:web:82882460b1085900647d2b",
    measurementId: "G-YGFY7HSWF0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const loginBtn = document.getElementById("login_btn"); // Get the button element

document.getElementById('filtr').className = 'blur'
// function initapp() {
//     onAuthStateChanged(auth, function (user) {
//         if (user) {
//             document.getElementById('filtr').className = 'blur'
//             document.getElementById('load').style.display = 'block'
//             window.location = '/home'
//         } else {
//             // alert("No user!")
//             console.log('not signed in');
//             document.getElementById('filtr').className = ''
//             document.getElementById('load').style.display = 'none'
//         }
//     });
// }

function login() {
    signInWithRedirect(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        });
}

export { login, loginBtn }; // Export the login function and the button element
