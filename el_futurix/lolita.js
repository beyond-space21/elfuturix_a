window.onload = ()=>{let key = document.getElementsByClassName("key");
Array.from(key).forEach(elm => {
    elm.style = "font-weight: 700; font-size: x-large; color: #00d9ff; background-color: #2c0d0d; border-radius: 5px; padding: 5px; width: fit-content; margin-bottom: 5px;";
});

let val = document.getElementsByClassName("val");
Array.from(val).forEach(elm => {
    elm.style = "font-weight: 100; color: #ffffff;";
});
}