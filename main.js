//application
import { login,get_details} from './el_futurix/login.js'


get_details().then((userDetails) => {
    if (userDetails) {
    console.log("user loged in");
    console.log(userDetails);
    document.getElementsByClassName("pic")[0].src = userDetails.photo
    document.getElementById("log_in_btn").style.display = "none"
    document.getElementById("log_out_btn").style.display = "block"
    document.getElementById("profile_btn").style.display = "block"
    } else {
      console.log("No user is signed in.");
    }
  }).catch((error) => {
    console.error("Error getting user details:", error);
  });