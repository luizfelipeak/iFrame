// ------------ Navbar functions ------------
const navButton = document.getElementById("nav-btn");
const modalNav = document.getElementById("modal-nav");
const closeModal = document.getElementById("close-modal");
const body = document.querySelector("body");
const lightTheme = document.getElementById("light-theme");
const darkTheme = document.getElementById("dark-theme");

// ----------- Close mobile navigation menu -----------
window.addEventListener("resize", () => {
    if(window.innerWidth >= 700) {
        modalNav.close();
    }
});

// ----------- Click event to open/close navigation menu (Dialog) -----------
navButton.addEventListener("click", () => {
    navButton.setAttribute("aria-expanded", "true");
    modalNav.setAttribute("data-state", "opened");
    modalNav.showModal();
});

closeModal.addEventListener("click", () => {
    closeDialogModal();
});

modalNav.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialogModal();
});

function closeDialogModal() {
    navButton.setAttribute("aria-expanded", "false");
    modalNav.setAttribute("data-state", "closing");

    if(window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        modalNav.addEventListener("animationend", () => {
            modalNav.close();
            modalNav.setAttribute("data-state", "closed");
        }, {once: true});
    }
    else {
        modalNav.close();
        modalNav.setAttribute("data-state", "closed");
    }
}

// ----------- Event of the light theme button -----------
lightTheme.addEventListener("click", () => {
    localStorage.setItem("theme", "light-mode");
    darkTheme.classList.remove("hide");
    lightTheme.classList.add("hide");

    applyTheme();
});

// ----------- Event of the dark theme button -----------
darkTheme.addEventListener("click", () => {
    localStorage.setItem("theme", "dark-mode");
    darkTheme.classList.add("hide");
    lightTheme.classList.remove("hide");

    applyTheme();
});

// ----------- Verify which theme to apply based on local storage -----------
function applyTheme() {
    if(localStorage.getItem("theme")) {
        if(localStorage.getItem("theme") === "dark-mode")
            body.classList.add("dark-theme");
        else
            body.classList.remove("dark-theme");
    }
}