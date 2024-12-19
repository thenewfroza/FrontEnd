import Headroom from "headroom.js";

document.addEventListener("DOMContentLoaded", () => {
    const myElement = document.querySelector("header");
    const headroom = new Headroom(myElement);
    headroom.init();
});