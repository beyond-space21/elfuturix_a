window.onload = () => {
    let key = document.getElementsByClassName("key");

    var rg = document.getElementById("frm_cnt")
    rg.style.marginLeft = (window.innerWidth - 354) / 2 + 'px'


}


// Function to simulate fetching member name by student ID
function fetchMemberName(member) {
    const studentId = document.getElementById(member).value;
    const nameDisplay = document.getElementById(`${member}-name`);

    if (studentId) {
        // Simulate fetching name with student ID (replace with real API call)
        const memberName = "Name for " + studentId; // Simulated response
        nameDisplay.textContent = memberName;
    } else {
        nameDisplay.textContent = "Please enter a valid Student ID";
    }
}

// Function to handle form validation
function validateForm(event) {
    event.preventDefault();
    // Add your form validation logic here
    alert("Form submitted successfully!");
}

// Function to close modal
function closeModal() {
    document.getElementById('frm_cv').style.display = 'none';
}

// Optional: Function to open modal (if needed)
function openModal() {
    document.getElementById('frm_cv').style.display = 'block';
}


//registration timer
setInterval(()=>{
    document.getElementsByClassName('btn')[0].innerHTML = countdown()
},1000)

function countdown(){
    const countDate = new Date("October 12, 2024 10:00:00").getTime();

    const now = new Date().getTime();
    const gap = countDate - now;

    // Time calculations for days, hours, minutes, and seconds
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(gap / day);
    const hours = Math.floor((gap % day) / hour);
    const minutes = Math.floor((gap % hour) / minute);
    const seconds = Math.floor((gap % minute) / second);

    return "Register in " + hours + " : " + minutes + " : " + seconds
};

document.getElementsByClassName("container")[0].style.backgroundColor = "transparent"
document.getElementsByClassName("container")[0].style.margin = "unset"
document.getElementsByClassName("container")[0].style.padding = "unset"
document.getElementsByTagName("body")[0].style.backgroundColor = "rgba(61, 61, 61, 0.47)"
