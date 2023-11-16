// ------------ Navbar functions ------------
const navButton = document.getElementById("nav-btn");
const modalNav = document.getElementById("modal-nav");
const closeModal = document.getElementById("close-modal");
const root = document.querySelector(":root");
const theme = document.getElementById("theme");
const lightMode = document.getElementById("light-mode");
const darkMode = document.getElementById("dark-mode");

// ----------- Close mobile navigation menu -----------
window.addEventListener("resize", () => {
    if(window.innerWidth >= 700) {
        modalNav.close();
    }
});

// ----------- Click event to open/close navigation menu (Dialog) -----------
navButton.addEventListener("click", () => {
    navButton.setAttribute("aria-expanded", "true");
    modalNav.showModal();
    modalNav.setAttribute("data-state", "opened");
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

    modalNav.addEventListener("animationend", () => {
        modalNav.close();
        modalNav.setAttribute("data-state", "closed");
    }, {once: true});
}

// ----------- Applying apropriate description on theme button -----------
checkTheme();

function checkTheme() {
    if(localStorage.getItem("theme") === "dark-mode") {
        theme.setAttribute("aria-label", "Change to light mode");
        theme.setAttribute("title", "Change to light mode");
        lightMode.classList.remove("hide");
        darkMode.classList.add("hide");

        applyTheme();
    }
    else if(localStorage.getItem("theme") === "light-mode") {
        darkMode.classList.remove("hide");
        applyTheme();
    }
    else if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme.setAttribute("aria-label", "Change to light mode");
        theme.setAttribute("title", "Change to light mode");
        darkMode.classList.add("hide");
        lightMode.classList.remove("hide");

        applyTheme();
    }
    else {
        darkMode.classList.remove("hide");
        lightMode.classList.add("hide");
    }
}

// ----------- Event of the theme button -----------
theme.addEventListener("click", () => {
    if(localStorage.getItem("theme") === "dark-mode") {
        localStorage.setItem("theme", "light-mode");
        theme.setAttribute("aria-label", "Change to dark mode");
        theme.setAttribute("title", "Change to dark mode");
        lightMode.classList.add("hide");
        darkMode.classList.remove("hide");

        applyTheme();
    }
    else if(localStorage.getItem("theme") === "light-mode") {
        localStorage.setItem("theme", "dark-mode");
        theme.setAttribute("aria-label", "Change to light mode");
        theme.setAttribute("title", "Change to light mode");
        darkMode.classList.add("hide");
        lightMode.classList.remove("hide");

        applyTheme();
    }
    else if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
        localStorage.setItem("theme", "light-mode");
        theme.setAttribute("aria-label", "Change to dark mode");
        theme.setAttribute("title", "Change to dark mode");
        lightMode.classList.add("hide");
        darkMode.classList.remove("hide");

        applyTheme();
    }
});

// ----------- Verify which theme to apply based on local storage -----------
function applyTheme() {
    if(localStorage.getItem("theme")) {
        if(localStorage.getItem("theme") === "dark-mode") {
            root.style.setProperty("--color", "var(--white)");
            root.style.setProperty("--theme", "var(--clr-quaternary)");
            root.style.setProperty("--shadow", "var(--black-25)");
            root.style.setProperty("--clr-skeleton", "var(--black-50)");
        }
        else {
            root.style.setProperty("--color", "var(--black)");
            root.style.setProperty("--theme", "var(--white)");
            root.style.setProperty("--shadow", "var(--black-5)");
            root.style.setProperty("--clr-skeleton", "var(--black-10)");
        }
    }
}